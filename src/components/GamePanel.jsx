import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, SkipBack, Loader2, Camera } from 'lucide-react';
import useStockfish from '../hooks/useStockfish';
import AdSlot from './AdSlot';

export default function GamePanel({ id, label, colorClass, fen: initialFen, onSplit }) {
    const [game, setGame] = useState(() => {
        const g = new Chess();
        if (initialFen) g.load(initialFen);
        return g;
    });
    const [moveHistory, setMoveHistory] = useState([]);
    const [boardOrientation, setBoardOrientation] = useState('white');
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [isThinking, setIsThinking] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState(null);
    const fileInputRef = useRef(null);
    const toastTimerRef = useRef(null);

    const { getBestMove, ready: engineReady } = useStockfish();
    const thinkingTimeoutRef = useRef(null);

    const currentFen = game.fen();
    const isGameOver = game.isGameOver();
    const inCheck = game.inCheck();
    const turn = game.turn() === 'w' ? 'White' : 'Black';

    const statusText = useMemo(() => {
        if (isThinking) return '✦ Engine thinking…';
        if (game.isCheckmate()) return `Checkmate — ${game.turn() === 'w' ? 'Black' : 'White'} wins`;
        if (game.isStalemate()) return 'Stalemate — Draw';
        if (game.isDraw()) return 'Draw';
        if (inCheck) return `${turn} is in check`;
        return `${turn} to move`;
    }, [currentFen, isThinking]);

    /* ── Trigger AI response after White moves ── */
    const triggerAI = useCallback(async (fen) => {
        console.log('[TwoLives] triggerAI called | engineReady:', engineReady, '| fen:', fen);
        if (!engineReady) {
            console.warn('[TwoLives] triggerAI aborted — engine not ready');
            return;
        }

        setIsThinking(true);

        // Small delay for realism
        await new Promise(r => setTimeout(r, 500));

        try {
            const bestMoveUci = await getBestMove(fen, 12);
            console.log('[TwoLives] Stockfish bestmove:', bestMoveUci);

            if (!bestMoveUci || bestMoveUci === '(none)') {
                setIsThinking(false);
                return;
            }

            // Parse UCI move (e.g. "e7e5" or "e7e8q" for promotion)
            const from = bestMoveUci.slice(0, 2);
            const to = bestMoveUci.slice(2, 4);
            const promotion = bestMoveUci.length > 4 ? bestMoveUci[4] : undefined;

            setGame(prev => {
                const gameCopy = new Chess(prev.fen());
                const move = gameCopy.move({ from, to, promotion: promotion || 'q' });
                if (move) {
                    setMoveHistory(h => [...h, move.san]);
                    return gameCopy;
                }
                return prev;
            });
        } catch (err) {
            console.error('[TwoLives] Stockfish error:', err);
        } finally {
            setIsThinking(false);
        }
    }, [engineReady, getBestMove]);

    /* ── Shared move executor (for human White moves) ── */
    const tryMove = useCallback((from, to) => {
        console.log('[TwoLives] tryMove called:', from, '→', to, '| turn:', game.turn());
        const gameCopy = new Chess(game.fen());

        // Only allow White to move
        if (gameCopy.turn() !== 'w') {
            console.log('[TwoLives] tryMove rejected — not White\'s turn');
            return false;
        }

        const move = gameCopy.move({ from, to, promotion: 'q' });
        if (move === null) {
            console.log('[TwoLives] tryMove rejected — illegal move');
            return false;
        }

        console.log('[TwoLives] White played:', move.san);
        setGame(gameCopy);
        setMoveHistory(prev => [...prev, move.san]);
        setSelectedSquare(null);

        // After White moves, trigger AI for Black
        if (!gameCopy.isGameOver()) {
            console.log('[TwoLives] Game not over, triggering AI for Black…');
            triggerAI(gameCopy.fen());
        }

        return true;
    }, [game, triggerAI]);

    /* ── react-chessboard v5: onPieceDrop ── */
    const handlePieceDrop = useCallback(({ sourceSquare, targetSquare }) => {
        console.log('[TwoLives] onPieceDrop:', sourceSquare, '→', targetSquare, '| isThinking:', isThinking);
        if (!targetSquare || isThinking) return false;
        return tryMove(sourceSquare, targetSquare);
    }, [tryMove, isThinking]);

    /* ── Click-to-move: click piece → click destination ── */
    const handleSquareClick = useCallback(({ piece, square }) => {
        if (isThinking) return;

        if (selectedSquare) {
            if (square === selectedSquare) {
                setSelectedSquare(null);
                return;
            }
            const moved = tryMove(selectedSquare, square);
            if (!moved) {
                if (piece) {
                    setSelectedSquare(square);
                } else {
                    setSelectedSquare(null);
                }
            }
            return;
        }

        if (piece) {
            setSelectedSquare(square);
        }
    }, [selectedSquare, tryMove, isThinking]);

    const undoMove = useCallback(() => {
        if (isThinking) return;
        const gameCopy = new Chess(game.fen());
        // Undo both the AI's move and the human's move
        gameCopy.undo(); // undo AI (Black)
        gameCopy.undo(); // undo Human (White)
        setGame(gameCopy);
        setMoveHistory(prev => prev.slice(0, -2));
        setSelectedSquare(null);
    }, [game, isThinking]);

    const resetGame = useCallback(() => {
        if (isThinking) return;
        const g = new Chess();
        if (initialFen) g.load(initialFen);
        setGame(g);
        setMoveHistory([]);
        setSelectedSquare(null);
    }, [initialFen, isThinking]);

    const flipBoard = useCallback(() => {
        setBoardOrientation(prev => prev === 'white' ? 'black' : 'white');
    }, []);

    /* ── Scan Real Board: Gemini Vision handler ── */
    const showScanError = useCallback((msg) => {
        setScanError(msg);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setScanError(null), 4000);
    }, []);

    const handleImageUpload = useCallback(async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setScanError(null);
        event.target.value = '';  // allow re-selecting same file

        try {
            // Convert image to base64
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const mimeType = file.type || 'image/jpeg';

            // Call Gemini 1.5 Flash
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY');

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: 'Analyze this photo of a chessboard. Identify the position of all pieces. Return ONLY the FEN string representing this board state. Do not include any text, explanations, or markdown formatting. Just the FEN.' },
                                { inline_data: { mime_type: mimeType, data: base64 } },
                            ],
                        }],
                    }),
                }
            );

            if (!res.ok) {
                const errBody = await res.text();
                console.error('[ScanBoard] API error:', res.status, errBody);
                throw new Error(`API returned ${res.status}`);
            }

            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            console.log('[ScanBoard] Gemini raw response:', rawText);

            if (!rawText) throw new Error('Empty response from Gemini');

            // Validate FEN with chess.js
            const testGame = new Chess();
            const loaded = testGame.load(rawText);
            if (!loaded) throw new Error('Invalid FEN returned');

            // Success — update game state
            setGame(testGame);
            setMoveHistory([]);
            setSelectedSquare(null);
        } catch (err) {
            console.error('[ScanBoard] Error:', err);
            showScanError('Could not recognize the board. Please try a clearer photo.');
        } finally {
            setIsScanning(false);
        }
    }, [showScanError]);

    /* ── Cleanup pending timeouts ── */
    useEffect(() => {
        return () => {
            if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        };
    }, []);

    /* ── Highlight selected square and valid moves ── */
    const squareStyles = useMemo(() => {
        const styles = {};
        if (selectedSquare) {
            styles[selectedSquare] = {
                backgroundColor: 'rgba(34, 211, 238, 0.35)',
                boxShadow: 'inset 0 0 4px 2px rgba(34, 211, 238, 0.5)',
            };
            const moves = game.moves({ square: selectedSquare, verbose: true });
            moves.forEach(m => {
                styles[m.to] = {
                    background: game.get(m.to)
                        ? 'radial-gradient(circle, transparent 55%, rgba(34,211,238,0.35) 55%)'
                        : 'radial-gradient(circle, rgba(34,211,238,0.3) 22%, transparent 22%)',
                };
            });
        }
        return styles;
    }, [selectedSquare, game, currentFen]);

    /* ── v5 Chessboard options ── */
    const boardOptions = useMemo(() => ({
        id,
        position: currentFen,
        boardOrientation,
        onPieceDrop: handlePieceDrop,
        onSquareClick: handleSquareClick,
        onPieceClick: ({ piece, square }) => handleSquareClick({ piece, square }),
        animationDurationInMs: 200,
        squareStyles,
        allowDragging: !isThinking,

        /* "Ice & Void" theme */
        boardStyle: {
            borderRadius: '0.75rem',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        },
        darkSquareStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.10)',
        },
        lightSquareStyle: {
            backgroundColor: 'rgba(0, 255, 255, 0.05)',
        },
        dropSquareStyle: {
            boxShadow: 'inset 0 0 2px 6px rgba(34,211,238,0.45)',
            backgroundColor: 'rgba(34, 211, 238, 0.12)',
        },
    }), [id, currentFen, boardOrientation, handlePieceDrop, handleSquareClick, squareStyles, isThinking]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            className={`glass border-2 p-5 flex flex-col items-center gap-4 ${colorClass}`}
        >
            {/* Header */}
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {label && (
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                            {label}
                        </span>
                    )}
                </div>
                <span className={`text-sm font-medium transition-colors ${isThinking ? 'text-cyan-400' : 'opacity-70'}`}>
                    {isThinking && (
                        <Loader2 size={14} className="inline animate-spin mr-1.5 -mt-0.5" />
                    )}
                    {statusText}
                </span>
            </div>

            {/* Board */}
            <div className="relative w-full max-w-[480px] aspect-square">
                <div className={`board-reflection chess-board-wrapper w-full h-full transition-all duration-300 ${isThinking ? 'opacity-80' : ''} ${isScanning ? 'blur-sm scale-[0.98]' : ''}`}>
                    <Chessboard options={boardOptions} />
                </div>
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                        >
                            <Loader2 size={36} className="animate-spin text-cyan-400 mb-3" />
                            <span className="text-sm font-semibold text-white/90 tracking-wide">
                                AI is analyzing the board…
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-3 w-full max-w-[480px]">
                {/* Utility buttons row */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={resetGame}
                        disabled={isThinking || isScanning}
                        className="glass-sm p-2.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Reset"
                    >
                        <SkipBack size={16} />
                    </button>
                    <button
                        onClick={undoMove}
                        disabled={moveHistory.length < 2 || isThinking || isScanning}
                        className="glass-sm p-2.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Undo (undoes your move + AI response)"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={flipBoard}
                        className="glass-sm p-2.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
                        title="Flip Board"
                    >
                        <ChevronLeft size={16} className="inline" />
                        <ChevronRight size={16} className="inline -ml-1" />
                    </button>

                    {onSplit && !isGameOver && (
                        <button onClick={() => onSplit(currentFen)} disabled={isThinking || isScanning} className="btn-split ml-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            ✦ Split Life
                        </button>
                    )}
                </div>

                {/* Scan Board — primary action */}
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isThinking || isScanning}
                    className="group flex items-center justify-center gap-2 w-full min-h-[44px] px-5 py-2.5
                               rounded-xl border border-cyan-400/30 bg-white/[0.04] backdrop-blur-sm
                               text-white/80 text-sm font-semibold tracking-wide
                               shadow-[0_0_12px_rgba(34,211,238,0.08)]
                               hover:border-cyan-400/60 hover:bg-white/[0.08] hover:text-cyan-300
                               hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
                               active:scale-[0.97]
                               transition-all duration-200 ease-out
                               disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    title="Scan a real chessboard with your camera"
                >
                    <Camera size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>Scan Board</span>
                </button>
            </div>

            {/* Move History */}
            {moveHistory.length > 0 && (
                <div className="glass-sm w-full max-w-[480px] p-3 max-h-28 overflow-y-auto">
                    <div className="flex flex-wrap gap-x-1 gap-y-0.5 text-xs font-mono text-white/50">
                        {moveHistory.map((m, i) => (
                            <span key={i}>
                                {i % 2 === 0 && (
                                    <span className="text-white/30 mr-0.5">{Math.floor(i / 2) + 1}.</span>
                                )}
                                <span className="text-white/70">{m}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Ad placement */}
            <AdSlot className="mt-2" />

            {/* Scan error toast */}
            <AnimatePresence>
                {scanError && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)]
                                   px-4 py-3 rounded-xl bg-red-500/90 backdrop-blur-md border border-red-400/30
                                   text-white text-sm font-medium text-center shadow-[0_8px_24px_rgba(239,68,68,0.3)]"
                    >
                        {scanError}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

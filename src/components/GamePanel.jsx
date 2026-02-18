import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, SkipBack, Loader2 } from 'lucide-react';
import useStockfish from '../hooks/useStockfish';

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

    /* ── Cleanup pending timeouts ── */
    useEffect(() => {
        return () => {
            if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
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
            <div className={`board-reflection chess-board-wrapper w-full max-w-[480px] aspect-square transition-opacity ${isThinking ? 'opacity-80' : ''}`}>
                <Chessboard options={boardOptions} />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={resetGame}
                    disabled={isThinking}
                    className="glass-sm p-2.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Reset"
                >
                    <SkipBack size={16} />
                </button>
                <button
                    onClick={undoMove}
                    disabled={moveHistory.length < 2 || isThinking}
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
                    <button onClick={() => onSplit(currentFen)} disabled={isThinking} className="btn-split ml-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        ✦ Split Life
                    </button>
                )}
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
        </motion.div>
    );
}

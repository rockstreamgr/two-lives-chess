import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * useStockfish — Creates an isolated Stockfish Web Worker for AI moves.
 *
 * Each component instance that calls this hook gets its own worker,
 * ensuring zero cross-talk between boards in "Two Lives" split mode.
 *
 * Loads stockfish-18-lite-single.js from /public (served as static asset by Vite).
 */
export default function useStockfish() {
    const workerRef = useRef(null);
    const resolverRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        console.log('[Stockfish] Initializing worker…');

        // Load from public/ — Vite serves this as a static asset at the root
        const worker = new Worker('/stockfish-18-lite-single.js');
        workerRef.current = worker;

        worker.onmessage = (e) => {
            const line = typeof e.data === 'string' ? e.data : '';

            // Log key UCI protocol messages for debugging
            if (line === 'uciok') {
                console.log('[Stockfish] UCI protocol ready (uciok)');
            }

            if (line === 'readyok') {
                console.log('[Stockfish] Engine ready (readyok)');
                setReady(true);
            }

            // Parse "bestmove <move>" and resolve the pending promise
            if (line.startsWith('bestmove')) {
                const bestMove = line.split(' ')[1];
                console.log('[Stockfish] Received bestmove:', bestMove);
                if (resolverRef.current) {
                    resolverRef.current(bestMove);
                    resolverRef.current = null;
                }
            }
        };

        worker.onerror = (err) => {
            console.error('[Stockfish] Worker error:', err);
            // Reject any pending promise so triggerAI doesn't hang
            if (resolverRef.current) {
                resolverRef.current(null);
                resolverRef.current = null;
            }
        };

        // Initialize UCI protocol
        worker.postMessage('uci');
        worker.postMessage('isready');

        return () => {
            console.log('[Stockfish] Terminating worker');
            worker.terminate();
            workerRef.current = null;
            // Clean up any pending promise
            if (resolverRef.current) {
                resolverRef.current(null);
                resolverRef.current = null;
            }
        };
    }, []);

    /**
     * Send a FEN to the engine and get the best move.
     * @param {string} fen - The current board position in FEN notation.
     * @param {number} depth - Search depth (default 12).
     * @returns {Promise<string|null>} - The best move in UCI format (e.g. "e7e5").
     */
    const getBestMove = useCallback((fen, depth = 12) => {
        return new Promise((resolve, reject) => {
            const worker = workerRef.current;
            if (!worker) {
                console.error('[Stockfish] getBestMove called but worker is not initialized');
                reject(new Error('Stockfish worker not initialized'));
                return;
            }

            resolverRef.current = resolve;

            console.log('[Stockfish] Sending position:', fen, '→ go depth', depth);
            worker.postMessage(`position fen ${fen}`);
            worker.postMessage(`go depth ${depth}`);

            // Safety timeout — don't let the promise hang forever (15s)
            setTimeout(() => {
                if (resolverRef.current === resolve) {
                    console.warn('[Stockfish] getBestMove timed out after 15s');
                    resolverRef.current = null;
                    resolve(null);
                }
            }, 15000);
        });
    }, []);

    return { getBestMove, ready };
}

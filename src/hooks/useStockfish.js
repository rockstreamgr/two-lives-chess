import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * useStockfish — Creates an isolated Stockfish Web Worker for AI moves.
 *
 * Each component instance that calls this hook gets its own worker,
 * ensuring zero cross-talk between boards in "Two Lives" split mode.
 *
 * Uses stockfish-18-lite-single (≈7 MB, no CORS required).
 */
export default function useStockfish() {
    const workerRef = useRef(null);
    const resolverRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Create Web Worker from the stockfish lite-single JS file
        const workerPath = new URL(
            '../../node_modules/stockfish/bin/stockfish-18-lite-single.js',
            import.meta.url
        ).href;

        const worker = new Worker(workerPath);
        workerRef.current = worker;

        worker.onmessage = (e) => {
            const line = typeof e.data === 'string' ? e.data : '';

            if (line === 'readyok') {
                setReady(true);
            }

            // Parse "bestmove <move>" and resolve the pending promise
            if (line.startsWith('bestmove')) {
                const bestMove = line.split(' ')[1];
                if (resolverRef.current) {
                    resolverRef.current(bestMove);
                    resolverRef.current = null;
                }
            }
        };

        worker.onerror = (err) => {
            console.error('[Stockfish] Worker error:', err);
        };

        // Initialize UCI protocol
        worker.postMessage('uci');
        worker.postMessage('isready');

        return () => {
            worker.terminate();
            workerRef.current = null;
            resolverRef.current = null;
        };
    }, []);

    /**
     * Send a FEN to the engine and get the best move.
     * @param {string} fen - The current board position in FEN notation.
     * @param {number} depth - Search depth (default 12, good balance of speed/strength).
     * @returns {Promise<string>} - The best move in UCI format (e.g. "e7e5").
     */
    const getBestMove = useCallback((fen, depth = 12) => {
        return new Promise((resolve, reject) => {
            const worker = workerRef.current;
            if (!worker) {
                reject(new Error('Stockfish worker not initialized'));
                return;
            }

            resolverRef.current = resolve;

            worker.postMessage(`position fen ${fen}`);
            worker.postMessage(`go depth ${depth}`);
        });
    }, []);

    return { getBestMove, ready };
}

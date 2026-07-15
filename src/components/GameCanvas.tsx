'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../game/types';

export default function GameCanvas() {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isStarted, setIsStarted] = useState(false);
    const [result, setResult] = useState<{parentScore: number, childScore: number} | null>(null);

    useEffect(() => {
        if (!isStarted || !gameContainerRef.current) return;

        let game: Phaser.Game | null = null;

        // Dynamically import to avoid SSR issues
        import('../game/main').then(({ initGame }) => {
            game = initGame(gameContainerRef.current!.id, {
                onStateUpdate: (state) => setGameState(state),
                onGameEnd: (parentScore, childScore) => setResult({parentScore, childScore})
            });
        });

        return () => {
            if (game) {
                game.destroy(true);
            }
        };
    }, [isStarted]);

    const handleRestart = () => {
        setResult(null);
        setGameState(null);
        setIsStarted(false);
        setTimeout(() => setIsStarted(true), 100);
    }

    if (!isStarted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#E8DFC8]">
                <h1 className="text-4xl font-bold text-[#1F2937] mb-8">お片付け大戦争（仮）</h1>
                <div className="bg-white/80 p-6 rounded-lg mb-8 text-[#1F2937]">
                    <h2 className="text-xl font-bold mb-4">操作方法</h2>
                    <ul className="text-lg">
                        <li className="mb-2"><span className="font-bold text-[#3B82F6]">親（掃除機）</span>: 矢印キー（↑↓←→）</li>
                        <li><span className="font-bold text-[#F97316]">子ども</span>: WASDキー</li>
                    </ul>
                </div>
                <button
                    className="bg-[#3B82F6] text-white px-8 py-4 rounded-xl text-2xl font-bold shadow-lg hover:scale-95 transition-transform"
                    onClick={() => setIsStarted(true)}
                >
                    スタート
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#E8DFC8] pt-4">

            {/* UI Header */}
            {gameState && !result && (
                <div className="flex justify-between items-center w-[800px] bg-white/80 p-4 rounded-t-xl shadow-sm text-[#1F2937]">
                    <div className="flex flex-col items-start bg-[#3B82F6]/10 p-2 rounded">
                        <span className="text-lg font-bold text-[#3B82F6]">親の得点</span>
                        <span className="text-3xl font-bold text-[#3B82F6]">{gameState.parentScore}</span>
                        <div className="text-sm mt-1">容量: {gameState.parentCapacity}/10</div>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">残り時間</span>
                        <span className="text-4xl font-bold">{gameState.timeLeft}</span>
                    </div>

                    <div className="flex flex-col items-end bg-[#F97316]/10 p-2 rounded">
                        <span className="text-lg font-bold text-[#F97316]">子どもの得点</span>
                        <span className="text-3xl font-bold text-[#F97316]">{gameState.childScore}</span>
                        <div className="text-sm mt-1">{gameState.childHasKit ? '修理キット所持' : ''}</div>
                    </div>
                </div>
            )}

            {/* Game Canvas Container */}
            <div
                id="game-container"
                ref={gameContainerRef}
                className="w-[800px] h-[600px] shadow-lg rounded-b-xl overflow-hidden relative"
            >
                {/* Result Overlay */}
                {result && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                        <div className="bg-white p-8 rounded-xl flex flex-col items-center shadow-2xl">
                            <h2 className="text-4xl font-bold mb-6 text-[#1F2937]">結果発表</h2>

                            <div className="flex gap-8 mb-8">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-[#3B82F6] mb-2">親</div>
                                    <div className="text-4xl font-bold text-[#3B82F6]">{result.parentScore}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-[#F97316] mb-2">子ども</div>
                                    <div className="text-4xl font-bold text-[#F97316]">{result.childScore}</div>
                                </div>
                            </div>

                            <div className="text-3xl font-bold text-[#1F2937] mb-8">
                                {result.parentScore > result.childScore ? '親の勝ち！' :
                                 result.parentScore < result.childScore ? '子どもの勝ち！' : '引き分け！'}
                            </div>

                            <button
                                className="bg-[#A78BFA] text-white px-6 py-3 rounded-xl text-xl font-bold shadow hover:scale-95 transition-transform"
                                onClick={handleRestart}
                            >
                                もう一度あそぶ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { GameState } from './types';

export interface GameCallbacks {
    onStateUpdate?: (state: GameState) => void;
    onGameEnd?: (parentScore: number, childScore: number) => void;
}

export const initGame = (containerId: string, callbacks: GameCallbacks) => {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: containerId,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: { y: 0, x: 0 } // Top-down
            }
        },
        scene: [BootScene, GameScene]
    };

    const game = new Phaser.Game(config);

    // Pass callbacks to GameScene when it starts
    game.scene.start('BootScene');

    // A bit hacky but we can pass data to scenes via the registry or passing directly when starting
    // Since GameScene is started from BootScene, let's inject data after game is created
    game.events.on('ready', () => {
        const gameScene = game.scene.getScene('GameScene') as GameScene;
        if (gameScene) {
             // We'll pass it when GameScene initializes.
             // Better way: stop and restart GameScene with data
             game.scene.stop('GameScene');
             game.scene.start('GameScene', callbacks);
        }
    });

    return game;
};

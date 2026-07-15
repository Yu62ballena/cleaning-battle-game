import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/gameConfig';
import { ToyData, ToyType } from '../types';

export class Toy extends Phaser.GameObjects.Rectangle {
    public toyData: ToyData;

    constructor(scene: Phaser.Scene, x: number, y: number, type: ToyType, id: string) {
        const config = type === 'small' ? GAME_CONFIG.TOY_SMALL : GAME_CONFIG.TOY_LARGE;
        const color = type === 'small' ? GAME_CONFIG.COLORS.TOY_SMALL : GAME_CONFIG.COLORS.TOY_LARGE;
        const size = type === 'small' ? 20 : 40;

        super(scene, x, y, size, size, color);

        this.toyData = {
            id,
            type,
            ...config
        };

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Setup physics body
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setImmovable(true);
    }
}

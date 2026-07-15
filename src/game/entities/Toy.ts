import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/gameConfig';
import { ToyData, ToyType } from '../types';

export class Toy extends Phaser.GameObjects.Sprite {
    public toyData: ToyData;

    constructor(scene: Phaser.Scene, x: number, y: number, type: ToyType, id: string) {
        const config = type === 'small' ? GAME_CONFIG.TOY_SMALL : GAME_CONFIG.TOY_LARGE;
        const texture = type === 'small' ? 'toy_small' : 'toy_large';

        super(scene, x, y, texture);

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

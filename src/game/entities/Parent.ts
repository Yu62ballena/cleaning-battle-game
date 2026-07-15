import Phaser from 'phaser';
import { GAME_CONFIG, calculateSpeed } from '../config/gameConfig';
import { ToyData } from '../types';

export class Parent extends Phaser.Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    public inventory: ToyData[] = [];
    public score: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ''); // No texture initially
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body?.setSize(40, 40);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        // Visual representation
        const graphics = scene.add.graphics();
        graphics.fillStyle(GAME_CONFIG.COLORS.PARENT);
        graphics.fillRect(-20, -20, 40, 40);
        graphics.generateTexture('parent', 40, 40);
        graphics.destroy();
        this.setTexture('parent');

        this.cursors = scene.input.keyboard!.createCursorKeys();
    }

    get currentCapacity(): number {
        return this.inventory.reduce((sum, toy) => sum + toy.capacity, 0);
    }

    get currentWeight(): number {
        return this.inventory.reduce((sum, toy) => sum + toy.weight, 0);
    }

    canCollect(toyCapacity: number): boolean {
        return this.currentCapacity + toyCapacity <= GAME_CONFIG.PARENT_MAX_CAPACITY;
    }

    collectToy(toyData: ToyData) {
        this.inventory.push(toyData);
    }

    emptyInventory(): number {
        const points = this.inventory.reduce((sum, toy) => sum + toy.score, 0);
        this.score += points;
        this.inventory = [];
        return points;
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        const speed = calculateSpeed(this.currentWeight);
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown) {
            velocityX = -speed;
        } else if (this.cursors.right.isDown) {
            velocityX = speed;
        }

        if (this.cursors.up.isDown) {
            velocityY = -speed;
        } else if (this.cursors.down.isDown) {
            velocityY = speed;
        }

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= Math.SQRT1_2;
            velocityY *= Math.SQRT1_2;
        }

        this.setVelocity(velocityX, velocityY);
    }
}

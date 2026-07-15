import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Preload any assets here if needed.
        // For Step 1, we are mostly using generated graphics/rectangles.
    }

    create() {
        this.scene.start('GameScene');
    }
}

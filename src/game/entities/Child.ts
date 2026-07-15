import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/gameConfig';

export class Child extends Phaser.Physics.Arcade.Sprite {
    private keys: {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
    };
    public hasKit: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ''); // No texture
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body?.setSize(40, 40); // Size of the child
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        // Visual representation
        const graphics = scene.add.graphics();
        graphics.fillStyle(GAME_CONFIG.COLORS.CHILD);
        graphics.fillRect(-20, -20, 40, 40);

        // Render graphics to texture so we can use it as a sprite
        graphics.generateTexture('child', 40, 40);
        graphics.destroy();
        this.setTexture('child');

        // Input
        this.keys = {
            up: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        let velocityX = 0;
        let velocityY = 0;

        if (this.keys.left.isDown) {
            velocityX = -GAME_CONFIG.PHYSICS.BASE_SPEED;
        } else if (this.keys.right.isDown) {
            velocityX = GAME_CONFIG.PHYSICS.BASE_SPEED;
        }

        if (this.keys.up.isDown) {
            velocityY = -GAME_CONFIG.PHYSICS.BASE_SPEED;
        } else if (this.keys.down.isDown) {
            velocityY = GAME_CONFIG.PHYSICS.BASE_SPEED;
        }

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= Math.SQRT1_2;
            velocityY *= Math.SQRT1_2;
        }

        this.setVelocity(velocityX, velocityY);
    }

    setHasKit(hasKit: boolean) {
        this.hasKit = hasKit;
        if (hasKit) {
            this.setTint(GAME_CONFIG.COLORS.KIT);
        } else {
            this.clearTint();
        }
    }
}

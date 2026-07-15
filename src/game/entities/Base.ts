import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/gameConfig';

export class Base extends Phaser.GameObjects.Rectangle {
    public hp: number;
    public isOpen: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 100, 100, GAME_CONFIG.COLORS.BASE);
        this.hp = GAME_CONFIG.BASE_MAX_HP;
        this.isOpen = false;

        scene.add.existing(this);
        scene.physics.add.existing(this, true); // Static body
    }

    public updateHp(deltaHp: number) {
        if (this.isOpen && deltaHp < 0) return; // Cannot decrease if already open

        this.hp += deltaHp;
        if (this.hp > GAME_CONFIG.BASE_MAX_HP) {
            this.hp = GAME_CONFIG.BASE_MAX_HP;
        }

        if (this.hp <= 0 && !this.isOpen) {
            this.hp = 0;
            this.isOpen = true;
            this.setAlpha(0.5); // Visual cue that it's open

            // Flash effect
            this.scene.tweens.add({
                targets: this,
                alpha: 1,
                duration: 100,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    this.setAlpha(0.5);
                }
            });
        }
    }
}

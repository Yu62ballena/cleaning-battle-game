import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/gameConfig';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Preload any assets here if needed.
    }

    create() {
        const graphics = this.add.graphics();

        // --- Parent (Vacuum Cleaner) ---
        graphics.clear();
        // Main body (Rounded)
        graphics.fillStyle(GAME_CONFIG.COLORS.PARENT);
        graphics.fillRoundedRect(0, 10, 40, 30, 10);
        // Shadow/Accent (Nozzle/Wheels)
        graphics.fillStyle(0x1E40AF);
        graphics.fillRoundedRect(15, 0, 10, 15, 2); // Nozzle
        graphics.fillCircle(10, 35, 6); // Wheel L
        graphics.fillCircle(30, 35, 6); // Wheel R
        // Face/Eyes
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(15, 20, 3);
        graphics.fillCircle(25, 20, 3);
        graphics.generateTexture('parent', 40, 45);

        // --- Child ---
        graphics.clear();
        graphics.fillStyle(GAME_CONFIG.COLORS.CHILD);
        graphics.fillRoundedRect(5, 15, 30, 25, 8); // Body
        graphics.fillCircle(20, 10, 10); // Head
        // Accent/Clothes/Shadow
        graphics.fillStyle(0xC2410C);
        graphics.fillRoundedRect(10, 25, 20, 10, 2);
        // Face
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(15, 8, 2);
        graphics.fillCircle(25, 8, 2);
        graphics.generateTexture('child', 40, 40);

        // --- Child with Repair Kit (Tinted version not needed if we just tint the sprite, but let's have a distinct one or just use tint)
        // We will just use tint for child with kit.

        // --- Small Toy (Lego block) ---
        graphics.clear();
        graphics.fillStyle(GAME_CONFIG.COLORS.TOY_SMALL);
        graphics.fillRoundedRect(0, 5, 20, 15, 2);
        graphics.fillStyle(0xD97706); // Darker orange/yellow accent
        graphics.fillCircle(5, 5, 3);
        graphics.fillCircle(15, 5, 3);
        graphics.generateTexture('toy_small', 20, 20);

        // --- Large Toy (Stuffed Animal/Bear) ---
        graphics.clear();
        graphics.fillStyle(GAME_CONFIG.COLORS.TOY_LARGE);
        graphics.fillCircle(20, 25, 15); // Body
        graphics.fillCircle(20, 12, 10); // Head
        graphics.fillCircle(12, 6, 6); // Ear L
        graphics.fillCircle(28, 6, 6); // Ear R
        graphics.fillStyle(0x991B1B); // Dark red accent
        graphics.fillCircle(17, 10, 2); // Eye L
        graphics.fillCircle(23, 10, 2); // Eye R
        graphics.generateTexture('toy_large', 40, 40);

        // --- Base (Toy Box) ---
        graphics.clear();
        graphics.fillStyle(GAME_CONFIG.COLORS.BASE);
        graphics.fillRoundedRect(0, 20, 100, 80, 5); // Main box
        // Accent (Lid/Rim)
        graphics.fillStyle(0x7C3AED); // Darker purple
        graphics.fillRoundedRect(-5, 10, 110, 15, 3);
        graphics.fillRoundedRect(40, 15, 20, 10, 2); // Lock/Handle
        graphics.generateTexture('base', 100, 100);

        // --- Trash Can ---
        graphics.clear();
        graphics.fillStyle(GAME_CONFIG.COLORS.TRASH);
        graphics.fillRoundedRect(5, 15, 50, 45, { tl: 0, tr: 0, bl: 5, br: 5 });
        graphics.fillStyle(0x9CA3AF); // Lid
        graphics.fillRoundedRect(0, 5, 60, 10, 2);
        graphics.generateTexture('trash', 60, 60);

        // --- Repair Kit ---
        graphics.clear();
        graphics.fillStyle(GAME_CONFIG.COLORS.KIT);
        graphics.fillRoundedRect(0, 10, 30, 20, 3); // Box
        graphics.fillStyle(0x047857); // Darker green accent
        graphics.fillRoundedRect(10, 5, 10, 5, 2); // Handle
        // Plus sign
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(13, 13, 4, 10);
        graphics.fillRect(10, 16, 10, 4);
        graphics.generateTexture('repair_kit', 30, 30);

        graphics.destroy();

        this.scene.start('GameScene');
    }
}

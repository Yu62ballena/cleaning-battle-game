import Phaser from 'phaser';
import { Parent } from '../entities/Parent';
import { Child } from '../entities/Child';
import { Toy } from '../entities/Toy';
import { Base } from '../entities/Base';
import { GAME_CONFIG } from '../config/gameConfig';
import { GameState } from '../types';

export class GameScene extends Phaser.Scene {
    private parent!: Parent;
    private child!: Child;
    private base!: Base;
    private toys!: Phaser.GameObjects.Group;
    private trashCan!: Phaser.GameObjects.Sprite;
    private repairKit!: Phaser.GameObjects.Sprite;
    private baseHpText!: Phaser.GameObjects.Text;
    private baseHpBar!: Phaser.GameObjects.Graphics;

    private timeLeft: number = GAME_CONFIG.TIME_LIMIT;
    private timerEvent!: Phaser.Time.TimerEvent;

    // Pass state changes to React
    private onStateUpdate?: (state: GameState) => void;
    private onGameEnd?: (parentScore: number, childScore: number) => void;

    constructor() {
        super('GameScene');
    }

    init(data: { onStateUpdate?: (state: GameState) => void, onGameEnd?: (parentScore: number, childScore: number) => void }) {
        this.onStateUpdate = data.onStateUpdate;
        this.onGameEnd = data.onGameEnd;
        this.timeLeft = GAME_CONFIG.TIME_LIMIT;
    }

    create() {
        this.cameras.main.setBackgroundColor(GAME_CONFIG.COLORS.BG);

        // Map setup
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Base
        this.base = new Base(this, width / 2, height / 2);

        // Trash Can
        this.trashCan = this.add.sprite(width - 50, height - 50, 'trash');
        this.physics.add.existing(this.trashCan, true);

        // Repair Kit
        this.repairKit = this.add.sprite(50, 50, 'repair_kit');
        this.physics.add.existing(this.repairKit, true);

        // Entities
        this.parent = new Parent(this, 100, height / 2);
        this.child = new Child(this, width - 100, height / 2);

        // Toys group
        this.toys = this.add.group();

        // Initial toys
        this.spawnToys();

        // UI for Base HP
        this.baseHpBar = this.add.graphics();
        this.updateBaseHpUI();

        // Physics Collisions/Overlaps
        this.physics.add.collider(this.parent, this.base);
        this.physics.add.collider(this.child, this.base);

        this.physics.add.overlap(this.parent, this.toys, this.handleParentToyOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
        this.physics.add.overlap(this.parent, this.trashCan, this.handleParentTrashOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
        this.physics.add.overlap(this.child, this.repairKit, this.handleChildKitOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

        // Timer
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onTick,
            callbackScope: this,
            loop: true
        });

        this.notifyStateUpdate();
    }

    private spawnToys() {
        // Toys inside the Base
        const baseX = this.base.x;
        const baseY = this.base.y;

        // Spawn 2 small toys and 1 large toy inside base bounds
        for(let i=0; i<2; i++) {
            const x = baseX + Phaser.Math.Between(-30, 30);
            const y = baseY + Phaser.Math.Between(-30, 30);
            const toy = new Toy(this, x, y, 'small', `base_small_${i}`);
            this.toys.add(toy);
        }
        {
            const x = baseX + Phaser.Math.Between(-20, 20);
            const y = baseY + Phaser.Math.Between(-20, 20);
            const toy = new Toy(this, x, y, 'large', `base_large_0`);
            this.toys.add(toy);
        }

        // Floor toys
        let floorSmallCount = 0;
        let floorLargeCount = 0;

        while (floorSmallCount < 5 || floorLargeCount < 2) {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(100, 500);

            // Avoid spawning on top of the base area
            if (Phaser.Math.Distance.Between(x, y, baseX, baseY) < 80) continue;

            if (floorSmallCount < 5) {
                const toy = new Toy(this, x, y, 'small', `floor_small_${floorSmallCount}`);
                this.toys.add(toy);
                floorSmallCount++;
            } else if (floorLargeCount < 2) {
                const toy = new Toy(this, x, y, 'large', `floor_large_${floorLargeCount}`);
                this.toys.add(toy);
                floorLargeCount++;
            }
        }
    }

    update(time: number, delta: number) {
        if (this.timeLeft <= 0) return;

        // Base interaction logic
        const distParent = Phaser.Math.Distance.Between(this.parent.x, this.parent.y, this.base.x, this.base.y);
        const distChild = Phaser.Math.Distance.Between(this.child.x, this.child.y, this.base.x, this.base.y);

        const interactionDistance = 100; // threshold to be considered "near"

        if (distParent < interactionDistance) {
             // HP decreases per second, so delta/1000 * rate
             this.base.updateHp(-(GAME_CONFIG.BASE_HP_DECREASE_RATE * (delta / 1000)));
             this.updateBaseHpUI();
        }

        if (distChild < interactionDistance && this.child.hasKit) {
            this.base.updateHp(GAME_CONFIG.BASE_HP_INCREASE_RATE * (delta / 1000));
            this.updateBaseHpUI();
        }
    }

    private updateBaseHpUI() {
        this.baseHpBar.clear();

        if (this.base.isOpen) return; // Hide when open

        const x = this.base.x - 40;
        const y = this.base.y - 70;
        const width = 80;
        const height = 10;

        // Background
        this.baseHpBar.fillStyle(0x4B5563);
        this.baseHpBar.fillRect(x, y, width, height);

        // HP
        const hpPercent = this.base.hp / GAME_CONFIG.BASE_MAX_HP;
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            Phaser.Display.Color.ValueToColor(0xEF4444),
            Phaser.Display.Color.ValueToColor(0x22C55E),
            100, hpPercent * 100
        );
        this.baseHpBar.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
        this.baseHpBar.fillRect(x, y, width * hpPercent, height);
    }

    private handleParentToyOverlap(parent: Parent, toy: Toy) {
        if (!this.base.isOpen && Phaser.Geom.Rectangle.Contains(this.base.getBounds(), toy.x, toy.y)) {
            return;
        }

        if (parent.canCollect(toy.toyData.capacity)) {

            // Animation
            this.tweens.add({
                targets: toy,
                scaleX: 0,
                scaleY: 0,
                duration: 200,
                onComplete: () => {
                    parent.collectToy(toy.toyData);
                    this.toys.remove(toy, true, true);
                    this.notifyStateUpdate();
                }
            });

            // disable physics immediately so it's not collected twice
            if (toy.body) (toy.body as Phaser.Physics.Arcade.Body).enable = false;
        }
    }

    private handleParentTrashOverlap(parent: Parent, _trashCan: Phaser.GameObjects.Sprite) {
        if (parent.inventory.length > 0) {
            parent.emptyInventory();
            this.notifyStateUpdate();
        }
    }

    private handleChildKitOverlap(child: Child, kit: Phaser.GameObjects.Sprite) {
        if (!child.hasKit) {
            child.setHasKit(true);
            kit.setVisible(false);
            if (kit.body) (kit.body as Phaser.Physics.Arcade.Body).enable = false;
            this.notifyStateUpdate();
        }
    }

    private onTick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.notifyStateUpdate();

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }
    }

    private getChildScore(): number {
        // Child score is total score of toys currently on the floor
        let score = 0;
        this.toys.getChildren().forEach((c) => {
            const toy = c as Toy;
            score += toy.toyData.score;

        });
        return score;
    }

    private notifyStateUpdate() {
        if (this.onStateUpdate && this.timeLeft >= 0) {
            this.onStateUpdate({
                timeLeft: this.timeLeft,
                parentScore: this.parent.score,
                childScore: this.getChildScore(),
                baseHp: Math.ceil(this.base.hp),
                baseOpen: this.base.isOpen,
                parentInventory: [...this.parent.inventory],
                parentCapacity: this.parent.currentCapacity,
                childHasKit: this.child.hasKit,
                isFinished: this.timeLeft <= 0
            });
        }
    }

    private endGame() {
        this.physics.pause();
        this.timerEvent.remove();
        if (this.onGameEnd) {
            this.onGameEnd(this.parent.score, this.getChildScore());
        }
    }
}

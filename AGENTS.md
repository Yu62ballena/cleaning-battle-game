# AGENTS.md

## 1. 役割とペルソナ

このプロジェクトは「お片付け大戦争（仮）」というローカル対戦アクションゲームの **Step1コアプロトタイプ** です。
親（掃除機側）と子ども（おもちゃ側）が1台のキーボードを分割して対戦する、1vs1・1マップのブラウザゲームを作ります。

品質の方向性：
- 見た目の作り込みより「遊べる状態」を最優先する（プロトタイプ段階）
- ただし後述の「厳格なルール」にある数値・判定ロジックは正確に実装する
- 対象ユーザーは開発者本人とその家族（9歳の子どもも操作する想定）。UIの文字は大きめ、操作は単純に

## 2. 技術スタック

- Next.js 14系（App Router）
- React 18系
- TypeScript
- Phaser 3（最新安定版。`npm install phaser` でインストールされるバージョンを使用）
- Phaserのゲームシーンは `src/game/` 配下に集約し、Next.jsのページからは動的インポート（`ssr: false`）でマウントする（PhaserはDOM/window依存のためSSR不可）
- パッケージマネージャ：npm
- スタイリング：Tailwind CSS（ゲーム画面外のUI（タイトル画面・操作説明等）にのみ使う。ゲーム内描画はPhaser側のCanvasで行う）

## 3. ファイル構成

```
repo/
├── AGENTS.md
├── .agents/
│   ├── rules/
│   │   └── skill_priority_rules.md   ← スキル競合時の優先ルール（Antigravity skill-selector管理。変更禁止）
│   └── skills/
│       ├── game-development/SKILL.md         ← AAS由来。Phaser/PixiJSのゲームループ・入力・物理のベストプラクティス
│       ├── nextjs-best-practices/SKILL.md     ← AAS由来。Next.js App Router設計指針
│       ├── typescript-expert/SKILL.md         ← AAS由来。型定義・型安全性の指針
│       ├── design-taste-frontend/SKILL.md     ← AAS由来。UI/UXのトンマナ・意匠の指針
│       └── project-spec/SKILL.md              ← このプロジェクト固有。数値仕様・カラーパレット・機能仕様（旧design.md）
├── src/
│   ├── app/
│   │   ├── page.tsx              ← トップページ（ゲームをマウントする）
│   │   └── layout.tsx
│   ├── game/
│   │   ├── main.ts                ← Phaser.Gameの初期化設定
│   │   ├── scenes/
│   │   │   ├── BootScene.ts       ← アセット読み込み
│   │   │   ├── GameScene.ts       ← メインのゲームロジック（最重要）
│   │   │   └── ResultScene.ts     ← 結果画面
│   │   ├── entities/
│   │   │   ├── Parent.ts          ← 親（掃除機）キャラのロジック
│   │   │   ├── Child.ts           ← 子どものキャラのロジック
│   │   │   ├── Toy.ts             ← おもちゃのロジック（容量・重さ・得点を持つ）
│   │   │   └── Base.ts            ← 基地（おもちゃ箱）のロジック（HP・修理判定）
│   │   ├── config/
│   │   │   └── gameConfig.ts      ← 定数（容量上限・重さ計算式のK値・基地HP上限など）
│   │   └── types.ts               ← 型定義
│   └── components/
│       └── GameCanvas.tsx         ← Phaserをマウントする実際のReactコンポーネント
├── public/
│   └── assets/                    ← 画像・音声（Step1は仮素材でよい。四角い図形のプレースホルダーでも可）
├── package.json
└── tsconfig.json
```

## 4. 厳格なルール

- **`.agents/skills/project-spec/SKILL.md` に書かれた数値・カラーコードは必ずその通りに実装する。**「だいたい」で近い値にしない
- ゲームロジック（容量・重さ・速度計算、基地HP、修理判定）は `src/game/entities/` 以下に集約し、Reactコンポーネント側にゲームロジックを書かない
- PhaserのGameインスタンスは1つだけ生成する。Reactの再レンダリングで複数回初期化されないよう、`useEffect` の依存配列とクリーンアップ処理に注意する
- 音声・画像アセットが未用意の場合は、`public/assets/` に仮のプレースホルダー（単色の矩形PNGなど）を自動生成して使ってよい。ただしファイル名・パスは project-spec/SKILL.md の指示に従う
- Step1の範囲外の機能（水鉄砲・元栓・切り札・2vs2・複数マップ）は実装しない。関連するコメント（`// TODO: Step2で実装`）だけ残すのは可
- `.agents/rules/skill_priority_rules.md` は変更しない（Antigravity skill-selectorが管理するファイル）

## 5. スキルファイルの読み込み

タスクを開始する前に、内容に応じて `.agents/skills/` 配下の該当するスキルファイルを必ず読み込み、その指示に厳密に従うこと。優先順位に迷った場合は `.agents/rules/skill_priority_rules.md` を参照する。

### 参照すべきスキル(タスク内容に応じて)

- **ゲームロジック実装全般**（`src/game/` 配下の作業）：`.agents/skills/game-development/SKILL.md` を読み、Phaser/PixiJSのゲームループ・入力ハンドリング・物理演算のベストプラクティスに従う
- **Next.js/React部分の実装**（`src/app/`、`src/components/` の作業）：`.agents/skills/nextjs-best-practices/SKILL.md` を読み、App Router構成に従う
- **型定義・全ファイル共通**：`.agents/skills/typescript-expert/SKILL.md` を読み、厳密な型付けを行う
- **UI/UXの見た目に関わる実装**（タイトル画面・結果画面・スコア表示等）：`.agents/skills/design-taste-frontend/SKILL.md` を読み、トンマナを合わせる
- **すべてのタスクで必須**：`.agents/skills/project-spec/SKILL.md` を読み、このプロジェクト固有の数値仕様・カラーパレット・機能仕様に従う

実装プランを立てる前に、上記のうち関連するファイルすべてを読み込んでから着手すること。

## 6. Critic Agent向け品質チェックリスト

PRを出す前に以下を自己チェックすること：

- [ ] `npm run lint` がエラーなく通る
- [ ] `npm run type-check` がエラーなく通る
- [ ] 親（矢印キー）と子ども（WASD）が同時に、それぞれ独立して動かせる
- [ ] おもちゃを吸うと掃除機の容量が消費され、容量上限を超えると吸えない
- [ ] 吸ったおもちゃの合計重さに応じて親の移動速度が低下する（下限速度を下回らない）
- [ ] 親が基地の近くで一定時間操作し続けると基地HPが減り、0になると基地が開放される
- [ ] 子どもが修理キットを持って基地に触れると基地HPが回復する
- [ ] 制限時間（仮：120秒）が終了すると結果画面に遷移し、得点比較で勝敗が表示される
- [ ] コンソールにエラーが出ていない
- [ ] project-spec/SKILL.md の数値・カラーコードから逸脱していない

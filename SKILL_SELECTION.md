# SKILL_SELECTION.md

## 選定プラン詳細

- **タスク**: お片付け大戦争（親vs子の非対称対戦ゲーム開発準備）
- **選定カテゴリ**: `frontend`, `essentials`, `design`
- **選定日時**: 2026-07-15T10:45:00Z

### 配置されたスキル一覧

1. **game-development** (source: aas)
   - **配置先**: [.agents/skills/game-development](file:///Users/Yusuke/Documents/cleaning-battle-game/.agents/skills/game-development)
   - **理由**: Phaser/PixiJS等のHTML5ゲーム開発におけるゲームループ、描画、入力ハンドリング、物理演算のベストプラクティスを補完するため。
2. **nextjs-best-practices** (source: aas)
   - **配置先**: [.agents/skills/nextjs-best-practices](file:///Users/Yusuke/Documents/cleaning-battle-game/.agents/skills/nextjs-best-practices)
   - **理由**: Next.js(React) + TypeScriptのベースフレームワーク構成と、App Routerを使ったページ・コンポーネント設計を最適化するため。
3. **typescript-expert** (source: aas)
   - **配置先**: [.agents/skills/typescript-expert](file:///Users/Yusuke/Documents/cleaning-battle-game/.agents/skills/typescript-expert)
   - **理由**: 言語スタックであるTypeScriptの厳密な型定義や、ゲームロジックの安全性・パフォーマンス向上のため。
4. **design-taste-frontend** (source: aas)
   - **配置先**: [.agents/skills/design-taste-frontend](file:///Users/Yusuke/Documents/cleaning-battle-game/.agents/skills/design-taste-frontend)
   - **理由**: ゆうさんが望む「リッチな意匠・美しいデザイン」をフロントエンドに実装するためのトンマナやUIデザインのアプローチを適用するため。

### 併用パターン
今回は `source: user` のカスタムスキルで重複するものが特になかったため、すべて AAS (`source: aas`) から補完として選定・配置しました。
競合ルールは [skill_priority_rules.md](file:///Users/Yusuke/Documents/cleaning-battle-game/.agents/rules/skill_priority_rules.md) に定義されています。

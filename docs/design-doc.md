# Omikuji Web Application - Design Document

## 📋 アプリケーション概要

### コンセプト
このアプリケーションは、日本の伝統的なおみくじ（お神籤）をデジタルで体験できるWebアプリケーションです。神社や寺院で引く運勢占いの紙片を、モダンなWeb技術で再現しています。

### 目的
- 日本の伝統文化であるおみくじをデジタル化
- シンプルで直感的なユーザーインターフェース
- モバイルフレンドリーな設計
- 静的サイトとしてGitHub Pagesにデプロイ可能

## 🏗️ アーキテクチャ

### 技術スタック
- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages (GitHub Actions)
- **Browser APIs**: localStorage, matchMedia

### アーキテクチャの選択理由
1. **Vue 3**: 軽量で学習コストが低く、Composition APIにより状態管理が明確
2. **Vite**: 高速なビルドと開発サーバー、静的サイト生成に最適
3. **Tailwind CSS**: ユーティリティファーストでレスポンシブデザインが容易
4. **静的サイト**: バックエンド不要でシンプルなデプロイが可能

## 🎨 UI/UX デザイン

### デザインコンセプト
- **和風テーマ**: 竹（🎋）をメインモチーフとした日本的なデザイン
- **カラーパレット**: 
  - Light Mode: ピンクからレッドのグラデーション背景
  - Dark Mode: グレー系のダークテーマ
- **レスポンシブ**: モバイルファーストでデスクトップにも対応

### インタラクション
- **アニメーション**: 2秒間のローディングアニメーションで期待感を演出
- **フェードイン効果**: 結果表示時の自然なアニメーション
- **ホバーエフェクト**: ボタンの視覚的フィードバック

## 📦 コンポーネント構造

### App.vue (メインコンポーネント)
```
App.vue
├── Header (タイトルとテーマ切替)
├── Omikuji Card (メイン機能エリア)
│   ├── Icon Display (運勢アイコン)
│   ├── Result Display (結果表示)
│   └── Draw Button (おみくじ実行ボタン)
└── History Section (履歴表示)
```

### 状態管理
Vue 3 Composition APIのreactiveシステムを使用:
- `isDark`: ダークモード状態
- `isDrawing`: おみくじ実行中状態
- `currentResult`: 現在の結果
- `history`: 過去の結果履歴

## 🎯 機能仕様

### コア機能

#### 1. おみくじ抽選機能
```javascript
const omikujiResults = [
  { name: '大吉', icon: '🌟', message: '...', color: 'text-yellow-500' },
  { name: '中吉', icon: '✨', message: '...', color: 'text-orange-500' },
  { name: '小吉', icon: '🍀', message: '...', color: 'text-green-500' },
  { name: '吉', icon: '🌸', message: '...', color: 'text-pink-500' },
  { name: '凶', icon: '🌧️', message: '...', color: 'text-blue-500' },
  { name: '大凶', icon: '⚡', message: '...', color: 'text-purple-500' }
];
```

#### 2. テーマ切替機能
- システム設定の自動検出
- ローカルストレージでの設定保存
- スムーズなトランジション効果

#### 3. 履歴管理機能
- 最新5件の結果を表示
- タイムスタンプ付きで記録
- ローカルストレージで永続化

### データフロー
```
User Action → drawOmikuji() → Random Selection → Update State → Save to localStorage → UI Update
```

## 💾 データ管理

### ローカルストレージ
- **theme**: ユーザーのテーマ設定 ('light' | 'dark')
- **omikuji-history**: おみくじ結果の履歴配列

### データ構造
```javascript
// Result Object
{
  name: string,      // 運勢名
  icon: string,      // 表示アイコン
  message: string,   // 詳細メッセージ
  color: string,     // Tailwind CSSクラス
  timestamp: Date    // 抽選時刻
}
```

## 🚀 デプロイメント

### GitHub Actions ワークフロー
```yaml
# .github/workflows/deploy.yml
- ビルド: npm ci && npm run build
- 静的ファイル生成: dist/フォルダ
- GitHub Pages デプロイ: actions/deploy-pages@v4
```

### デプロイ設定
- **Base Path**: `/coding-agent-omikuji-demo-v2/`
- **Output Directory**: `dist/`
- **Trigger**: mainブランチへのpush

## 🔧 開発環境

### 必要要件
- Node.js 18+
- npm

### セットアップ
```bash
npm install          # 依存関係インストール
npm run dev         # 開発サーバー起動
npm run build       # 本番ビルド
npm run preview     # ビルド結果プレビュー
```

### ファイル構造
```
/
├── src/
│   ├── App.vue          # メインコンポーネント
│   ├── main.js          # エントリーポイント
│   └── style.css        # グローバルスタイル
├── public/              # 静的アセット
├── docs/               # プロジェクト文書
├── .github/workflows/  # CI/CDワークフロー
└── dist/              # ビルド出力（自動生成）
```

## 🎨 スタイリング

### Tailwind CSS設定
- **ダークモード**: class戦略を使用
- **カスタムスタイル**: omikuji-card, omikuji-button, theme-toggle
- **レスポンシブ**: mobile-first approach

### カスタムコンポーネントスタイル
```css
.omikuji-card {
  @apply bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-all duration-300 border border-gray-100 dark:border-gray-700;
}

.omikuji-button {
  @apply bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95;
}

.theme-toggle {
  @apply fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-200;
}
```

## 🌟 特徴的な実装

### 1. 非同期アニメーション
```javascript
const drawOmikuji = async () => {
  isDrawing.value = true;
  // 2秒間のサスペンス演出
  await new Promise(resolve => setTimeout(resolve, 2000));
  // ランダム抽選とUI更新
};
```

### 2. テーマ自動検出
```javascript
// システム設定の検出
if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  isDark.value = true;
}
```

### 3. エラーハンドリング
```javascript
try {
  history.value = JSON.parse(savedHistory);
} catch (e) {
  console.error('Failed to load history:', e);
}
```

## 📱 ユーザー体験

### フロー
1. **初回アクセス**: システムテーマに合わせた表示
2. **おみくじ実行**: ボタンクリック → ローディング → 結果表示
3. **履歴確認**: 過去の結果を時系列で確認
4. **テーマ切替**: ワンクリックで明暗テーマ切替

### アクセシビリティ
- セマンティックHTML要素の使用
- 適切なaria-label属性
- キーボードナビゲーション対応
- カラーコントラストの確保

## 🔄 将来の拡張可能性

### 機能拡張案
- **音響効果**: 抽選時の効果音
- **アニメーション強化**: より豊かな視覚効果
- **SNS共有**: 結果の共有機能
- **多言語対応**: 英語版の追加
- **統計表示**: 運勢の出現頻度グラフ

### 技術的拡張
- **PWA化**: オフライン対応とインストール可能
- **データベース連携**: クラウドでの履歴同期
- **API化**: バックエンドサービスとの連携

## 📊 パフォーマンス

### バンドルサイズ（gzip圧縮後）
- **JavaScript**: ~65KB
- **CSS**: ~12KB
- **Total**: ~77KB

### 最適化実装
- Viteによる自動コード分割
- Tailwind CSSの未使用スタイル除去
- Vue 3の軽量バンドル使用

## 🛠️ 開発ガイドライン

### コーディング標準
- セミコロンの使用
- シングルクォートの使用
- アロー関数の使用
- Vue Composition APIの活用

### ベストプラクティス
- 状態の適切な分離
- エラーハンドリングの実装
- パフォーマンスを考慮した実装
- アクセシビリティの確保
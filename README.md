# おみくじアプリ - Omikuji App

🎋 **日本の伝統的なおみくじをWebで楽しめるアプリケーション**

このアプリケーションは、日本の神社やお寺で引く伝統的なおみくじをWeb上で体験できるアプリケーションです。

## 🌟 機能

- 📱 レスポンシブデザイン（モバイル・デスクトップ対応）
- 🌙 ダークモード/ライトモード切り替え
- 🎯 6種類のおみくじ結果（大吉、中吉、小吉、吉、凶、大凶）
- 📝 過去の結果履歴表示
- 💾 ローカルストレージでのデータ保存
- ✨ アニメーション効果

## 🚀 デモ

GitHub Pages で公開: https://tsubakimoto.github.io/coding-agent-omikuji-demo-v2/

## 🛠️ ローカル環境での実行手順

### 必要な環境

- Node.js (v18以上推奨)
- npm または yarn

### セットアップ

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/tsubakimoto/coding-agent-omikuji-demo-v2.git
   cd coding-agent-omikuji-demo-v2
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   
   ブラウザで `http://localhost:5173/coding-agent-omikuji-demo-v2/` にアクセスしてください。

4. **本番ビルド**
   ```bash
   npm run build
   ```
   
   ビルド結果は `dist/` フォルダに生成されます。

5. **ビルド結果のプレビュー**
   ```bash
   npm run preview
   ```

## 📁 プロジェクト構成

```
├── public/                 # 静的ファイル
│   └── omikuji-icon.svg   # ファビコン
├── src/                   # ソースコード
│   ├── App.vue           # メインコンポーネント
│   ├── main.js           # エントリーポイント
│   └── style.css         # スタイル
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Pages自動デプロイ
├── index.html            # HTMLテンプレート
├── package.json          # プロジェクト設定
├── vite.config.js        # Vite設定
└── tailwind.config.js    # Tailwind CSS設定
```

## 🎨 技術スタック

- **フレームワーク**: Vue 3 (Composition API)
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **デプロイ**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📱 使用方法

1. 「おみくじを回す」ボタンをクリック
2. アニメーションが表示され、結果が表示されます
3. 6種類の結果（大吉、中吉、小吉、吉、凶、大凶）からランダムに選択
4. 過去の結果履歴が画面下部に表示
5. 右上のボタンでダーク/ライトモードを切り替え可能

## 🔧 開発者向け情報

開発についての詳細は `AGENTS.md` を参照してください。

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

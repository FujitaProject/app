# Fujitaprojectのゲーム



##  プロジェクト概要

このゲームは以下の要素を含む：
- **画像問題**: SNSに投稿する画像のリスクを学習
- **フィッシング問題**: 偽メールや偽サイトの見分け方を学習
- **キャラクター対話**: ゲーム性を高めるストーリー要素
- **スコアリングシステム**: 成績に応じた称号の付与

##  クイックスタート

### 1. プロジェクトの取得
```bash
# リポジトリをクローン
git clone https://github.com/FujitaProject/app
cd fujita-project-app
```

### 2. ゲームの起動
このプロジェクトは純粋なHTML/CSS/JavaScriptで構築されているため、特別なセットアップは不要。

**方法1: ブラウザで直接開く**
```bash
# index.htmlをダブルクリックするか、ブラウザにドラッグ&ドロップ
open index.html  # macOS
start index.html # Windows
```

**方法2: ローカルサーバーを使用（推奨）**
```bash
# Python 3を使用
python -m http.server 8000

# Node.jsのnpxを使用
npx serve .

# VS Codeの Live Server 拡張機能を使用
# 右クリック → "Open with Live Server"
```

ブラウザで `http://localhost:8000` にアクセスしてゲームを開始できる。

##  プロジェクト構成

```
fujita-project-app/
├── index.html          # メインのHTMLファイル（ゲームの構造）
├── style.css          # スタイルシート（デザインとレイアウト）
├── script.js          # JavaScript（ゲームロジック）
└── README.md          # このファイル
```

### ファイルの役割
- **index.html**: ゲームの画面構造とレイアウトを定義
- **style.css**: 見た目のスタイリング、アニメーション効果
- **script.js**: ゲームの動作、クイズロジック、画面遷移

## 🛠️ 開発環境のセットアップ

### 必要なツール
- **Webブラウザ**: Chrome, Firefox, Safari, Edge など
- **テキストエディタ**: VS Code
- **Git**: バージョン管理用
- **ローカルサーバー**（オプション）: Python, Node.js, または VS Code Live Server



##  開発手順

### 1. 開発環境の準備
```bash
# 1. リポジトリをクローン
git clone https://github.com/FujitaProject/app
cd fujita-project-app

# 2. VS Codeでプロジェクトを開く
code .

# 3. Live Server拡張機能をインストール（初回のみ）
# VS Code の拡張機能タブで "Live Server" を検索してインストール
#index.htmlをvscodeで開いて、右クリック → "Open with Live Server"
```

### 2. 開発ワークフロー
```bash
# 1. 新しい機能ブランチを作成
git checkout -b feature/new-feature-name

# 2. コードを編集
# - index.html: 新しい画面要素の追加
# - style.css: スタイルの調整
# - script.js: 機能の実装

# 3. リアルタイムでテスト
# VS CodeでIndex.htmlを右クリック → "Open with Live Server"

# 4. 変更をコミット
git add .
git commit -m "機能の説明"

# 5. リモートにプッシュ
git push origin feature/new-feature-name
```

### 3. コードの編集時の注意点
- **HTML編集時**: 新しい要素にはわかりやすいIDやclassを付ける
- **CSS編集時**: コメントでセクションを明確に分ける
- **JavaScript編集時**: 関数には必ずコメントで説明を付ける

##  ゲームの仕組み

### 画面構成
1. **start-screen**: ゲーム開始画面
2. **story-screen**: ストーリー紹介
3. **intro-ally-screen**: 味方キャラクター登場
4. **intro-enemy-screen**: 敵キャラクター登場
5. **quiz-screen**: クイズ画面（メイン）
6. **result-screen**: 回答結果表示
7. **ending-screen**: ゲーム終了・スコア表示

### クイズデータの構造
```javascript
{
  type: "image" | "phishing",    // 問題の種類
  question: "問題文",             // 表示される問題
  image: "画像URL",               // 画像問題の場合のみ
  options: ["選択肢1", "選択肢2"], // 回答選択肢
  answer: 0,                     // 正解のインデックス
  explanation: "解説文"           // 回答後の解説
}
```

### スコアリングシステム
- **全問正解 (6/6)**: サイバーマスター
- **半分以上正解 (3-5/6)**: 情報防衛隊員  
- **半分未満 (0-2/6)**: 新米見習い

##  カスタマイズ方法

### 新しい問題の追加
`script.js`の`quizData`配列に新しい問題オブジェクトを追加：

```javascript
// script.jsの quizData 配列に追加
{
  type: "phishing",
  question: "新しい問題文",
  image: "", // 画像がない場合は空文字
  options: ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  answer: 1, // 正解のインデックス（0から始まる）
  explanation: "この問題の解説文"
}
```

### デザインの変更
`style.css`で以下の要素をカスタマイズできます：
- 色合い: `background-color`, `color`プロパティ
- フォント: `font-family`, `font-size`プロパティ  
- レイアウト: `margin`, `padding`, `width`プロパティ
- アニメーション: `@keyframes`と`animation`プロパティ

### キャラクターのセリフ変更
`script.js`の以下の変数を編集：
```javascript
const allyDialogue = "味方キャラクターのセリフ";
const enemyDialogue = "敵キャラクターのセリフ";
```


##  開発チームでの協力方法

### Git使用時のルール
```bash
# ブランチ命名規則
feature/機能名     # 新機能追加
bugfix/バグ名     # バグ修正
hotfix/緊急修正名  # 緊急修正

# コミットメッセージの例
git commit -m "feat: 新しいクイズ問題を追加"
git commit -m "fix: ボタンクリック時のバグを修正"
git commit -m "style: CSSの色合いを調整"
git commit -m "docs: READMEに開発手順を追加"
```



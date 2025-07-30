// ====================
// ゲームの基本設定
// ====================

// 画面の順序を定義する配列（ゲームの進行順）
const screens = [
  "start-screen",        // スタート画面
  "story-screen",        // ストーリー紹介画面
  "intro-ally-screen",   // 味方キャラクター紹介画面
  "intro-enemy-screen",  // 敵キャラクター紹介画面
  "quiz-screen",         // クイズ画面
  "result-screen",       // 結果表示画面
  "ending-screen",       // エンディング画面
];

// ゲームの進行状況を管理する変数
let currentScreenIndex = 0;     // 現在表示している画面のインデックス
let currentQuestionIndex = 0;   // 現在の問題番号
let score = 0;                  // プレイヤーのスコア（正解数）
const totalQuizzes = 6;         // 全問題数（画像問題3問 + フィッシング問題3問）
let quizzesCompleted = 0;       // 完了した問題数

// ====================
// クイズデータ
// ====================

// 全ての問題データを格納する配列
const quizData = [
  // 画像問題 1
  {
    type: "image",
    question: "この画像は個人情報を含んでいる？\n(例: 地図、顔写真など)",
    image: "https://via.placeholder.com/400x200?text=Question+Image+1", // プレースホルダー画像
    options: ["はい", "いいえ", "たぶん", "画像がないよ"],
    answer: 0, // 正解のインデックス（0番目の選択肢が正解）
    explanation: "この画像にはGPS情報が含まれている可能性があります。"
  },
  // 画像問題 2
  {
    type: "image",
    question: "この写真から住所を特定できる可能性は？\n(例: 背景の建物、看板など)",
    image: "https://via.placeholder.com/400x200?text=Question+Image+2",
    options: ["非常に高い", "低い", "不可能", "分からない"],
    answer: 0,
    explanation: "背景に特徴的な建物や看板が写っている場合、住所特定の危険性があります。"
  },
  // 画像問題 3
  {
    type: "image",
    question: "この写真に写っている人物は加工されている？\n(例: 美顔加工、背景除去など)",
    image: "https://via.placeholder.com/400x200?text=Question+Image+3",
    options: ["はい", "いいえ", "どちらとも言えない", "写真がない"],
    answer: 0,
    explanation: "SNSでは加工された画像が多く、見分けることが重要です。"
  },
  // フィッシング問題 1
  {
    type: "phishing",
    question: "このメールはフィッシングメールか？\n(送信元: 'amazon@phishing.com')",
    image: "", // フィッシング問題では画像を使用しない
    options: ["はい", "いいえ", "判断できない", "どちらでもない"],
    answer: 0,
    explanation: "送信元が公式と異なるドメインの場合、フィッシングメールの可能性が高いです。"
  },
  // フィッシング問題 2
  {
    type: "phishing",
    question: "このSMSのリンクをクリックしても安全か？\n(内容: '未払い料金があります。こちらからご確認ください。')",
    image: "",
    options: ["安全である", "危険である", "内容による", "判断できない"],
    answer: 1, // 1番目の選択肢「危険である」が正解
    explanation: "身に覚えのない請求や、焦りを誘うメッセージはフィッシング詐欺の可能性が高いです。安易にリンクをクリックしてはいけません。"
  },
  // フィッシング問題 3
  {
    type: "phishing",
    question: "このサイトは偽物か？\n(URL: 'https://www.example.co.jp.login.xyz')",
    image: "",
    options: ["偽物である", "本物である", "判断できない", "URLが間違っている"],
    answer: 0,
    explanation: "正規のドメインの後に別のドメインが続いている場合、偽サイトの可能性が高いです。"
  },
];

// キャラクターのセリフ
const allyDialogue = "よく来てくれた！今この街ではSNSでの画像流出や偽メールの被害が急増している。君には実戦を通じてこの状況を打破してもらう！";
const enemyDialogue = "ククク…この画像さえあれば、この人物の住所は一発特定だ…！";

// ====================
// 画面切り替え機能
// ====================

/**
 * 指定されたIDの画面を表示し、他の画面を非表示にする
 * @param {string} id - 表示したい画面のID
 */
function showScreen(id) {
  // 全ての画面にhiddenクラスを追加（非表示にする）
  screens.forEach((screenId) => {
    document.getElementById(screenId)?.classList.add("hidden");
  });
  // 指定された画面だけhiddenクラスを削除（表示する）
  document.getElementById(id)?.classList.remove("hidden");
}

/**
 * 次の画面に進む関数
 * 画面の種類に応じて特別な処理を実行
 */
function nextScreen() {
  currentScreenIndex++; // 画面インデックスを進める
  const nextScreenId = screens[currentScreenIndex]; // 次の画面のIDを取得

  // 味方キャラクター画面の場合、セリフを表示
  if (nextScreenId === "intro-ally-screen") {
    document.getElementById("ally-dialogue").innerText = allyDialogue;
  } 
  // 敵キャラクター画面の場合、セリフを表示
  else if (nextScreenId === "intro-enemy-screen") {
    document.getElementById("enemy-dialogue").innerText = enemyDialogue;
  } 
  // エンディング画面の場合、特別処理
  else if (nextScreenId === "ending-screen") {
    displayEnding();
    return; // これ以上画面を進めないようにする
  }

  showScreen(nextScreenId); // 指定された画面を表示
}

// ====================
// クイズ機能
// ====================

/**
 * クイズループを開始する関数
 * 敵キャラクター画面からクイズ画面に移行する際に呼ばれる
 */
function startQuizLoop() {
  currentScreenIndex = screens.indexOf("quiz-screen"); // クイズ画面のインデックスに設定
  loadQuestion(); // 最初の問題を読み込み
  showScreen("quiz-screen"); // クイズ画面を表示
}

/**
 * 現在の問題を画面に表示する関数
 */
function loadQuestion() {
  // 問題がもうない場合のエラー処理
  if (currentQuestionIndex >= quizData.length) {
    console.error("No more questions available!");
    return;
  }

  const q = quizData[currentQuestionIndex]; // 現在の問題データを取得
  document.getElementById("question-text").innerText = q.question; // 問題文を表示

  // 問題に画像がある場合の処理
  const questionImage = document.getElementById("question-image");
  if (q.image) {
    questionImage.src = q.image; // 画像のURLを設定
    questionImage.classList.remove("hidden"); // 画像を表示
  } else {
    questionImage.classList.add("hidden"); // 画像を非表示
    questionImage.src = ""; // 画像URLをクリア
  }

  // 選択肢ボタンを動的に生成
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = ""; // 前の選択肢をクリア

  // 各選択肢に対してボタンを作成
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button"); // ボタン要素を作成
    btn.innerText = opt; // ボタンのテキストを設定
    // ボタンがクリックされた時の処理
    btn.onclick = () => {
      // 全てのボタンから選択状態を削除
      document.querySelectorAll("#options button").forEach((b) => b.classList.remove("selected"));
      // クリックされたボタンを選択状態にする
      btn.classList.add("selected");
      btn.dataset.selected = i; // どの選択肢が選ばれたかを記録
      document.getElementById("submit-btn").disabled = false; // 攻撃ボタンを有効化
    };
    optionsDiv.appendChild(btn); // ボタンを画面に追加
  });

  document.getElementById("submit-btn").disabled = true; // 攻撃ボタンを無効化（選択肢が選ばれるまで）
}

/**
 * プレイヤーの回答を提出・判定する関数
 */
function submitAnswer() {
  // 選択されたボタンを取得
  const selectedButton = document.querySelector("#options button.selected");
  if (!selectedButton) {
    alert("選択肢を選んでください！");
    return;
  }

  // 選択された選択肢のインデックスを取得
  const selectedIndex = parseInt(selectedButton.dataset.selected);
  // 正解かどうかを判定
  const isCorrect = selectedIndex === quizData[currentQuestionIndex].answer;

  // 結果表示用の要素を取得
  const resultMessage = document.getElementById("result-message");
  const explanationText = document.getElementById("explanation-text");
  const battleAnimation = document.getElementById("battle-animation");

  battleAnimation.className = 'battle-animation'; // アニメーションクラスをリセット

  // 正解・不正解に応じた処理
  if (isCorrect) {
    score++; // スコアを増加
    resultMessage.innerText = "正解！よくやった！";
    battleAnimation.classList.add("attack-success"); // 攻撃成功アニメーション
  } else {
    resultMessage.innerText = "不正解です...";
    battleAnimation.classList.add("damage-taken"); // ダメージアニメーション
  }
  explanationText.innerText = quizData[currentQuestionIndex].explanation; // 解説を表示

  showScreen("result-screen"); // 結果画面を表示
  quizzesCompleted++; // 完了した問題数を増加
}

/**
 * 次の問題またはエンディングに進む関数
 */
function nextQuizOrEnding() {
  currentQuestionIndex++; // 問題インデックスを進める
  document.getElementById("battle-animation").className = 'battle-animation'; // アニメーションをクリア

  // まだ問題が残っている場合
  if (quizzesCompleted < totalQuizzes) {
    loadQuestion(); // 次の問題を読み込み
    showScreen("quiz-screen"); // クイズ画面を表示
  } else {
    // 全問題が終了した場合
    displayEnding(); // エンディングを表示
  }
}

// ====================
// エンディング機能
// ====================

/**
 * ゲーム終了時のエンディング画面を表示する関数
 * スコアに応じて称号を決定し、結果を表示する
 */
function displayEnding() {
  const finalScoreElement = document.getElementById("final-score");
  const titleDisplayElement = document.getElementById("title-display");
  let title = "";

  // スコアに基づいて称号を決定
  if (score === totalQuizzes) {
    title = "サイバーマスター"; // 全問正解
  } else if (score >= totalQuizzes / 2) {
    title = "情報防衛隊員"; // 半分以上正解
  } else {
    title = "新米見習い"; // 半分未満の正解
  }

  // 最終スコアと称号を画面に表示
  finalScoreElement.innerText = `あなたのスコア: ${score}/${totalQuizzes}`;
  titleDisplayElement.innerText = `称号: ${title}`;

  // オプション: 満点の場合の特別な会話表示（現在はコメントアウト）
  // if (score === totalQuizzes) {
  //   document.querySelector('.character-conversation-ending').classList.remove('hidden');
  // }

  showScreen("ending-screen"); // エンディング画面を表示
}

// ====================
// 初期化処理
// ====================

/**
 * ページが完全に読み込まれた後に実行される初期化処理
 * ゲームの開始画面を表示する
 */
document.addEventListener("DOMContentLoaded", () => {
  showScreen("start-screen"); // スタート画面を表示
});
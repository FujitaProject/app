const screens = [
  "start-screen",
  "story-screen",
  "intro-ally-screen",
  "intro-enemy-screen",
  "quiz-screen",
  "result-screen",
  "ending-screen",
];

let currentScreenIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
const totalQuizzes = 6; // 3 image problems + 3 phishing problems
let quizzesCompleted = 0;

const quizData = [
  {
    type: "image",
    question: "この画像は個人情報を含んでいる？\n(例: 地図、顔写真など)",
    image: "https://via.placeholder.com/400x200?text=Question+Image+1", // Placeholder image
    options: ["はい", "いいえ", "たぶん", "画像がないよ"],
    answer: 0,
    explanation: "この画像にはGPS情報が含まれている可能性があります。"
  },
  {
    type: "image",
    question: "この写真から住所を特定できる可能性は？\n(例: 背景の建物、看板など)",
    image: "https://via.placeholder.com/400x200?text=Question+Image+2",
    options: ["非常に高い", "低い", "不可能", "分からない"],
    answer: 0,
    explanation: "背景に特徴的な建物や看板が写っている場合、住所特定の危険性があります。"
  },
  {
    type: "image",
    question: "この写真に写っている人物は加工されている？\n(例: 美顔加工、背景除去など)",
    image: "https://via.placeholder.com/400x200?text=Question+Image+3",
    options: ["はい", "いいえ", "どちらとも言えない", "写真がない"],
    answer: 0,
    explanation: "SNSでは加工された画像が多く、見分けることが重要です。"
  },
  {
    type: "phishing",
    question: "このメールはフィッシングメールか？\n(送信元: 'amazon@phishing.com')",
    image: "", // No image for phishing email example
    options: ["はい", "いいえ", "判断できない", "どちらでもない"],
    answer: 0,
    explanation: "送信元が公式と異なるドメインの場合、フィッシングメールの可能性が高いです。"
  },
  {
    type: "phishing",
    question: "このSMSのリンクをクリックしても安全か？\n(内容: '未払い料金があります。こちらからご確認ください。')",
    image: "",
    options: ["安全である", "危険である", "内容による", "判断できない"],
    answer: 1,
    explanation: "身に覚えのない請求や、焦りを誘うメッセージはフィッシング詐欺の可能性が高いです。安易にリンクをクリックしてはいけません。"
  },
  {
    type: "phishing",
    question: "このサイトは偽物か？\n(URL: 'https://www.example.co.jp.login.xyz')",
    image: "",
    options: ["偽物である", "本物である", "判断できない", "URLが間違っている"],
    answer: 0,
    explanation: "正規のドメインの後に別のドメインが続いている場合、偽サイトの可能性が高いです。"
  },
];

const allyDialogue = "よく来てくれた！今この街ではSNSでの画像流出や偽メールの被害が急増している。君には実戦を通じてこの状況を打破してもらう！";
const enemyDialogue = "ククク…この画像さえあれば、この人物の住所は一発特定だ…！";

function showScreen(id) {
  screens.forEach((screenId) => {
    document.getElementById(screenId)?.classList.add("hidden");
  });
  document.getElementById(id)?.classList.remove("hidden");
}

function nextScreen() {
  currentScreenIndex++;
  const nextScreenId = screens[currentScreenIndex];

  if (nextScreenId === "intro-ally-screen") {
    document.getElementById("ally-dialogue").innerText = allyDialogue;
  } else if (nextScreenId === "intro-enemy-screen") {
    document.getElementById("enemy-dialogue").innerText = enemyDialogue;
  } else if (nextScreenId === "ending-screen") {
    displayEnding();
    return; // Prevent further screen progression
  }

  showScreen(nextScreenId);
}

function startQuizLoop() {
  currentScreenIndex = screens.indexOf("quiz-screen"); // Set to quiz screen index
  loadQuestion();
  showScreen("quiz-screen");
}

function loadQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    // Should not happen if totalQuizzes is correctly set and loop managed
    console.error("No more questions available!");
    return;
  }

  const q = quizData[currentQuestionIndex];
  document.getElementById("question-text").innerText = q.question;

  const questionImage = document.getElementById("question-image");
  if (q.image) {
    questionImage.src = q.image;
    questionImage.classList.remove("hidden");
  } else {
    questionImage.classList.add("hidden");
    questionImage.src = ""; // Clear image if not used
  }

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = ""; // Clear previous options

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => {
      // Remove 'selected' class from all buttons
      document.querySelectorAll("#options button").forEach((b) => b.classList.remove("selected"));
      // Add 'selected' class to the clicked button
      btn.classList.add("selected");
      btn.dataset.selected = i;
      document.getElementById("submit-btn").disabled = false; // Enable submit button
    };
    optionsDiv.appendChild(btn);
  });

  document.getElementById("submit-btn").disabled = true; // Disable until an option is selected
}

function submitAnswer() {
  const selectedButton = document.querySelector("#options button.selected");
  if (!selectedButton) {
    alert("選択肢を選んでください！");
    return;
  }

  const selectedIndex = parseInt(selectedButton.dataset.selected);
  const isCorrect = selectedIndex === quizData[currentQuestionIndex].answer;

  const resultMessage = document.getElementById("result-message");
  const explanationText = document.getElementById("explanation-text");
  const battleAnimation = document.getElementById("battle-animation");

  battleAnimation.className = 'battle-animation'; // Reset classes

  if (isCorrect) {
    score++;
    resultMessage.innerText = "正解！よくやった！";
    battleAnimation.classList.add("attack-success");
  } else {
    resultMessage.innerText = "不正解です...";
    battleAnimation.classList.add("damage-taken");
  }
  explanationText.innerText = quizData[currentQuestionIndex].explanation;

  showScreen("result-screen");
  quizzesCompleted++;
}

function nextQuizOrEnding() {
  currentQuestionIndex++;
  document.getElementById("battle-animation").className = 'battle-animation'; // Clear animation

  if (quizzesCompleted < totalQuizzes) {
    loadQuestion();
    showScreen("quiz-screen");
  } else {
    displayEnding();
  }
}

function displayEnding() {
  const finalScoreElement = document.getElementById("final-score");
  const titleDisplayElement = document.getElementById("title-display");
  let title = "";

  // Assign title based on score
  if (score === totalQuizzes) {
    title = "サイバーマスター";
  } else if (score >= totalQuizzes / 2) {
    title = "情報防衛隊員";
  } else {
    title = "新米見習い";
  }

  finalScoreElement.innerText = `あなたのスコア: ${score}/${totalQuizzes}`;
  titleDisplayElement.innerText = `称号: ${title}`;

  // Optional: Show character conversation for ending
  // if (score === totalQuizzes) {
  //   document.querySelector('.character-conversation-ending').classList.remove('hidden');
  // }

  showScreen("ending-screen");
}

// Initial setup: show the start screen
document.addEventListener("DOMContentLoaded", () => {
  showScreen("start-screen");
});
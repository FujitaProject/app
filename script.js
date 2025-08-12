// ==================== 基本設定 ====================
const screens = [
  "start-screen","story-screen","intro-ally-screen","intro-enemy-screen",
  "quiz-screen","result-screen","ending-screen",
];
let currentScreenIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
const totalQuizzes = 6;
let quizzesCompleted = 0;

// ==================== データ ====================
const quizData = [
  { type: "image",
    question: "この画像は個人情報を含んでいる？\n(例: 地図、顔写真など)",
    image: "https://via.placeholder.com/400x200?text=Question+Image+1",
    options: ["はい","いいえ","たぶん","画像がないよ"],
    answer: 0,
    explanation: "この画像にはGPS情報が含まれている可能性があります。"
  },
  { type: "image",
    question: "この写真から住所を特定できる可能性は？\n(例: 背景の建物、看板など)",
    image: "https://via.placeholder.com/400x200?text=Question+Image+2",
    options: ["非常に高い","低い","不可能","分からない"],
    answer: 0,
    explanation: "背景に特徴的な建物や看板が写っている場合、住所特定の危険性があります。"
  },
  { type: "image",
    question: "この写真に写っている人物は加工されている？\n(例: 美顔加工、背景除去など)",
    image: "https://via.placeholder.com/400x200?text=Question+Image+3",
    options: ["はい","いいえ","どちらとも言えない","写真がない"],
    answer: 0,
    explanation: "SNSでは加工された画像が多く、見分けることが重要です。"
  },
  { type: "phishing",
    question: "このメールはフィッシングメールか？\n(送信元: 'amazon@phishing.com')",
    image: "",
    options: ["はい","いいえ","判断できない","どちらでもない"],
    answer: 0,
    explanation: "送信元が公式と異なるドメインの場合、フィッシングメールの可能性が高いです。"
  },
  { type: "phishing",
    question: "このSMSのリンクをクリックしても安全か？\n(内容: '未払い料金があります。こちらからご確認ください。')",
    image: "",
    options: ["安全である","危険である","内容による","判断できない"],
    answer: 1,
    explanation: "焦らせる請求メッセージは典型的。リンクは踏まないこと。"
  },
  { type: "phishing",
    question: "このサイトは偽物か？\n(URL: 'https://www.example.co.jp.login.xyz')",
    image: "",
    options: ["偽物である","本物である","判断できない","URLが間違っている"],
    answer: 0,
    explanation: "正規ドメインの後ろに別ドメインがある形式は偽サイトの定番。"
  },
];

const allyDialogue = "よく来てくれた！SNSの画像流出と偽メールが急増中だ。実戦で鍛えるぞ！";
const enemyDialogue = "ククク…この画像があれば住所特定など容易い…！";

// ==================== 画面切替 ====================
function showScreen(id){
  screens.forEach(s => document.getElementById(s)?.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
}
function nextScreen(){
  currentScreenIndex++;
  const nextId = screens[currentScreenIndex];
  if(nextId === "intro-ally-screen"){
    document.getElementById("ally-dialogue").innerText = allyDialogue;
  }else if(nextId === "intro-enemy-screen"){
    document.getElementById("enemy-dialogue").innerText = enemyDialogue;
  }else if(nextId === "ending-screen"){
    displayEnding(); return;
  }
  showScreen(nextId);
}

// ==================== クイズ ====================
function startQuizLoop(){
  currentScreenIndex = screens.indexOf("quiz-screen");
  loadQuestion();
  showScreen("quiz-screen");
}

function loadQuestion(){
  if(currentQuestionIndex >= quizData.length){ console.error("No more questions"); return; }
  const q = quizData[currentQuestionIndex];

  // タイトル/本文
  document.getElementById("card-heading").innerText =
    q.type === "phishing" ? "Which is a phishing risk?" : "Image Safety Check";
  document.getElementById("question-text").innerText = q.question;

  // 画像 or プレースホルダ
  const img = document.getElementById("question-image");
  const ph  = document.getElementById("question-illustration");
  if(q.image){
    img.src = q.image;
    img.classList.remove("hidden");
    ph.classList.add("hidden");
  }else{
    img.src = "";
    img.classList.add("hidden");
    ph.classList.remove("hidden");
  }

  // 選択肢
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach((opt,i)=>{
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = ()=>{
      document.querySelectorAll("#options button").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      btn.dataset.selected = i;
      document.getElementById("submit-btn").disabled = false;
    };
    optionsDiv.appendChild(btn);
  });
  document.getElementById("submit-btn").disabled = true;
}

function submitAnswer(){
  const selectedButton = document.querySelector("#options button.selected");
  if(!selectedButton){ alert("選択肢を選んでください！"); return; }

  const idx = parseInt(selectedButton.dataset.selected,10);
  const isCorrect = idx === quizData[currentQuestionIndex].answer;

  const resultMessage = document.getElementById("result-message");
  const explanationText = document.getElementById("explanation-text");
  const battleAnimation = document.getElementById("battle-animation");
  battleAnimation.className = "battle-animation";

  if(isCorrect){
    score++;
    resultMessage.innerText = "正解！よくやった！";
    battleAnimation.classList.add("attack-success");
  }else{
    resultMessage.innerText = "不正解…次で巻き返そう。";
    battleAnimation.classList.add("damage-taken");
  }
  explanationText.innerText = quizData[currentQuestionIndex].explanation;
  showScreen("result-screen");
  quizzesCompleted++;
}

function nextQuizOrEnding(){
  currentQuestionIndex++;
  document.getElementById("battle-animation").className = "battle-animation";
  if(quizzesCompleted < totalQuizzes){
    loadQuestion();
    showScreen("quiz-screen");
  }else{
    displayEnding();
  }
}

// ==================== Ending ====================
function displayEnding(){
  const finalScoreElement = document.getElementById("final-score");
  const titleDisplayElement = document.getElementById("title-display");
  let title = "";
  if(score === totalQuizzes) title = "サイバーマスター";
  else if(score >= totalQuizzes/2) title = "情報防衛隊員";
  else title = "新米見習い";
  finalScoreElement.innerText = `あなたのスコア: ${score}/${totalQuizzes}`;
  titleDisplayElement.innerText = `称号: ${title}`;
  showScreen("ending-screen");
}

// ==================== init ====================
document.addEventListener("DOMContentLoaded", ()=>{ showScreen("start-screen"); });

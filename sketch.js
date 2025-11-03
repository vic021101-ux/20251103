let questionTable;
let allQuestions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'finished'

let buttons = [];
let feedbackText = '';
let feedbackColor = 0;

// 在 setup() 之前載入外部檔案
function preload() {
  // 載入CSV檔案，並指定它有標頭(header)
  questionTable = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  createCanvas(600, 400);
  
  // 將表格資料轉換成我們喜歡的物件陣列格式
  for (let row of questionTable.rows) {
    allQuestions.push(row.obj);
  }

  // 初始畫面按鈕
  createStartButton();
}

function draw() {
  background(240);
  
  if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'playing') {
    drawPlayingScreen();
  } else if (gameState === 'finished') {
    drawFinishedScreen();
  }

  // 顯示答題回饋
  if (feedbackText) {
    fill(feedbackColor);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(feedbackText, width / 2, height - 30);
  }
}

function drawStartScreen() {
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(0);
  text('歡迎來到 p5.js 小測驗！', width / 2, height / 2 - 40);
  textSize(20);
  text('準備好挑戰了嗎？', width / 2, height / 2 + 10);
}

function drawPlayingScreen() {
  if (quizQuestions.length > 0) {
    let q = quizQuestions[currentQuestionIndex];
    
    // 顯示題號
    textAlign(LEFT, TOP);
    textSize(18);
    fill(100);
    text(`第 ${currentQuestionIndex + 1} / ${quizQuestions.length} 題`, 20, 20);

    // 顯示題目
    textSize(24);
    fill(0);
    textAlign(CENTER, CENTER);
    text(q.question, width / 2, height / 2 - 80);
  }
}

function drawFinishedScreen() {
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(0);
  text(`測驗結束！你的分數是：${score}`, width / 2, height / 2 - 80);

  let feedback = '';
  if (score === 3) {
    feedback = '太棒了！你是 p5.js 大師！';
  } else if (score >= 1) {
    feedback = '不錯喔！繼續努力！';
  } else {
    feedback = '別灰心，再試一次吧！';
  }
  textSize(22);
  text(feedback, width / 2, height / 2 - 20);
}

function startQuiz() {
  gameState = 'playing';
  score = 0;
  currentQuestionIndex = 0;
  feedbackText = '';

  // 從所有問題中隨機排序並取出3題
  allQuestions.sort(() => Math.random() - 0.5);
  quizQuestions = allQuestions.slice(0, 3);

  displayQuestion();
}

function displayQuestion() {
  // 清除舊的按鈕和回饋
  clearButtons();
  feedbackText = '';

  let q = quizQuestions[currentQuestionIndex];
  let options = ['A', 'B', 'C', 'D'];
  
  for (let i = 0; i < options.length; i++) {
    let optionKey = 'option' + options[i];
    if (q[optionKey]) { // 檢查選項是否存在
      let btn = createButton(`${options[i]}. ${q[optionKey]}`);
      btn.position(width / 2 - 150, height / 2 + i * 40);
      btn.size(300, 30);
      btn.style('font-size', '16px');
      btn.mousePressed(() => checkAnswer(options[i]));
      buttons.push(btn);
    }
  }
}

function checkAnswer(selectedOption) {
  let correct = quizQuestions[currentQuestionIndex].answer;
  if (selectedOption === correct) {
    score++;
    feedbackText = '答對了！';
    feedbackColor = color(0, 150, 0); // 綠色
  } else {
    feedbackText = `答錯了，正確答案是 ${correct}`;
    feedbackColor = color(200, 0, 0); // 紅色
  }

  // 延遲一下再到下一題，讓使用者看到回饋
  setTimeout(nextQuestion, 1200);
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    displayQuestion();
  } else {
    gameState = 'finished';
    clearButtons();
    createStartButton('再玩一次'); // 結束畫面按鈕
  }
}

function clearButtons() {
  for (let btn of buttons) {
    btn.remove();
  }
  buttons = [];
}

function createStartButton(label = '開始測驗') {
  clearButtons();
  let startBtn = createButton(label);
  startBtn.position(width / 2 - 80, height / 2 + 60);
  startBtn.size(160, 50);
  startBtn.style('font-size', '20px');
  startBtn.mousePressed(startQuiz);
  buttons.push(startBtn);
}

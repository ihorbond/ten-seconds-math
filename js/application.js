const audio = new Audio();
audio.src = "./audios/cash-register.mp3";
let correctAnswer;
let correctAnswerCount = 0;
let wrongAnswerCount = 0;
let timer = 10;
let score = 0;
let timeLeft = 1.5; //angle for around timer circle
const canvas = document.getElementById('timer');
const ctx = canvas.getContext("2d");
draw();
let a = document.getElementById("answer");
let c = document.getElementById("controls");
let q = document.getElementById("question");
a.classList.add("hidden");
q.classList.add("hidden");
a.onchange = checkAnswer;
document.getElementById('start-game').onclick = () => {
  startTimer();
  startNewGame();
};
document.getElementById('restart').onclick = () => {
  location.reload();
};

function draw() {
  //position timer within the cirlce
  let dx = 25;
  const dy = 15;
  if (timer < 10) {
    dx = 15;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2 - 5, 1.501 * Math.PI, timeLeft * Math.PI);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.font = "italic bold 50px MATH";
  ctx.fillText(timer, canvas.width / 2 - dx, canvas.height / 2 + dy);
}

function startTimer() {
  let intervalID = setInterval(() => {
    timer -= 1;
    timeLeft -= 0.2;
    draw();
    document.getElementById('timer').innerHTML = timer;
    if (timer <= 0) {
      clearInterval(intervalID);
      gameOver();
    }
  }, 1500);
}

function startNewGame() {
  c.classList.add("hidden");
  q.classList.remove("hidden");
  a.classList.remove("hidden");
  const numberLimit = document.getElementById('limit').value;
  const operations = selectedOperations();
  let n1 = Math.floor((Math.random() * numberLimit) + 1);
  let n2 = Math.floor((Math.random() * numberLimit) + 1);
  const checkedArr = _.without(operations, false); //removing all false values
  let i;
  let operation;
  if (checkedArr.length === 0) { //make sure there is at least one true value in the array
    //if no operaton selecred random operation will be selected by default
    operations[Math.floor(Math.random() * 4)] = true;
  }
  while (true) {
    i = Math.floor(Math.random() * 4);
    if (operations[i]) {
      break;
    }
  }

  switch (i) {
    case 0:
      correctAnswer = n1 + n2;
      operation = "+";
      break;
    case 1:
      correctAnswer = n1 - n2;
      operation = "-";
      break;
    case 2:
      correctAnswer = n1 * n2;
      operation = "*";
      break;
    case 3:
      do { //even numbers only
        n1 = Math.floor((Math.random() * numberLimit / 2) + 1) * 2;
        n2 = Math.floor((Math.random() * numberLimit / 2) + 1) * 2;
      } while (n1 % n2 !== 0);
      if (n1 < n2) {
        [n1, n2] = [n2, n1]; //swapping values so that n1 = n2, n2 = n1
      }
      operation = "/";
      correctAnswer = n1 / n2;
      break;
  }
  q.innerHTML = `Solve: ${n1} ${operation} ${n2}`;
}

function gameOver() {
  q.innerHTML = `Your Score: ${score} <br> <span class="correct">C</span>/<span class="wrong">R</span>:
                <span class="correct">${correctAnswerCount}</span>/<span class="wrong">${wrongAnswerCount}<span>`;
  document.getElementById('restart').classList.remove('hidden');
  a.classList.add("hidden");
}

function selectedOperations() {
  // let arr = [document.getElementById('addition').checked, document.getElementById('substraction').checked, document.getElementById('multiplication').checked,document.getElementById('division').checked];
  const addition = document.getElementById('addition').checked;
  const substraction = document.getElementById('substraction').checked;
  const multiplication = document.getElementById('multiplication').checked;
  const division = document.getElementById('division').checked;
  const operationsArr = [addition, substraction, multiplication, division];
  return operationsArr;
}

function checkAnswer() {
  // console.log(correctAnswer);
  if (timer > 0 && correctAnswer === parseInt(a.value)) {
    audio.play();
    a.value = '';
    a.classList.remove("glowRed");
    timer += 1;
    score += 10;
    timeLeft += 0.2;
    correctAnswerCount++;
    startNewGame();
  } else {
    a.classList.add("glowRed");
    a.value = '';
    wrongAnswerCount++;
  }
}

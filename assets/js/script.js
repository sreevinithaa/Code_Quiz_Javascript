var startButton = document.querySelector("#btnStartGame");
var questionDiv = document.querySelector("#question-div");
var timer_div = document.querySelector("#timer-div");
var record_name = document.querySelector("#record-name");
var highscore = document.querySelector("#highscore");
var playername = document.querySelector("#name");
var btnClearHistory = document.querySelector("#btnClearHistory");

var btnSave = document.querySelector("#btnSave");
var high_score_div = document.querySelector("#high-score-div");
var timer;
var timerCount;
var isWin = false;
var totalQuestion = 0;
var totalCorrect = 0;
var currentquestionid = 0;
var seconremaining = 0;
const wrongAnserdeduction = 2;

// helper function to create table
function CreateTable() {
  var table = document.createElement("table");
  table.setAttribute("id", "Player");
  var row = document.createElement("tr");
  var column1 = document.createElement("th");
  var column2 = document.createElement("th");
  var column3 = document.createElement("th");
  var column4 = document.createElement("th");
  column1.textContent = "Name";
  column2.textContent = "Question Attempt";
  column3.textContent = "Answer Correct";
  column4.textContent = "Seconds Remaining";
  row.appendChild(column1);
  row.appendChild(column2);
  row.appendChild(column3);
  row.appendChild(column4);
  table.appendChild(row);
  return table;
}

function isEmpty(value) {
  return value == undefined || value == null || value.length === 0;
}

//will execute when page loads initially
function init() {
  btnClearHistory.classList.add("hide");
  questionDiv.classList.add("hide");
  timer_div.classList.add("hide");
  record_name.classList.add("hide");
  high_score_div.classList.add("hide");
  return;
}

//will execute when start game button click
function startgame(event) {
  timerCount = 20;
  totalQuestion = 0;
  totalCorrect = 0;
  seconremaining = 0;
  currentquestionid = 0;
  isWin = false;
  startButton.classList.add("hide");
  questionDiv.classList.remove("hide");

  var returnpage = startButton.getAttribute("data-return");
  //check button click come from play again or start game
  if (returnpage == "false") {
  } else {
    high_score_div.classList.add("hide");
    btnClearHistory.classList.add("hide");
    playername.value = "";
    timer_div.textContent = "";
  }
  LoadQuestion(currentquestionid);
  startTimer();
  timer_div.classList.remove("hide");
  return;
}

//start timer
function startTimer() {
  timer = setInterval(function () {
    timerCount--;
    timer_div.textContent = timerCount;
    if (timerCount > 0) {
      if (isWin && timerCount > 0) {
        seconremaining = timerCount;
        // Clears interval and stops timer
        StopGame();
        clearInterval(timer);
      }
    } // Tests if time has run out
    else if (timerCount <= 0) {
      // Clears interval
      StopGame();
      clearInterval(timer);
    }
  }, 1000);
  return;
}

//This method will execute when timer ends or all the question have been answered
function StopGame() {
  questionDiv.classList.add("hide");
  timer_div.classList.add("hide");
  record_name.classList.remove("hide");
  highscore.textContent = `You got ${totalCorrect} correct out of ${totalQuestion} questions in ${seconremaining} seconds remaining`;

  return;
}

//Save data to local storage
function SaveData() {
  if (isEmpty(playername.value)) {
    alert("Name is required!");
    return;
  }
  var score = localStorage.getItem("HighScore");

  if (isEmpty(score)) {
    score = [
      {
        Name: playername.value,
        Score: totalCorrect,
        Total: totalQuestion,
        Remaining_second: seconremaining,
        percentage: totalCorrect / totalQuestion,
      },
    ];
    localStorage.setItem("HighScore", JSON.stringify(score));
  } else {
    var pscore = JSON.parse(score);

    pscore.push({
      Name: playername.value,
      Score: totalCorrect,
      Total: totalQuestion,
      Remaining_second: seconremaining,
      percentage: totalCorrect / totalQuestion,
    });
    localStorage.setItem("HighScore", JSON.stringify(pscore));
  }
  record_name.classList.add("hide");
  high_score_div.classList.remove("hide");
  LoadHighScore();
  return;
}

function ShowFeedback(message)
{
  document.querySelector("#spanResult").textContent = message;
  setInterval(function () {

    document.querySelector("#spanResult").classList.add("hide");
  },1500)
}
//load question method which helps to load the specific question
function LoadQuestion(index) {
  if (totalQuestion > (questionList.length-1) || index > (questionList.length-1)) {
    isWin = true;
    return;
  }

  currentquestionid = index;
  questionDiv.textContent = "";
  totalQuestion = totalQuestion + 1;
  var questions = questionList[index];

  var ul = document.createElement("ul");
  ul.textContent = questions.question;

  for (var i = 0; i < questions.options.length; i++) {
    var child = document.createElement("li");
    var button = document.createElement("button");
    button.textContent = questions.options[i].choice;
    button.classList.add("choicestyle");
    button.setAttribute("IsAnswer", questions.options[i].isAnswer);
    button.setAttribute("QIndex", index);
    button.addEventListener("click", choice_select);
    child.appendChild(button);
    ul.appendChild(child);
  }
  var span = document.createElement("span");
  span.setAttribute("id", "spanResult");
  questionDiv.appendChild(ul);
  questionDiv.appendChild(span);
  return;
}

//will execute when the select the answer
function choice_select(event) {
  var isasner = event.target.getAttribute("IsAnswer");
  var Qid = event.target.getAttribute("QIndex");
  if (isasner == "true") {
    totalCorrect = totalCorrect + 1;
    LoadQuestion(++currentquestionid);
    ShowFeedback("Correct answer!");
    //document.querySelector("#spanResult").textContent = "Correct answer!";
  } else {
    timerCount = timerCount - wrongAnserdeduction;
    if (timerCount < 0) {
      timerCount = 0;
    }
    LoadQuestion(++currentquestionid);
    ShowFeedback("Wrong answer!");
   // document.querySelector("#spanResult").textContent = "Wrong answer!";
  }
  return;
}

//load high scores into the table
function LoadHighScore() {
  var score = localStorage.getItem("HighScore");
  btnClearHistory.classList.remove("hide");
  high_score_div.textContent = "";
  var h2 = document.createElement("h2");
  h2.textContent = "High Scores";
  high_score_div.appendChild(h2);
  if (isEmpty(score)) {
    high_score_div.innerHTML = "No records available!";
    startButton.classList.remove("hide");
    startButton.setAttribute("data-return", true);
  } else {
    startButton.textContent = "Play Again";
    startButton.setAttribute("data-return", true);
    startButton.classList.remove("hide");
    var table = CreateTable();

    var pscore = JSON.parse(score);
    pscore.sort(function (a, b) {
      if(b.Score>a.Score)
      {
        return 1
      }
      else{
        return -1
      }
     
    });
    for (var i = 0; i < pscore.length; i++) {
      var tr = document.createElement("tr");
      var column1 = document.createElement("td");
      var column2 = document.createElement("td");
      var column3 = document.createElement("td");
      var column4 = document.createElement("td");
      column1.textContent = pscore[i].Name;
      column2.textContent = pscore[i].Score;
      column3.textContent = pscore[i].Total;
      column4.textContent = pscore[i].Remaining_second;
      tr.appendChild(column1);
      tr.appendChild(column2);
      tr.appendChild(column3);
      tr.appendChild(column4);
      table.appendChild(tr);
    }
    high_score_div.appendChild(table);
  }
  return;
}

//clear history
function ClearHistory() {
  localStorage.setItem("HighScore", "");
  LoadHighScore();
  return;
}

startButton.addEventListener("click", startgame);
btnSave.addEventListener("click", SaveData);
btnClearHistory.addEventListener("click", ClearHistory);
init();

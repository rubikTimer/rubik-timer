let timerDisplay = document.getElementById("timer");
let resetButton = document.getElementById("reset");
let timesList = document.getElementById("timesList");
let scrambleDisplay = document.getElementById("scramble");

let elapsedTime = 0;
let timerInterval = null;
let running = false;

let spacePressed = false;
let ready = false;


// carica tempi salvati
let savedTimes = JSON.parse(localStorage.getItem("rubikTimes")) || [];

updateTimesList();
generateScramble();
updateAverage();


// START TIMER
function startChrono() {

  const startTime = Date.now();

  timerInterval = setInterval(() => {

    elapsedTime = Date.now() - startTime;

    timerDisplay.textContent = formatTime(elapsedTime);

  }, 10);

  running = true;

}


// STOP TIMER
function stopTimer() {

  clearInterval(timerInterval);

  running = false;

  if (elapsedTime > 0) {

    savedTimes.push(formatTime(elapsedTime));

    savedTimes.sort((a, b) => toMs(a) - toMs(b));

    localStorage.setItem("rubikTimes", JSON.stringify(savedTimes));

    updateTimesList();
    updateAverage();

    generateScramble();

    elapsedTime = 0;

  }

}


// RESET BUTTON
resetButton.addEventListener("click", () => {

  clearInterval(timerInterval);

  running = false;

  timerDisplay.textContent = "00:00.00";

  savedTimes = [];

  localStorage.removeItem("rubikTimes");

  updateTimesList();
  updateAverage();

});


// FORMAT TIME
function formatTime(ms) {

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  return (
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0") + "." +
    String(centiseconds).padStart(2, "0")
  );

}


// STRING → MS
function toMs(t) {

  let parts = t.split(/[:.]/);

  return parseInt(parts[0]) * 60000 +
         parseInt(parts[1]) * 1000 +
         parseInt(parts[2]) * 10;

}


// UPDATE TIMES LIST
function updateTimesList() {

  timesList.innerHTML = "";

  if (savedTimes.length === 0) return;

  let timesMs = savedTimes.map(toMs);

  let minTime = Math.min(...timesMs);
  let maxTime = Math.max(...timesMs);

  savedTimes.forEach((time, index) => {

    let li = document.createElement("li");

    li.textContent = time;

    let tMs = timesMs[index];

    if (tMs === minTime) {

      li.style.color = "green";
      li.style.fontWeight = "bold";

    } else if (tMs === maxTime) {

      li.style.color = "red";
      li.style.fontWeight = "bold";

    } else {

      li.style.color = "black";

    }

    timesList.appendChild(li);

  });

}


// AVERAGE OF 5
function updateAverage() {

  if (savedTimes.length < 5) {

    document.getElementById("avg5").textContent = "Avg5: --";
    return;

  }

  let last5 = savedTimes.slice(0, 5).map(toMs);

  let avg = last5.reduce((a, b) => a + b) / 5;

  document.getElementById("avg5").textContent =
    "Avg5: " + formatTime(avg);

}


// SCRAMBLE GENERATOR
function generateScramble() {

  const moves = ["R", "L", "U", "D", "F", "B"];
  const mods = ["", "'", "2"];

  let scramble = [];

  for (let i = 0; i < 20; i++) {

    let move = moves[Math.floor(Math.random() * moves.length)];
    let mod = mods[Math.floor(Math.random() * mods.length)];

    scramble.push(move + mod);

  }

  scrambleDisplay.textContent = scramble.join(" ");

}


// SPACEBAR CONTROL
document.addEventListener("keydown", (e) => {

  if (e.code === "Space" && !spacePressed) {

    e.preventDefault();

    spacePressed = true;

    if (running) {

      stopTimer();

    } else {

      ready = true;

      timerDisplay.textContent = "00:00.00";
      timerDisplay.style.color = "green";

    }

  }

});


document.addEventListener("keyup", (e) => {

  if (e.code === "Space") {

    spacePressed = false;

    if (ready && !running) {

      timerDisplay.style.color = "black";

      startChrono();

      ready = false;

    }

  }

});
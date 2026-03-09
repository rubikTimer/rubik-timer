let timerDisplay = document.getElementById("timer");
let startStopButton = document.getElementById("startStop");
let resetButton = document.getElementById("reset");
let timesList = document.getElementById("timesList");

let elapsedTime = 0;
let timerInterval = null;
let countdownInterval = null;
let running = false;
let countdownTime = 5; // 5 secondi

// Carica i tempi salvati
let savedTimes = JSON.parse(localStorage.getItem("rubikTimes")) || [];
updateTimesList();

// Start / Stop
startStopButton.addEventListener("click", () => {
  if (!running) {
    startCountdown();
  } else {
    stopTimer();
  }
});

// Reset
resetButton.addEventListener("click", () => {
  stopTimer();
  elapsedTime = 0;
  timerDisplay.textContent = "00:00.00";

  savedTimes = [];
  localStorage.removeItem("rubikTimes");
  updateTimesList();
});

// Funzione countdown
function startCountdown() {
  countdownTime = 5;
  timerDisplay.textContent = countdownTime;
  startStopButton.disabled = true;

  countdownInterval = setInterval(() => {
    countdownTime--;
    timerDisplay.textContent = countdownTime;
    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null; // ✅ resetta a null
      startStopButton.disabled = false;
      startChrono();
    }
  }, 1000);
}

// Funzione cronometro
function startChrono() {
  const startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    timerDisplay.textContent = formatTime(elapsedTime);
  }, 10);
  startStopButton.textContent = "Stop";
  running = true;
}

// Stop timer
function stopTimer() {
  clearInterval(timerInterval);
  clearInterval(countdownInterval);
  countdownInterval = null; // ✅ resetta a null
  startStopButton.textContent = "Start";
  running = false;

  if (elapsedTime > 0) {
    savedTimes.push(formatTime(elapsedTime));
    savedTimes.sort((a,b) => toMs(a) - toMs(b));
    localStorage.setItem("rubikTimes", JSON.stringify(savedTimes));
    updateTimesList();
    elapsedTime = 0;
  }
}

// Formatta tempo
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

// Converte "mm:ss.cc" in millisecondi
function toMs(t) {
  let parts = t.split(/[:.]/);
  return parseInt(parts[0]) * 60000 + parseInt(parts[1]) * 1000 + parseInt(parts[2]) * 10;
}

// Aggiorna lista dei tempi
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

// Gestisce barra spaziatrice
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // evita lo scroll della pagina
    if (!running && !countdownInterval) {
      startCountdown(); // se fermo, parte il countdown
    } else if (running) {
      stopTimer(); // se in corso, stoppa il cronometro
    }
  }
});
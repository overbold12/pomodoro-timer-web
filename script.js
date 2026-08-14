const DEFAULT_MINUTES = 25;
const MIN_MINUTES = 1;
const MAX_MINUTES = 60;
const STORAGE_KEY = "pomodoroDurationMinutes";

const timerDisplay = document.querySelector(".time");
const minutesDisplay = document.querySelector("#minutes");
const secondsDisplay = document.querySelector("#seconds");
const statusDisplay = document.querySelector("#timer-status");
const startButton = document.querySelector("#start-button");
const stopButton = document.querySelector("#stop-button");
const resetButton = document.querySelector("#reset-button");

function getSavedMinutes() {
  const savedMinutes = Number(window.localStorage.getItem(STORAGE_KEY));

  if (
    Number.isInteger(savedMinutes) &&
    savedMinutes >= MIN_MINUTES &&
    savedMinutes <= MAX_MINUTES
  ) {
    return savedMinutes;
  }

  return DEFAULT_MINUTES;
}

let pomodoroSeconds = getSavedMinutes() * 60;
let remainingSeconds = pomodoroSeconds;
let timerId = null;
let endTime = null;

function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  minutesDisplay.textContent = String(minutes).padStart(2, "0");
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
  timerDisplay.setAttribute(
    "aria-label",
    `남은 시간 ${minutes}분 ${seconds}초`,
  );
  document.title = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} · Pomodoro`;
}

function setRunningState(isRunning) {
  startButton.disabled = isRunning;
  stopButton.disabled = !isRunning;
  statusDisplay.textContent = isRunning ? "집중 중" : "집중 시간";
}

function stopTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }

  endTime = null;
  setRunningState(false);
}

function tick() {
  remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  updateDisplay();

  if (remainingSeconds === 0) {
    stopTimer();
    statusDisplay.textContent = "집중 완료";
  }
}

function startTimer() {
  if (timerId !== null || remainingSeconds === 0) {
    return;
  }

  endTime = Date.now() + remainingSeconds * 1000;
  timerId = window.setInterval(tick, 250);
  setRunningState(true);
}

function resetTimer() {
  stopTimer();
  remainingSeconds = pomodoroSeconds;
  updateDisplay();
}

function applySavedDuration(minutes) {
  if (
    !Number.isInteger(minutes) ||
    minutes < MIN_MINUTES ||
    minutes > MAX_MINUTES
  ) {
    return;
  }

  stopTimer();
  pomodoroSeconds = minutes * 60;
  remainingSeconds = pomodoroSeconds;
  updateDisplay();
}

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY && event.newValue !== null) {
    applySavedDuration(Number(event.newValue));
  }
});

updateDisplay();
setRunningState(false);

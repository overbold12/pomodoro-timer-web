const DEFAULT_MINUTES = 25;
const MIN_MINUTES = 1;
const MAX_MINUTES = 60;
const STORAGE_KEY = "pomodoroDurationMinutes";

const timerMinutesInput = document.querySelector("#timer-minutes");
const saveButton = document.querySelector("#save-button");

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

function getValidInputMinutes() {
  const inputValue = timerMinutesInput.value.trim();
  const minutes = Number(inputValue);

  if (
    inputValue === "" ||
    !Number.isInteger(minutes) ||
    minutes < MIN_MINUTES ||
    minutes > MAX_MINUTES
  ) {
    return null;
  }

  return minutes;
}

function validateTimerInput() {
  const isValid = getValidInputMinutes() !== null;

  saveButton.disabled = !isValid;
  timerMinutesInput.setAttribute("aria-invalid", String(!isValid));

  return isValid;
}

function saveTimerSettings() {
  const minutes = getValidInputMinutes();

  if (minutes === null) {
    validateTimerInput();
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, String(minutes));
  window.location.href = "index.html";
}

timerMinutesInput.value = String(getSavedMinutes());
validateTimerInput();

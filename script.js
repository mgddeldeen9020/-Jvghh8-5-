const timeEl = document.getElementById("time");
const priorityForm = document.getElementById("priority-form");
const priorityInput = document.getElementById("priority-input");
const priorityList = document.getElementById("priority-list");
const energyButtons = document.querySelectorAll("[data-energy]");
const energyStatus = document.getElementById("energy-status");
const timerEl = document.getElementById("timer");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("length-value");

let timerId = null;
let remainingSeconds = Number.parseInt(lengthInput.value, 10) * 60;

const updateClock = () => {
  const now = new Date();
  const formatted = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  timeEl.textContent = `Local time ${formatted}`;
};

const renderTimer = () => {
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;
};

const setTimerLength = () => {
  if (timerId) return;
  const minutes = Number.parseInt(lengthInput.value, 10);
  remainingSeconds = minutes * 60;
  lengthValue.textContent = `${minutes} min`;
  renderTimer();
};

const resetTimer = () => {
  clearInterval(timerId);
  timerId = null;
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = true;
  setTimerLength();
};

const tick = () => {
  if (remainingSeconds > 0) {
    remainingSeconds -= 1;
    renderTimer();
    return;
  }

  resetTimer();
  timerEl.textContent = "Session complete";
};

priorityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = priorityInput.value.trim();
  if (!text) return;

  const item = document.createElement("li");
  const label = document.createElement("span");
  label.textContent = text;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => item.remove());

  item.append(label, removeButton);
  priorityList.appendChild(item);
  priorityInput.value = "";
});

energyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    energyButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    energyStatus.textContent = `Energy level: ${button.dataset.energy}`;
  });
});

startButton.addEventListener("click", () => {
  if (timerId) return;
  startButton.disabled = true;
  pauseButton.disabled = false;
  resetButton.disabled = false;
  timerId = setInterval(tick, 1000);
});

pauseButton.addEventListener("click", () => {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
  startButton.disabled = false;
  pauseButton.disabled = true;
});

resetButton.addEventListener("click", resetTimer);
lengthInput.addEventListener("input", setTimerLength);

updateClock();
setTimerLength();
setInterval(updateClock, 1000 * 60);

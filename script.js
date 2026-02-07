const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const priorityForm = document.getElementById("priority-form");
const priorityInput = document.getElementById("priority-input");
const priorityTag = document.getElementById("priority-tag");
const priorityList = document.getElementById("priority-list");
const priorityCount = document.getElementById("priority-count");
const completedCount = document.getElementById("completed-count");
const remainingCount = document.getElementById("remaining-count");
const energyButtons = document.querySelectorAll("[data-energy]");
const energyStatus = document.getElementById("energy-status");
const timerEl = document.getElementById("timer");
const sessionStatus = document.getElementById("session-status");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("length-value");
const breakToggle = document.getElementById("break-toggle");
const flowFill = document.getElementById("flow-fill");
const flowStatus = document.getElementById("flow-status");
const flowTime = document.getElementById("flow-time");

let timerId = null;
let remainingSeconds = Number.parseInt(lengthInput.value, 10) * 60;

const priorities = [];

const updateClock = () => {
  const now = new Date();
  const formatted = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  timeEl.textContent = `Local time ${formatted}`;
  dateEl.textContent = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const renderCounts = () => {
  const completed = priorities.filter((item) => item.completed).length;
  const remaining = priorities.length - completed;
  priorityCount.textContent = `${priorities.length} items`;
  completedCount.textContent = completed;
  remainingCount.textContent = remaining;
};

const renderPriorities = () => {
  priorityList.innerHTML = "";
  priorities.forEach((item, index) => {
    const li = document.createElement("li");
    if (item.completed) {
      li.classList.add("completed");
    }

    const label = document.createElement("span");
    label.textContent = item.text;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item.tag;

    const actions = document.createElement("div");
    actions.className = "actions";

    const doneButton = document.createElement("button");
    doneButton.type = "button";
    doneButton.textContent = item.completed ? "Undo" : "Done";
    doneButton.addEventListener("click", () => {
      priorities[index].completed = !priorities[index].completed;
      renderPriorities();
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      priorities.splice(index, 1);
      renderPriorities();
    });

    actions.append(doneButton, removeButton);
    li.append(label, tag, actions);
    priorityList.appendChild(li);
  });

  renderCounts();
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
  sessionStatus.textContent = "Ready";
  renderTimer();
};

const resetTimer = () => {
  clearInterval(timerId);
  timerId = null;
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = true;
  sessionStatus.textContent = "Ready";
  setTimerLength();
};

const tick = () => {
  if (remainingSeconds > 0) {
    remainingSeconds -= 1;
    renderTimer();
    return;
  }

  resetTimer();
  timerEl.textContent = breakToggle.checked
    ? "Break time"
    : "Session complete";
  sessionStatus.textContent = breakToggle.checked ? "Break" : "Complete";
};

const updateFlow = () => {
  const now = new Date();
  const hours = now.getHours();
  const percent = Math.min((hours / 24) * 100, 100);
  flowFill.style.width = `${percent}%`;

  let status = "Morning";
  if (hours >= 12 && hours < 17) status = "Afternoon";
  if (hours >= 17) status = "Evening";
  flowStatus.textContent = status;

  const nextBlock = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
    hours < 12 ? 12 : hours < 17 ? 17 : 21, 0, 0);
  flowTime.textContent = nextBlock.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

priorityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = priorityInput.value.trim();
  if (!text) return;

  priorities.push({ text, tag: priorityTag.value, completed: false });
  priorityInput.value = "";
  renderPriorities();
});

energyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    energyButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    energyStatus.textContent = button.dataset.energy;
  });
});

startButton.addEventListener("click", () => {
  if (timerId) return;
  startButton.disabled = true;
  pauseButton.disabled = false;
  resetButton.disabled = false;
  sessionStatus.textContent = "In progress";
  timerId = setInterval(tick, 1000);
});

pauseButton.addEventListener("click", () => {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
  startButton.disabled = false;
  pauseButton.disabled = true;
  sessionStatus.textContent = "Paused";
});

resetButton.addEventListener("click", resetTimer);
lengthInput.addEventListener("input", setTimerLength);

updateClock();
setTimerLength();
renderPriorities();
updateFlow();
setInterval(updateClock, 1000 * 60);
setInterval(updateFlow, 1000 * 60 * 10);

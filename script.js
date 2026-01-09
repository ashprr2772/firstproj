/* =========================
   GET HTML ELEMENTS
========================= */
const progressBar = document.getElementById("progressBar");
const currentPointsText = document.getElementById("currentPoints");
const targetPointsText = document.getElementById("targetPoints");

const targetInput = document.getElementById("targetInput");
const setTargetBtn = document.getElementById("setTargetBtn");

const pointsInput = document.getElementById("pointsInput");
const addPointsBtn = document.getElementById("addPointsBtn");

const historyList = document.getElementById("historyList");
const targetBox = document.querySelector(".target-box");
const changeTargetBtn = document.getElementById("changeTargetBtn");


/* =========================
   APP STATE
========================= */
let targetPoints = 0;
let currentPoints = 0;
let history = [];

/* =========================
   LOAD DATA ON PAGE LOAD
========================= */
function loadData() {
  const savedTarget = localStorage.getItem("targetPoints");
  const savedCurrent = localStorage.getItem("currentPoints");
  const savedHistory = localStorage.getItem("history");

  if (savedTarget) {
    targetPoints = Number(savedTarget);
    targetPointsText.innerText = targetPoints;
    targetBox.style.display = "none";
  }

  if (savedCurrent) {
    currentPoints = Number(savedCurrent);
    currentPointsText.innerText = currentPoints;
  }

  if (savedHistory) {
    history = JSON.parse(savedHistory);
    renderHistory();
  }

  updateProgress();
}

/* =========================
   UPDATE PROGRESS BAR
========================= */
function updateProgress() {
  if (targetPoints === 0) return;

  let percent = (currentPoints / targetPoints) * 100;
  if (percent > 100) percent = 100;

  progressBar.style.width = percent + "%";

  // Color logic
  if (percent < 30) {
    progressBar.style.backgroundColor = "red";
  } else if (percent < 70) {
    progressBar.style.backgroundColor = "orange";
  } else {
    progressBar.style.backgroundColor = "green";
  }

if (currentPoints >= targetPoints) {
  progressBar.style.width = "100%";
  changeTargetBtn.style.display = "inline-block";

  const completed = localStorage.getItem("completed");

  if (!completed) {
    alert("🎉 Congratulations! Target Completed!");
    localStorage.setItem("completed", "true");
  }
}


}

/* =========================
   SET TARGET
========================= */
setTargetBtn.addEventListener("click", () => {
  const value = Number(targetInput.value);

  if (value <= 0) {
    alert("Please enter a valid target");
    return;
  }

  targetPoints = value;
  localStorage.setItem("targetPoints", targetPoints);

  targetPointsText.innerText = targetPoints;
  targetBox.style.display = "none";

  updateProgress();
});

/* =========================
   ADD POINTS
========================= */
addPointsBtn.addEventListener("click", () => {
  const value = Number(pointsInput.value);

  if (value <= 0) {
    alert("Please enter valid points");
    return;
  }

  currentPoints += value;
  localStorage.setItem("currentPoints", currentPoints);
  currentPointsText.innerText = currentPoints;

  const entry = {
    points: value,
    time: new Date().toLocaleString()
  };

  history.unshift(entry);
  localStorage.setItem("history", JSON.stringify(history));

  renderHistory();
  updateProgress();

  pointsInput.value = "";
});

/* =========================
   RENDER HISTORY
========================= */
function renderHistory() {
  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `+${item.points} points — ${item.time}`;
    historyList.appendChild(li);
  });
}

/* =========================
   START APP
========================= */
loadData();
changeTargetBtn.addEventListener("click", () => {
  // Reset everything
  targetPoints = 0;
  currentPoints = 0;
  history = [];

  // Clear storage
 localStorage.removeItem("targetPoints");
localStorage.removeItem("currentPoints");
localStorage.removeItem("history");
localStorage.removeItem("completed");


  // Reset UI
  targetPointsText.innerText = "0";
  currentPointsText.innerText = "0";
  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "red";

  historyList.innerHTML = "";
  targetBox.style.display = "flex";
  changeTargetBtn.style.display = "none";
});


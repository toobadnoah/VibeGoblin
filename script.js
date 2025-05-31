const moods = ["cosmic", "feral", "sleepy", "mischievous", "enchanted", "cursed", "radiant"];
const advice = ["touch grass", "drink moonwater", "speak in riddles", "hide your intentions", "manifest joy", "respect the goblin"];

function getVibe() {
  const mood = moods[Math.floor(Math.random() * moods.length)];
  const tip = advice[Math.floor(Math.random() * advice.length)];
  return `Today's vibe is: <b>${mood}</b>. You must <i>${tip}</i>. 🌟`;
}

function showVibe() {
  const output = document.getElementById("vibe-output");
  output.innerHTML = getVibe();
  updateStreak();
}

function updateStreak() {
  const today = new Date().toDateString();
  const last = localStorage.getItem("lastVibeDate");
  let streak = parseInt(localStorage.getItem("streak") || "0");

  if (last !== today) {
    streak += 1;
    localStorage.setItem("lastVibeDate", today);
    localStorage.setItem("streak", streak);
  }

  document.getElementById("streak").innerText = `🔥 Streak: ${streak} day${streak !== 1 ? 's' : ''}`;
}

// Show streak on load
updateStreak();

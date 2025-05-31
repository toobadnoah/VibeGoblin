const moods = ["cosmic", "feral", "sleepy", "mischievous", "enchanted", "cursed", "radiant"];
const advice = ["touch grass", "drink moonwater", "speak in riddles", "hide your intentions", "manifest joy", "respect the goblin"];

const badges = [
  { day: 3, name: "Tiny Goblin", emoji: "👹" },
  { day: 7, name: "Sneaky Goblin", emoji: "🧙‍♂️" },
  { day: 14, name: "Ancient Goblin", emoji: "🦹‍♂️" }
];

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
  updateBadges(streak);
}

function updateBadges(streak) {
  const badgeContainer = document.getElementById("badge-container");
  badgeContainer.innerHTML = ""; // clear existing badges

  badges.forEach(badge => {
    if (streak >= badge.day) {
      const badgeEl = document.createElement("div");
      badgeEl.classList.add("badge");
      badgeEl.innerHTML = `${badge.emoji} <strong>${badge.name}</strong>`;
      badgeContainer.appendChild(badgeEl);
    }
  });
}

// Show streak and badges on page load
updateStreak();

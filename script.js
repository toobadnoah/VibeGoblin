const vibes = [
  "🧚‍♀️ You’re sparkling with mischievous fairy dust.",
  "🌙 Moonlit magic guides your day.",
  "✨ Pixie-powered chaos incoming.",
  "🦄 Ride the unicorn of wild vibes.",
  "🧙‍♂️ Cast a sly spell of good luck.",
  "🦹‍♂️ Goblin grin: chaos, but make it cute.",
  "🌸 Blossoms bloom where you wander.",
  "🪄 Wand in hand, mischief at heart.",
  "🕯️ Candlelight secrets whisper your fate.",
  "🌈 Your aura’s glowing pinkish-purple today."
];

function revealVibe() {
  const vibe = vibes[Math.floor(Math.random() * vibes.length)];
  document.getElementById("vibeBox").innerText = vibe;

  navigator.clipboard.writeText(`My VibeGoblin Vibe: ${vibe} #VibeGoblin`).then(() => {
    document.getElementById("shareHint").innerText = "📋 Copied! Now paste & post on Warpcast!";
  });
}

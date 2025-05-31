const audio = document.getElementById("karaoke-audio");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const lyricsBox = document.getElementById("lyrics");
const songSelect = document.getElementById("song-select");
const debugBox = document.getElementById("debug");

const tracks = {
  twinkle: {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Twinkle_Twinkle_Little_Star.ogg",
    lyrics: [
      { time: 0, text: "Twinkle, twinkle, little star," },
      { time: 4, text: "How I wonder what you are!" },
      { time: 8, text: "Up above the world so high," },
      { time: 12, text: "Like a diamond in the sky." },
      { time: 16, text: "Twinkle, twinkle, little star," },
      { time: 20, text: "How I wonder what you are!" }
    ]
  }
};

let currentLine = 0;
let lyricInterval;

function logDebug(msg) {
  const p = document.createElement("p");
  p.textContent = "🛠 " + msg;
  debugBox.appendChild(p);
  debugBox.scrollTop = debugBox.scrollHeight;
}

function loadTrack(trackKey) {
  const track = tracks[trackKey];
  audio.src = track.src;
  lyricsBox.innerText = "Lyrics will appear here...";
  currentLine = 0;
  clearInterval(lyricInterval);
  logDebug("Loaded track: " + trackKey);

  startBtn.disabled = true;
  stopBtn.disabled = true;

  audio.load();
  audio.oncanplaythrough = () => {
    logDebug("Audio ready to play");
    startBtn.disabled = false;
  };
}

songSelect.addEventListener("change", () => {
  loadTrack(songSelect.value);
  stopBtn.disabled = true;
  lyricsBox.innerText = "Select a song and start karaoke!";
});

startBtn.onclick = () => {
  audio.currentTime = 0;
  audio.play()
    .then(() => {
      logDebug("🎶 Audio is playing");
      startBtn.disabled = true;
      stopBtn.disabled = false;
      lyricsBox.innerText = "";
      currentLine = 0;

      const trackLyrics = tracks[songSelect.value].lyrics;

      lyricInterval = setInterval(() => {
        const currentTime = Math.floor(audio.currentTime);
        if (currentLine < trackLyrics.length && currentTime >= trackLyrics[currentLine].time) {
          lyricsBox.innerText = trackLyrics[currentLine].text;
          logDebug("Lyric: " + trackLyrics[currentLine].text);
          currentLine++;
        }
      }, 300);
    })
    .catch(err => {
      logDebug("🚫 Audio play failed: " + err.message);
      alert("Audio play failed. Please interact with the page first.");
    });
};

stopBtn.onclick = () => {
  audio.pause();
  audio.currentTime = 0;
  clearInterval(lyricInterval);
  lyricsBox.innerText = "🛑 Karaoke stopped.";
  startBtn.disabled = false;
  stopBtn.disabled = true;
  logDebug("⏹️ Karaoke stopped");
};

document.getElementById("clear-log-btn").addEventListener("click", () => {
  debugBox.innerHTML = "";
  logDebug("🧹 Log cleared");
});

// Load initial track on page load
loadTrack(songSelect.value);
logDebug("✅ App loaded and ready!");

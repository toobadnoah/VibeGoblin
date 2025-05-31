function logDebug(msg) {
  const debug = document.getElementById("debug");
  const p = document.createElement("p");
  p.textContent = "🛠 " + msg;
  debug.appendChild(p);
  debug.scrollTop = debug.scrollHeight; // auto-scroll to bottom
}

document.getElementById("clear-log-btn").addEventListener("click", () => {
  document.getElementById("debug").innerHTML = "";
  logDebug("🧹 Log cleared");
});

const audio = document.getElementById("karaoke-audio");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const playRecordingBtn = document.getElementById("play-recording-btn");
const lyricsBox = document.getElementById("lyrics");
const recordingPlayback = document.getElementById("recording-playback");
const songSelect = document.getElementById("song-select");

const tracks = {
  bouncyChill: {
    src: "https://cdn.pixabay.com/audio/2023/03/13/audio_c2437f768b.mp3",
    lyrics: [
      { time: 0, text: "🎤 Step to the mic, take your stance" },
      { time: 4, text: "🎤 Feel the beat, now start to dance" },
      { time: 8, text: "🎤 Words are flowin', lines are tight" },
      { time: 12, text: "🎤 You own the stage, you shine so bright" },
      { time: 16, text: "🎤 Take a breath, the crowd is wild" },
      { time: 20, text: "🎤 This karaoke’s got you styled" },
      { time: 24, text: "🎤 Final bar, let's end it strong" },
      { time: 28, text: "🎤 Thanks for vibin', sing along!" }
    ]
  }
};

let currentLine = 0;
let lyricInterval;
let mediaRecorder;
let recordedChunks = [];

function loadTrack(trackKey) {
  const track = tracks[trackKey];
  audio.src = track.src;
  lyricsBox.innerText = "Lyrics will appear here...";
  currentLine = 0;
  clearInterval(lyricInterval);
  logDebug("Loaded track: " + trackKey);
}

songSelect.addEventListener("change", () => {
  loadTrack(songSelect.value);
  startBtn.disabled = false;
  playRecordingBtn.disabled = true;
  recordingPlayback.style.display = "none";
});

startBtn.onclick = async () => {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  playRecordingBtn.disabled = true;

  recordedChunks = [];
  currentLine = 0;
  lyricsBox.innerText = "";

  audio.currentTime = 0;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
      logDebug("Captured audio chunk");
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      recordingPlayback.src = URL.createObjectURL(blob);
      recordingPlayback.style.display = "block";
      playRecordingBtn.disabled = false;
      logDebug("Recording stopped and ready");
    };

    mediaRecorder.start();
    logDebug("Recording started");

    audio.play();

    audio.onplay = () => {
      logDebug("🔊 Audio started playing"); // NEW debug line

      const trackLyrics = tracks[songSelect.value].lyrics;

      lyricInterval = setInterval(() => {
        const currentTime = Math.floor(audio.currentTime);
        if (currentLine < trackLyrics.length && currentTime >= trackLyrics[currentLine].time) {
          lyricsBox.innerText = trackLyrics[currentLine].text;
          logDebug("Lyric: " + trackLyrics[currentLine].text);
          currentLine++;
        }
      }, 300);
    };
  } catch (err) {
    logDebug("Microphone error: " + err.message);
    alert("Microphone access is required to record your singing!");
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
};

stopBtn.onclick = () => {
  audio.pause();
  audio.currentTime = 0;
  if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
  clearInterval(lyricInterval);

  lyricsBox.innerText = "✨ Done! You can now replay your voice.";
  stopBtn.disabled = true;
  startBtn.disabled = false;

  logDebug("Karaoke stopped");
};

playRecordingBtn.onclick = () => {
  recordingPlayback.play();
  logDebug("Playing user recording");
};

// Load default track
loadTrack(songSelect.value);
logDebug("✅ Debug system is active!");

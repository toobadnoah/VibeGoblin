const audio = document.getElementById("karaoke-audio");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const playRecordingBtn = document.getElementById("play-recording-btn");
const lyricsBox = document.getElementById("lyrics");
const recordingPlayback = document.getElementById("recording-playback");
const songSelect = document.getElementById("song-select");

const tracks = {
  track1: {
    src: "https://cdn.pixabay.com/audio/2022/03/02/audio_73dd5f6f64.mp3",
    lyrics: [
      { time: 0, text: "🎵 This is the first line" },
      { time: 3, text: "🎵 Second line, you sing now" },
      { time: 6, text: "🎵 Keep it going, feel the vibe" },
      { time: 9, text: "🎵 Last line, wrap it up!" }
    ]
  },
  track2: {
    src: "https://cdn.pixabay.com/audio/2022/03/08/audio_dcf59b57ba.mp3",
    lyrics: [
      { time: 0, text: "🎶 Let's go again" },
      { time: 3, text: "🎶 Feel the beat, pretend" },
      { time: 6, text: "🎶 Voices echo in the night" },
      { time: 9, text: "🎶 You shine so bright!" }
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
}

songSelect.addEventListener("change", () => {
  loadTrack(songSelect.value);
  lyricsBox.innerText = "Lyrics will appear here...";
  startBtn.disabled = false;
  playRecordingBtn.disabled = true;
  recordingPlayback.style.display = "none";
});

startBtn.onclick = async () => {
  const track = tracks[songSelect.value];
  currentLine = 0;
  lyricsBox.innerText = "";
  playRecordingBtn.disabled = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;

  // Start playing audio
  audio.currentTime = 0;
  audio.play();

  // Start recording
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  recordedChunks = [];

  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) recordedChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "audio/webm" });
    recordingPlayback.src = URL.createObjectURL(blob);
    recordingPlayback.style.display = "block";
    playRecordingBtn.disabled = false;
  };

  mediaRecorder.start();

  // Start synced lyrics
  lyricInterval = setInterval(() => {
    const currentTime = Math.floor(audio.currentTime);
    if (track.lyrics[currentLine] && currentTime >= track.lyrics[currentLine].time) {
      lyricsBox.innerText = track.lyrics[currentLine].text;
      currentLine++;
    }
  }, 500);
};

stopBtn.onclick = () => {
  audio.pause();
  audio.currentTime = 0;
  mediaRecorder.stop();
  clearInterval(lyricInterval);
  lyricsBox.innerText = "✨ Done! You can now replay your voice.";
  stopBtn.disabled = true;
  startBtn.disabled = false;
};

playRecordingBtn.onclick = () => {
  recordingPlayback.play();
};

// Load default track on page load
loadTrack(songSelect.value);

const audio = document.getElementById("karaoke-audio");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const playRecordingBtn = document.getElementById("play-recording-btn");
const lyricsBox = document.getElementById("lyrics");
const recordingPlayback = document.getElementById("recording-playback");

const lyrics = [
  { time: 0, text: "🎵 This is the first line" },
  { time: 3, text: "🎵 Second line, you sing now" },
  { time: 6, text: "🎵 Keep it going, feel the vibe" },
  { time: 9, text: "🎵 Last line, wrap it up!" }
];

let mediaRecorder;
let recordedChunks = [];
let lyricInterval;
let currentLine = 0;

startBtn.onclick = async () => {
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

  // Start lyrics sync
  lyricInterval = setInterval(() => {
    const currentTime = Math.floor(audio.currentTime);
    if (lyrics[currentLine] && currentTime >= lyrics[currentLine].time) {
      lyricsBox.innerText = lyrics[currentLine].text;
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

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

  audio.currentTime = 0;
  audio.play();

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

// Load default track
loadTrack(songSelect.value);

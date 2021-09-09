// const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// start audio context on first user interaction
const startAudioContext = async () => {
  if (audioContext.state !== "running") {
    await audioContext.resume();
    console.log(audioContext.state);
  }
};

window.addEventListener("mousedown", startAudioContext);
window.addEventListener("keydown", startAudioContext);
window.addEventListener("touchstart", startAudioContext);

const newSound = (path) => {
  let track;
  try {
    const audio = new Audio(path);
    track = audioContext.createMediaElementSource(audio);
  } catch (error) {
    console.log("Failed to load: " + path + "\n" + error);
  }

  return track;
};

const tracksDir = "@/assets/music";

export default class SoundController {
  tracks = {
    mainTheme: newSound(`${tracksDir}/main-theme.mp3`),
  };

  constructor() {
    console.log(this.tracks);
  }

  setMusicVolume(volume) {
    console.log(volume);
  }
}

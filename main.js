import './style.scss'

import { context, OUTPUT } from './components/Context.js'
import { drum_break } from './components/audio/break.js'
import { createSource } from './components/Source.js'
const tuna = new Tuna(context);
const startButton = document.getElementById('startButton');
let isPlaying = false;

const sourceGain = context.createGain();
sourceGain.gain.value = 0.8;
const dryGain = context.createGain();
dryGain.gain.value = 0.8;
const wetGain = context.createGain();
wetGain.gain.value = 0.8;
const wetGain2 = context.createGain();
wetGain2.gain.value = 0.8;
const outputGain = context.createGain();
outputGain.gain.value = 1;










sourceGain.connect(dryGain);
sourceGain.connect(wetGain);

wetGain.connect(OUTPUT);

function init() {
  const source = createSource(drum_break);
  source.audioSource.connect(sourceGain);
  source.audioSource.start();
  isPlaying = true;
  startButton.classList.add("disabled");

  const stopButton = document.getElementById('stopButton');
  stopButton.onclick = function() {
    source.audioSource.stop();
    isPlaying = false;
    startButton.classList.remove("disabled");
  };
}

if (isPlaying) {
  startButton.disabled = true;
} else {
  startButton.disabled = false;
}


startButton.addEventListener('click', () => {
  if (isPlaying) { return } else { init() };
});

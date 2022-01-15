import './style.scss'

import { context, OUTPUT } from './components/Context.js'
import {cold_sweat2} from './components/audio/cold_sweat2.js'
const tuna = new Tuna(context);

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

outputGain.connect(OUTPUT);

function init() {
  const source = createSource(humanVoice);
  source.connect(sourceGain);
  source.start();
  isPlaying = true;

  const stopButton = document.getElementById('stopButton');
  stopButton.onclick = function() {
    source.stop();
    isPlaying = false;
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

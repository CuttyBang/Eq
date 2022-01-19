import './style.scss'

import { context, OUTPUT } from './components/Context.js'
import { drum_break } from './components/audio/break.js'
import { preAmp } from './components/audio/preAmp.js'
import { createSource } from './components/Source.js'
import Highpass from './components/Highpass.js'
import Lowshelf from './components/Lowshelf.js'
import Highshelf from './components/Highshelf.js'
import Peaking from './components/Peaking.js'
import Dynamics from './components/Dynamics.js'
import Waveshaper from './components/Waveshaper.js'
import Convolver from './components/Convolver.js'
let isPlaying = false;

const startButton = document.getElementById('startButton');
const dbGain = document.getElementById('db_gain');
const lowCut = document.getElementById('low_cut');
const lowGain = document.getElementById('low_shelf');
const lowMidGain = document.getElementById('low_mid_gain');
const lowMidFreq = document.getElementById('low_mid_freq');
const highMidGain = document.getElementById('high_mid_gain');
const highMidFreq = document.getElementById('high_mid_freq');
const highGain = document.getElementById('high_shelf');

const highPass = Highpass();
const lowShelf = Lowshelf();
const highShelf = Highshelf();
const midLow = Peaking();
const midHigh = Peaking();
const dynamics = Dynamics();
const amp = Convolver(preAmp[4]);
const warmth = Waveshaper();

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


sourceGain.connect(wetGain);
wetGain.connect(amp.input);
amp.to(warmth);
warmth.to(highPass);
highPass.to(lowShelf);
lowShelf.to(midLow);
midLow.to(midHigh);
midHigh.to(highShelf);
highShelf.to(dynamics);
dynamics.to(outputGain);


outputGain.connect(OUTPUT);

function init() {
  const source = createSource(drum_break);
  source.audioSource.connect(sourceGain);
  source.audioSource.start();
  isPlaying = true;

  const stopButton = document.getElementById('stopButton');
  stopButton.onclick = function() {
    source.audioSource.stop();
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

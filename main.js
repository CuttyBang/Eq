import './style.scss'

import { context, OUTPUT } from './components/Context.js'
import { drum_break } from './components/audio/break.js'
import { preAmp } from './components/audio/preAmp.js'
import { createSource } from './components/Source.js'
import Boost from './components/Gain.js'
import Highpass from './components/Highpass.js'
import Lowshelf from './components/Lowshelf.js'
import Highshelf from './components/Highshelf.js'
import Peaking from './components/Peaking.js'
import Dynamics from './components/Dynamics.js'
import Waveshaper from './components/Waveshaper.js'
import Convolver from './components/Convolver.js'
let isPlaying = false;
let dbBoost = 5;
const startButton = document.getElementById('startButton');
const dbGain = document.getElementById('db_gain');
const lowCut = document.getElementById('low_cut');
const dBtn = document.getElementById('drive');
const lowShelfFreq = document.getElementById('low_shelf_freq');
const lowShelfGain = document.getElementById('low_shelf_gain');
const lowMidGain = document.getElementById('low_mid_gain');
const lowMidFreq = document.getElementById('low_mid_freq');
const highMidGain = document.getElementById('high_mid_gain');
const highMidFreq = document.getElementById('high_mid_freq');
const highGain = document.getElementById('high_shelf_gain');

const dbGainBoost = Boost(5);
const highPass = Highpass(0, 0);
const lowShelf = Lowshelf(500, 0);
const highShelf = Highshelf(6500, 0);
const midLow = Peaking(3500, 0, 0.5);
const midHigh = Peaking(1250, 0, 0.5);
const dynamics = Dynamics();
const amp = Convolver(preAmp[4]);
const warmth = Waveshaper(30);

const sourceGain = context.createGain();
sourceGain.gain.value = 0.8;
const dryGain = context.createGain();
dryGain.gain.value = 0.8;
const wetGain = context.createGain();
wetGain.gain.value = 0.8;
const outputGain = context.createGain();
outputGain.gain.value = 1;


sourceGain.connect(wetGain);
wetGain.connect(amp.input);
amp.to(dbGainBoost);
dbGainBoost.to(warmth);
warmth.to(highPass)
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

lowCut.addEventListener('input', ()=> {
  highPass.cutoff(lowCut.value);
})

lowShelfFreq.addEventListener('input', ()=> {
  lowShelf.cutoff(lowShelfFreq.value);
});

lowShelfGain.addEventListener('input', () => {
  let gVal = lowShelfGain.value -50;
  let trueVal = gVal/2.5;
  console.log(trueVal)
  lowShelf.gain(trueVal);
});

lowMidFreq.addEventListener('input', () => {
  midLow.cutoff(lowMidFreq.value);
});

lowMidGain.addEventListener('input', () => {
  let gVal = lowMidGain.value -50;
  let trueVal = gVal/2.5;
    console.log(trueVal)
  midLow.gain(trueVal);
});

highMidFreq.addEventListener('input', () => {
  midHigh.cutoff(highMidFreq.value);
});

highMidGain.addEventListener('input', () => {
  let gVal = highMidGain.value -50;
  let trueVal = gVal/2.5;
    console.log(trueVal)
  midHigh.gain(trueVal);
});

highGain.addEventListener('input', () => {
  let gVal = highGain.value -50;
  let trueVal = gVal/2.5;
    console.log(trueVal)
  highShelf.gain(trueVal);
});

dbGain.addEventListener('input', () => {
  let gainVal = dbGain.value/10;
  let boostVal = dbBoost + gainVal;
  console.log(boostVal);
  dbGainBoost.value(boostVal);
});

dBtn.addEventListener('input', () => {
  if(dBtn.value = 1){
    warmth.drive(0.8);
  }
  if(dBtn.value = 0){
    warmth.drive(0.1);
  }
})

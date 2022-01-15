import {context} from './Context.js'
import Waveshaper from './Waveshaper.js'

export default function PingPong() {
  const dlyL = context.createDelay();
  const dlyR = context.createDelay();
  const highPass = context.createBiquadFilter();
  const highShelf = context.createBiquadFilter();
  const warmth = Waveshaper(30);
  const busGain = context.createGain();
  const wetGain = context.createGain();
  const fb = context.createGain();
  const input = context.createGain();
  const output = context.createGain();
  const split= context.createChannelSplitter(2);
  const merge = context.createChannelMerger(2);

  let timeLeft = dlyL.delayTime;
  let timeRight = dlyR.delayTime;
  let feedback = fb.gain;

  input.gain.value = 1;
  output.gain.value = 1;
  fb.gain.value = 0.7;
  wetGain.gain.value = .9;

  highShelf.type = 'highshelf';
  highShelf.frequency.value = 5000;
  highShelf.gain.value = -15;
  highPass.type = 'highpass';
  highPass.frequency.value = 300;
  timeLeft.value = timeRight.value = 0.3;

  function setTime(time) {
    timeLeft.exponentialRampToValueAtTime(time, context.currentTime + 0.25);
    timeRight.exponentialRampToValueAtTime(time, context.currentTime + 0.25);
  }

  function leftTime(time) {
    timeLeft.exponentialRampToValueAtTime(time, context.currentTime + 0.1);
  }

  function rightTime(time) {
    timeRight.exponentialRampToValueAtTime(time, context.currentTime + 0.1);
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(highPass);
  highPass.connect(split);
  split.connect(wetGain, 0, 0);
  split.connect(wetGain, 1, 0);
  wetGain.connect(dlyL);
  fb.connect(wetGain);
  dlyL.connect(dlyR);
  dlyR.connect(warmth.input);
  warmth.to(highShelf)
  highShelf.connect(fb)
  dlyL.connect(merge, 0, 0);
  dlyR.connect(merge, 0, 1);
  merge.connect(busGain);
  busGain.connect(output);


  return {rightTime, leftTime, setTime, input, output, feedback, to};
}

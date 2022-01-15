import {context} from './Context.js'
import Waveshaper from './Waveshaper.js'

export default function Delay() {
  const delay = context.createDelay();
  const highPass = context.createBiquadFilter();
  const highShelf = context.createBiquadFilter();
  const warmth = Waveshaper(30);
  const fb = context.createGain();
  const input = context.createGain();
  const output = context.createGain();
  const time = delay.delayTime;
  let feedback = fb.gain;

  input.gain.value = 1;
  output.gain.value = 1;

  fb.gain.value = 0.5;
  time.value = 0.8;

  highShelf.type = 'highshelf';
  highShelf.frequency.value = 3000;
  highShelf.gain.value = -15;
  highPass.type = 'highpass';
  highPass.frequency.value = 300;

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(highPass);
  highPass.connect(delay);
  delay.connect(fb);
  fb.connect(warmth.input);
  warmth.to(highShelf);
  highShelf.connect(delay);
  delay.connect(output);



  return {time, input, output, feedback, to};
}

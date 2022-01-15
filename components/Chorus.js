import { context } from './Context.js'

export default function Chorus() {
  const splitter = context.createChannelSplitter(2);
  const merger = context.createChannelMerger(2);
  const input = context.createGain();
  const output = context.createGain();
  const depthL=  context.createGain();
  const depthR = context.createGain();
  const delayL = context.createDelay();
  const delayR = context.createDelay()
  const osc = context.createOscillator();

  input.gain.value = 0.8;
  output.gain.value = 1;

  delayL.delayTime.value = 0.015;
  delayR.delayTime.value = 0.02;
  depthL.gain.value = 0.002;
  depthR.gain.value = -0.002;
  osc.type = 'triangle';
  osc.frequency.value = 3.5;

  let speed = osc.frequency.value;
  let timeLeft = delayL.delayTime.value;
  let timeRight = delayR.delayTime.value;
  let depthLeft = depthL.gain;
  let depthRight = depthR.gain;

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(splitter);
  input.connect(output);
  splitter.connect(delayL, 0);
  splitter.connect(delayR, 1);
  osc.connect(depthL);
  osc.connect(depthR);
  depthL.connect(delayL.delayTime);
  depthR.connect(delayR.delayTime);
  delayL.connect(merger, 0, 0);
  delayR.connect(merger, 0, 1);
  merger.connect(output);
  osc.start();


  return {speed, timeLeft, timeRight, depthLeft, depthRight, input, output, to};
}

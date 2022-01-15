import { context } from './Context.js'

export default function Flanger() {
  const splitter = context.createChannelSplitter(2);
  const merger = context.createChannelMerger(2);
  const input = context.createGain();
  const output = context.createGain();
  const speed = context.createOscillator();
  const leftFeedback = context.createGain();
  const rightFeedback = context.createGain();
  const leftDepth = context.createGain();
  const rightDepth = context.createGain();
  const leftDelay = context.createDelay();
  const rightDelay = context.createDelay();

  leftFeedback.gain.value = rightFeedback.gain.value = 0.9;

  input.gain.value = 0.8;
  output.gain.value = 1;
  leftDelay.delayTime.value = 0.004;
  rightDelay.delayTime.value = 0.004;
  leftDepth.gain.value = 0.005;
  rightDepth.gain.value = -1.0 * 0.005;
  speed.type = "triangle";
  speed.frequency.value = 0.02;

  let rate = speed.frequency;

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(splitter);
  input.connect(output);

  splitter.connect(leftDelay, 0);
  splitter.connect(rightDelay, 1);
  leftDelay.connect(leftFeedback);
  rightDelay.connect(rightFeedback);
  leftFeedback.connect(leftDelay);
  rightFeedback.connect(rightDelay);
  speed.connect(leftDepth);
  speed.connect(rightDepth);
  leftDepth.connect(leftDelay.delayTime);
  rightDepth.connect(rightDelay.delayTime);
  leftDelay.connect( merger, 0, 0 );
  rightDelay.connect( merger, 0, 1 );
  merger.connect(output);

  speed.start(0);


  return { input, output, rate, leftFeedback, rightFeedback, leftDepth, rightDepth, leftDelay, rightDelay, to }
};

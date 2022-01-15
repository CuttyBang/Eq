import { context } from './Context.js'

export default function Dynamics() {

  let autoMakeup = (comp) => {
    let magicCoefficient = 3, // raise me if the output is too hot
        c = comp;
    return -(c.threshold.value - c.threshold.value / c.ratio.value) / magicCoefficient;
  }

  const dynamics = context.createDynamicsCompressor();
  const auto = autoMakeup(dynamics);
  const input = context.createGain();
  const output = context.createGain();
  const makeupGain = context.createGain();

  dynamics.threshold.value = -20;
  dynamics.knee.value = 20;
  dynamics.ratio.value = 4;
  dynamics.attack.value = 0.09;
  dynamics.release.value = 0.500;

  let attack = dynamics.attack;
  let knee = dynamics.knee;
  let ratio = dynamics.ratio;
  let release = dynamics.release;
  let threshold = dynamics.threshold;
  let makeup = makeupGain.gain;

  input.gain.value = 0.6;
  makeup.value = autoMakeup(dynamics);
  output.gain.value = 1;

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }


  input.connect(dynamics);
  dynamics.connect(makeupGain);
  makeupGain.connect(output);



  return {input, output, makeup, attack, knee, ratio, release, threshold, to};
};

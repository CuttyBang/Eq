import { context } from './Context.js'

export default function Peaking(freq, amt, quality) {
  const filter = context.createBiquadFilter();
  const input = context.createGain();
  const output = context.createGain();
  let fGain = filter.gain;
  let cutFreq = filter.frequency;
  let qVal = filter.Q;

  filter.type = 'peaking';

  if(freq){
    cutFreq.value = freq;
  } else {
    cutFreq.value = 5000;
  };

  if(quality){
    qVal.value = quality;
  } else {
    qVal.value = 0;
  };

  if(amt){
    fGain.value = amt;
  } else {
    fGain.value = 0;
  }

  function gain(lvl) {
    let g = filter.gain;
    g.exponentialRampToValueAtTime(lvl, 0.25);
    return g.value;
  }

  function resonance(lvl) {
    let res = filter.Q;
    res.exponentialRampToValueAtTime(lvl, 0.25);
    return res.value;
  }

  function cutoff(lvl) {
    let cutoff = filter.frequency;
    cutoff.exponentialRampToValueAtTime(lvl, 0.25);
    return cutoff.value;
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(filter);
  filter.connect(output);

  return  { filter, input, output, gain, resonance, cutoff, to };
}

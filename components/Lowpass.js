import { context } from './Context.js'

export default function Lowpass(freq, quality) {
  const filter = context.createBiquadFilter();
  const input = context.createGain();
  const output = context.createGain();
  let res = filter.Q;
  let cutFreq = filter.frequency;

  filter.type = 'lowpass';

  if(freq){
    cutFreq.value = freq;
  } else {
    cutFreq.value = 5000;
  };

  if(quality){
    res.value = quality;
  } else {
    res.value = 0;
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

  return  { filter, input, output, resonance, cutoff, to };
}

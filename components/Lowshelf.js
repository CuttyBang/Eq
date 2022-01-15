import { context } from './Context.js'

export default function Lowshelf(freq, amt) {
  const filter = context.createBiquadFilter();
  const input = context.createGain();
  const output = context.createGain();
  let fGain = filter.gain;
  let cutFreq = filter.frequency;;

  filter.type = 'lowshelf';

  if(freq){
    cutFreq.value = freq;
  } else {
    cutFreq.value = 5000;
  };

  if(amt){
    fGain.value = amt;
  } else {
    fGain.value = 0;
  }

  function resonance(lvl) {
    let res = filter.gain;
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

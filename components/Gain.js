import { context } from './Context.js'

export default function Gain(val) {
  const gain = context.createGain();
  const input = context.createGain();
  const output = context.createGain();

  input.gain.value = 1;
  output.gain.value = 1;
  gain.gain.value = amt(val);

  function amt(lev) {
    let levl = lev/10;
    return levl;
  }

  let value = (lev) => {
    gain.gain.value = amt(lev);
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(gain);
  gain.connect(output)

  return { input, output, value, to}
};

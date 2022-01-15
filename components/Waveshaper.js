import { context } from './Context.js'

function __curve() { // fixed curve, amount doesn't do anything, the distortion is just from the drive
  let n = 8192, i, x,
      ws = new Float32Array(n);
  for (i = 0; i < n; i++) {
      x = i * 2 / n - 1;
      if (x < -0.08905) {
          ws[i] = (-3 / 4) * (1 - (Math.pow((1 - (Math.abs(x) - 0.032857)), 12)) + (1 / 3) * (Math.abs(x) - 0.032847)) + 0.01;
      } else if (x >= -0.08905 && x < 0.320018) {
          ws[i] = (-6.153 * (x * x)) + 3.9375 * x;
      } else {
          ws[i] = 0.630035;
      }
  }
  return ws_table;
};

function curve(amount) {
  let k = typeof amount === 'number' ? amount : 50,
      n = 44100, curve = new Float32Array(n),
      deg = Math.PI / 180, i = 0, x;
  for ( ; i < n; ++i ) {
    x = i * 2 / n - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};

export default function Waveshaper(amt) {
  const saturation = context.createWaveShaper();
  const input = context.createGain();
  const driveGain = context.createGain();
  const output = context.createGain();
  const drive = driveGain.gain;

  saturation.curve = curve(amt);
  input.gain.value = 0.8;
  drive.value = 0.3;
  output.gain.value = 0.8;

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(driveGain);
  driveGain.connect(saturation);
  saturation.connect(output);

  return {input, drive, output, to}
};

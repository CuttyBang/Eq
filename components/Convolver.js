import { context } from './Context.js'


export default function Convolver(ir) {
  const convolver = context.createConvolver();
  const input = context.createGain();
  const output = context.createGain();
  const lowpass = context.createBiquadFilter();
  const highpass = context.createBiquadFilter();
  const getBuffer = base64 => {
  let binaryString = window.atob(base64),len = binaryString.length, bytes = new Uint8Array(len);
  for(let i = 0; i < len; i++){ bytes[i] = binaryString.charCodeAt(i) } return bytes.buffer };

  input.gain.value = 1;
  output.gain.value = 1;
  lowpass.type = 'lowpass';
  highpass.type = 'highpass';
  lowpass.frequency.value = 20000;
  highpass.frequency.value = 20;

  context.decodeAudioData(getBuffer(ir), decoded => {convolver.buffer = decoded},
  function(e) {
    alert("Error when decoding source audio data" + e.err);
  })

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(lowpass).connect(highpass).connect(convolver).connect(output);


  return { convolver, input, output, to };
}

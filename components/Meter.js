import { context } from './Context.js'

const createMeter = (control) => {
  const fftSize = 2048;
  const analyser = context.createAnalyser();
  analyser.fftSize = fftSize;
  const sampleBuffer = new Float32Array(analyser.fftSize);
  const input = context.createGain();
  const output = context.createGain();
  let peakPowerDb = null,
      peakInstantaneousPowerDecibels = null,
      avgPowerDecibels = null,
      peakInstantaneousPower = null,
      instantPower = null,
      averagePower = null;

  input.connect(analyser);

  function loop() {
    // Vary power of input to analyser. Linear in amplitude, so
    // nonlinear in dB power.
    input.gain.value = 0.9 * (1 + Math.sin(Date.now() / 4e2));

    analyser.getFloatTimeDomainData(sampleBuffer);

    // Compute average power over the interval.
    let sumOfSquares = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
      sumOfSquares += sampleBuffer[i] ** 2;
    }
    avgPowerDecibels = 10 * Math.log10(sumOfSquares / sampleBuffer.length);

    // Compute peak instantaneous power over the interval.
    peakInstantaneousPower = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
      const power = sampleBuffer[i] ** 2;
      peakInstantaneousPower = Math.max(power, peakInstantaneousPower);

    }

    peakInstantaneousPowerDecibels = 10 * Math.log10(peakInstantaneousPower);;


     if (peakInstantaneousPowerDecibels >= -10) {
       let abso = Math.abs(peakInstantaneousPowerDecibels);
       let norm = 10 - abso;
       let usable = norm / 10;
       peakPowerDb = usable.toFixed(2)
       control.offset.value = peakPowerDb;
       console.log((peakPowerDb * 1.25).toFixed(2));
     }

    // Display value.
    // displayNumber('avg', avgPowerDecibels);
    // displayNumber('inst', peakInstantaneousPowerDecibels);
    requestAnimationFrame(loop);

    return{peakPowerDb}
  }

  loop();

  return {input, output, analyser, peakPowerDb, loop}
}

export { createMeter }

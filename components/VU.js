/*
context.audioWorklet.addModule('./components/process/vumeter-processor.js').then(()=>{
  const vuMeterNode = new VUMeterNode(context, 25);
  function drawMeter () {
    meter.value = vuMeterNode.draw();
    requestAnimationFrame(drawMeter);
  }
  wetGain.connect(vuMeterNode);
  drawMeter();
})
*/



export default class VUMeterNode extends AudioWorkletNode {
  constructor (context, updateIntervalInMS) {
    super(context, 'vumeter', {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1,
      processorOptions: {
        updateIntervalInMS: updateIntervalInMS || 16.67
      }
    });
    // States in AudioWorkletNode
    this._updateIntervalInMS = updateIntervalInMS;
    this._volume = 0;
    // Handles updated values from AudioWorkletProcessor
    this.port.onmessage = event => {
      if (event.data.volume)
        this._volume = event.data.volume;
    }
    this.port.start();
  }
  get updateInterval() {
    return this._updateIntervalInMS;
  }
  set updateInterval(updateIntervalInMS) {
    this._updateIntervalInMS = updateIntervalInMS;
    this.port.postMessage({updateIntervalInMS: updateIntervalInMS});
  }
  draw () {
    return (this._volume + this._volume) / 1.25;
    // Draws the VU meter based on the volume value
    // every |this._updateIntervalInMS| milliseconds.
  }
};

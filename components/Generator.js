"use strict";

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
      } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
      } else {
        // Browser globals (root is window)
        root.reverbGen = factory();
      }
  }(this, function () {

    var reverbGen = {};

    /** Generates a reverb impulse response.

        @param {!Object} params TODO: Document the properties.
        @param {!function(!AudioBuffer)} callback Function to call when
          the impulse response has been generated. The impulse response
          is passed to this function as its parameter. May be called
          immediately within the current execution context, or later. */
    reverbGen.generateReverb = function(params, callback) {
      var audioContext = params.audioContext || new AudioContext();
      var sampleRate = params.sampleRate || 44100;
      var numChannels = params.numChannels || 2;
      // params.decayTime is the -60dB fade time. We let it go 50% longer to get to -90dB.
      var totalTime = params.decayTime * 1.5;
      var decaySampleFrames = Math.round(params.decayTime * sampleRate);
      var numSampleFrames = Math.round(totalTime * sampleRate);
      var fadeInSampleFrames = Math.round((params.fadeInTime || 0) * sampleRate);
      // 60dB is a factor of 1 million in power, or 1000 in amplitude.
      var decayBase = Math.pow(1 / 1000, 1 / decaySampleFrames);
      var reverbIR = audioContext.createBuffer(numChannels, numSampleFrames, sampleRate);
      for (var i = 0; i < numChannels; i++) {
        var chan = reverbIR.getChannelData(i);
        for (var j = 0; j < numSampleFrames; j++) {
          chan[j] = randomSample() * Math.pow(decayBase, j);
        }
        for (var j = 0; j < fadeInSampleFrames; j++) {
          chan[j] *= (j / fadeInSampleFrames);
        }
      }

      applyGradualLowpass(reverbIR, params.lpFreqStart || 0, params.lpFreqEnd || 0, params.decayTime, callback);
    };

    /** Applies a constantly changing lowpass filter to the given sound.

        @private
        @param {!AudioBuffer} input
        @param {number} lpFreqStart
        @param {number} lpFreqEnd
        @param {number} lpFreqEndAt
        @param {!function(!AudioBuffer)} callback May be called
        immediately within the current execution context, or later.*/
    var applyGradualLowpass = function(input, lpFreqStart, lpFreqEnd, lpFreqEndAt, callback) {
      if (lpFreqStart == 0) {
        callback(input);
        return;
      }
      var channelData = getAllChannelData(input);
      var context = new OfflineAudioContext(input.numberOfChannels, channelData[0].length, input.sampleRate);
      var player = context.createBufferSource();
      player.buffer = input;
      var filter = context.createBiquadFilter();

      lpFreqStart = Math.min(lpFreqStart, input.sampleRate / 2);
      lpFreqEnd = Math.min(lpFreqEnd, input.sampleRate / 2);

      filter.type = "lowpass";
      filter.Q.value = 0.0001;
      filter.frequency.setValueAtTime(lpFreqStart, 0);
      filter.frequency.linearRampToValueAtTime(lpFreqEnd, lpFreqEndAt);

      player.connect(filter);
      filter.connect(context.destination);
      player.start();
      context.oncomplete = function(event) {
        callback(event.renderedBuffer);
      };
      context.startRendering();

      window.filterNode = filter;
    };

    /** @private
        @param {!AudioBuffer} buffer
        @return {!Array.<!Float32Array>} An array containing the Float32Array of each channel's samples. */
    var getAllChannelData = function(buffer) {
      var channels = [];
      for (var i = 0; i < buffer.numberOfChannels; i++) {
        channels[i] = buffer.getChannelData(i);
      }
      return channels;
    };

    /** @private
        @return {number} A random number from -1 to 1. */
    var randomSample = function() {
      return Math.random() * 2 - 1;
    };

    return reverbGen;
  })
);


var reverbIR;
var masterGain;
var convolver;
var dryGain;
var wetGain;

function makeAudioContext() {
  if (audioContext) {
    return;
  }
  try {
    audioContext = new AudioContext();
  } catch (e) {
    alert("This browser doesn't support the Web Audio API standard. Try the latest version of Chrome or Firefox.");
    return;
  }

  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.5;
  convolver = audioContext.createConvolver();
  dryGain = audioContext.createGain();
  wetGain = audioContext.createGain();
  masterGain.connect(dryGain);
  masterGain.connect(convolver);
  convolver.connect(wetGain);
  dryGain.connect(audioContext.destination);
  wetGain.connect(audioContext.destination);
}

function doGenerateReverb() {
  let params = {
    fadeInTime: Number(document.getElementById('fadeInTime').value),
    decayTime: Number(document.getElementById('decayTime').value),
    sampleRate: Number(document.getElementById('sampleRate').value),
    lpFreqStart: Number(document.getElementById('lpFreqStart').value),
    lpFreqEnd: Number(document.getElementById('lpFreqEnd').value),
    numChannels: 2            // TODO: let user specify
  };

  reverbGen.generateReverb(params, function(result) {
    reverbIR = result;
    try {
      convolver.buffer = reverbIR;
    } catch(e) {
      alert("There was an error creating the convolver, probably because you chose " +
            "a sample rate that doesn't match your browser's playback (" + audioContext.sampleRate +
            "). Playing the demo sounds through your impulse response may not work, " +
            "but you should be able to play and/or save the impulse response. Error message: " + e);
      convolver.buffer = audioContext.createBuffer(params.numChannels, 1, audioContext.sampleRate);
    }
  });
}

function playReverb() {
  let node = audioContext.createBufferSource();
  node.buffer = reverbIR;
  node.connect(audioContext.destination);
  node.start();
}


function changeDemoMix() {
  let slider = document.getElementById('demoMix');
  let wetDbLevel = Number(slider.value);
  let wetLevel = wetDbLevel == Number(slider.min) ? 0 :
    Math.pow(10, wetDbLevel / 20);
  let dryLevel = Math.sqrt(1 - wetLevel * wetLevel);
  dryGain.gain.value = dryLevel;
  wetGain.gain.value = wetLevel;
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
const OUTPUT = context.destination;

export { context, OUTPUT }

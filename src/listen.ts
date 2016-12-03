interface ModernWindow extends Window {
	AudioContext: any;
	webkitAudioContext: any;
}

declare var window: ModernWindow;

export function listenAndOsc() {
	let audioCtx: AudioContext = new (window.AudioContext || window.webkitAudioContext)();
	let analyser = audioCtx.createAnalyser();
	let oscData = new Uint8Array(analyser.fftSize);
	const navigator: any = window.navigator;
	let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia);
	getUserMedia({ audio: true }, stream => {
		let source = audioCtx.createMediaStreamSource(stream);
		source.connect(analyser);
	}, error => console.error(error));
}

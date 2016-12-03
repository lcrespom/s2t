interface ModernWindow extends Window {
	AudioContext: any;
	webkitAudioContext: any;
}

declare var window: ModernWindow;


export function listenAndOsc(canvas: HTMLCanvasElement, cb: (MediaStream) => void) {
	let audioCtx: AudioContext = new (window.AudioContext || window.webkitAudioContext)();
	let analyser = audioCtx.createAnalyser();
	const navigator: any = window.navigator;
	navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia);
	navigator.getUserMedia({ audio: true }, stream => {
		let ctx2d = get2dCtx(canvas);
		let oscData = new Uint8Array(analyser.fftSize);
		let source = audioCtx.createMediaStreamSource(stream);
		source.connect(analyser);
		window.requestAnimationFrame(_ => updateCanvas(ctx2d, canvas, analyser, oscData));
		cb(stream);
	}, error => console.error(error));
}

export function stop(stream: MediaStream) {
	for (let mst of stream.getAudioTracks()) mst.stop();
}


function get2dCtx(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
	let gc = canvas.getContext('2d');
	if (!gc)
		throw Error('No CanvasRenderingContext2D found');
	return gc;
}

function updateCanvas(gc: CanvasRenderingContext2D, canvas: HTMLCanvasElement,
	analyser: AnalyserNode, data: Uint8Array) {
	drawOsc(gc, canvas, analyser, data, '#FFFF00');
	window.requestAnimationFrame(_ => updateCanvas(gc, canvas, analyser, data));
}

function drawOsc(gc: CanvasRenderingContext2D, canvas: HTMLCanvasElement,
	analyser: AnalyserNode, data: Uint8Array, color: string) {
	const [w, h] = setupDraw(gc, canvas, data, color);
	analyser.getByteTimeDomainData(data);
	gc.moveTo(0, h / 2);
	let x = 0;
	while (data[x] > 128 && x < data.length / 4) x++;
	while (data[x] < 128 && x < data.length / 4) x++;
	const dx = (data.length * 0.75) / canvas.width;
	for (let i = 0; i < w; i++) {
		let y = data[Math.floor(x)];
		x += dx;
		gc.lineTo(i, h * y / 256);
	}
	gc.stroke();
	gc.closePath();
}

function setupDraw(gc, canvas, data, color) {
	const w = canvas.width;
	const h = canvas.height;
	gc.clearRect(0, 0, w, h);
	gc.beginPath();
	gc.strokeStyle = color;
	return [w, h];
}

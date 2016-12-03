import * as listen from './listen';

declare let webkitSpeechRecognition;


function initS2T() {
	let recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;
	return recognition;
}

function traceEvent(txt, cb?) {
	return function (event) {
		console.log(txt + ':', event);
		if (cb) cb();
	};
}

function registerS2TListeners(s2t) {
	s2t.onresult = function (event) {
		console.log('Result:', event);
		let txt = '';
		for (let i = 0; i < event.results.length; i++)
			txt += event.results[i][0].transcript;
		let result = $('#result');
		result.text(txt);
	};
	s2t.onnomatch = traceEvent('No match');
	s2t.onerror = traceEvent('Error');

	s2t.onstart = traceEvent('Start');
	s2t.onend = traceEvent('End');

	s2t.onaudiostart = traceEvent('Audio start',
		_ => $('#b-listening').addClass('btn-info'));
	s2t.onaudioend = traceEvent('Audio end',
		_ => $('#b-listening').removeClass('btn-info'));

	s2t.onsoundstart = traceEvent('Sound start',
		_ => $('#b-sound').addClass('btn-info'));
	s2t.onsoundend = traceEvent('Sound end',
		_ => $('#b-sound').removeClass('btn-info'));

	s2t.onspeechstart = traceEvent('Speech start',
		_ => $('#b-speech').addClass('btn-info'));
	s2t.onspeechend = traceEvent('Speech end',
		_ => $('#b-speech').removeClass('btn-info'));
}

function registerButtonListeners(s2t) {
	$('#s2t').click(function () {
		console.log('Listen start');
		s2t.lang = $('#langSel').val();
		s2t.start();
	});

	$('#s2tstop').click(function () {
		s2t.stop();
	});
}

$(function () {
	let s2t = initS2T();
	registerS2TListeners(s2t);
	registerButtonListeners(s2t);
	listen.listenAndOsc($('#audio-osc')[0] as HTMLCanvasElement);
});

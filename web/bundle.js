(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function initS2T() {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    return recognition;
}
function traceEvent(txt, cb) {
    return function (event) {
        console.log(txt + ':', event);
        if (cb)
            cb();
    };
}
function registerS2TListeners(s2t) {
    s2t.onresult = function (event) {
        console.log('Result:', event);
        var txt = '';
        for (var i = 0; i < event.results.length; i++)
            txt += event.results[i][0].transcript;
        var result = $('#result');
        result.text(txt);
    };
    s2t.onnomatch = traceEvent('No match');
    s2t.onerror = traceEvent('Error');
    s2t.onstart = traceEvent('Start');
    s2t.onend = traceEvent('End');
    s2t.onaudiostart = traceEvent('Audio start', function (_) { return $('#b-listening').addClass('btn-info'); });
    s2t.onaudioend = traceEvent('Audio end', function (_) { return $('#b-listening').removeClass('btn-info'); });
    s2t.onsoundstart = traceEvent('Sound start', function (_) { return $('#b-sound').addClass('btn-info'); });
    s2t.onsoundend = traceEvent('Sound end', function (_) { return $('#b-sound').removeClass('btn-info'); });
    s2t.onspeechstart = traceEvent('Speech start', function (_) { return $('#b-speech').addClass('btn-info'); });
    s2t.onspeechend = traceEvent('Speech end', function (_) { return $('#b-speech').removeClass('btn-info'); });
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
    var s2t = initS2T();
    registerS2TListeners(s2t);
    registerButtonListeners(s2t);
});

},{}]},{},[1])
//# sourceMappingURL=bundle.js.map

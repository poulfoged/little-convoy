/// <reference path="typings/requirejs/require.d.ts" />
/// <reference path="typings/qunit/qunit.d.ts" />

import clientLib = require('LittleConvoy.Client'); 


var createChunkOfData = (iterations: number) => {
    var sourceData = [];

    for (var i = 0; i < iterations; i++) {
        sourceData.push({
            data1: Math.random().toString(36).substring(7)
        });
    }

    return sourceData;
};

var element = <HTMLButtonElement>document.getElementById('go1');
var progressbar = <HTMLProgressElement>document.getElementById('progress1');
element.onclick = () => {
    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any[]>({ url: 'http://localhost:49508/demo/sample', delay: 1000 })
        .progressed((progress: number) => {
            progressbar.style.width = progress.toString() + '%';
        })
        .then(() => setTimeout(() => progressbar.style.width = '0%', 4000))
        .catch(message => alert('unable to contact server:\n' + message));
};


var element2 = <HTMLButtonElement>document.getElementById('go2');
var progressbar2 = <HTMLProgressElement>document.getElementById('progress2');
element2.onclick = () => {
    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any[]>({ url: 'http://localhost:49508/demo/sample', delay: 0 })
        .progressed((progress: number) => {
            progressbar2.style.width = progress.toString() + '%';
        })
        .then(() => setTimeout(() => progressbar2.style.width = '0%', 4000))
        .catch(message => alert('unable to contact server:\n' + message));
};

var element3 = <HTMLButtonElement>document.getElementById('go3');
var progressbar3 = <HTMLProgressElement>document.getElementById('progress3');
element3.onclick = () => {
    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any[]>({ url: 'http://localhost:49508/demo/echo', delay: 0 }, createChunkOfData(1000) )
        .progressed((progress: number) => {
            progressbar3.style.width = progress.toString() + '%';
        })
        .then(() => setTimeout(() => progressbar3.style.width = '0%', 4000))
        .catch(message => alert('unable to contact server:\n' + message));
};


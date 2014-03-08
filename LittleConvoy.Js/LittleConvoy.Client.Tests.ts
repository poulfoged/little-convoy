/// <reference path="typings/requirejs/require.d.ts" />
/// <reference path="typings/qunit/qunit.d.ts" />

import clientLib = require('LittleConvoy.Client');

var createChunkOfData = (iterations:number) => {
    var sourceData = [];

    for (var i = 0; i < iterations; i++) {
        sourceData.push({
            data1: Math.random().toString(36).substring(7)
        });
    }

    return sourceData;
};

QUnit.module('LittleConvoy.Client internal tests');

asyncTest('Timeout will fire', () => {
    expect(1);

    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any[]>({ url: 'http://google.com', timeout: 1 })
        .catch(() => ok(true))
        .finally(() => start());
});

asyncTest('Invalid url will reject', () => {
    expect(1);

    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any[]>({ url: 'http://google.com', timeout: 10000 })
        .catch(() => ok(true))
        .finally(() => start());
});

asyncTest('Non url will reject', () => {
    expect(1);

    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any[]>({ url: 'not-a-url', timeout: 10000 })
        .catch(() => ok(true))
        .finally(() => start());
});

QUnit.module('LittleConvoy.Client external tests');

asyncTest('Will progress', () => {
    expect(11);

    var sourceData = createChunkOfData(10);

    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any[]>({ url: 'http://localhost:49559/echo', timeout: 20000 }, sourceData)
        .progressed(() => ok(true))
        .catch(error => console.log('client error: ' + error))
        .then(() => ok(true))
        .finally(() => start());
});


asyncTest('Can post large chunk of data', () => {
    expect(12);

    var sourceData = createChunkOfData(100000);

    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any[]>({ url: 'http://localhost:49559/echo', timeout: 20000 }, sourceData)
        .progressed(progress => {
            console.log('client progress: ' + progress);
            ok(true);
        })
        .then(data => {
            deepEqual(sourceData[0], data[0]);
            deepEqual(sourceData[sourceData.length - 1], data[sourceData.length - 1]);
        })
        .finally(() => start());
});

asyncTest('Can get chunk of data', () => {
    expect(12);

    var sourceData = createChunkOfData(10);

    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any[]>({ url: 'http://localhost:49559/echo', timeout: 20000, method: 'get' }, sourceData)
        .progressed(progress => {
            console.log('client progress: ' + progress);
            ok(true);
        })
        .then(data => {
            deepEqual(sourceData[0], data[0]);
            deepEqual(sourceData[sourceData.length - 1], data[sourceData.length - 1]);
        })
        .finally(() => start());
});

asyncTest('Empty get', () => {
    expect(2);

    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any>({ url: 'http://localhost:49559/echo', timeout: 20000, method: 'get' })
        .progressed(progress => {
            console.log('client progress: ' + progress);
            ok(true);
        })
        .then(data => ok(true))
        .finally(() => start());
});


asyncTest('Can timeout', () => {
    expect(1);

    new clientLib.LittleConvoy.Client('HiddenFrame')
        .send<any[]>({ url: 'http://localhost:49559/echo', timeout: 1000, delay: 2000 }, {})
        .catch(() => ok(true))
        .finally(() => start());
});
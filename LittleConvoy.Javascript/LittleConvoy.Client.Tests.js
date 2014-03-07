/// <reference path="typings/requirejs/require.d.ts" />
/// <reference path="typings/qunit/qunit.d.ts" />
define(["require", "exports", 'LittleConvoy.Client'], function(require, exports, clientLib) {
    var createChunkOfData = function (iterations) {
        var sourceData = [];

        for (var i = 0; i < iterations; i++) {
            sourceData.push({
                data1: Math.random().toString(36).substring(7)
            });
        }

        return sourceData;
    };

    QUnit.module('LittleConvoy.Client internal tests');

    asyncTest('Timeout will fire', function () {
        expect(1);

        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://google.com', timeout: 1 }).catch(function () {
            return ok(true);
        }).finally(function () {
            return start();
        });
    });

    asyncTest('Invalid url will reject', function () {
        expect(1);

        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://google.com', timeout: 10000 }).catch(function () {
            return ok(true);
        }).finally(function () {
            return start();
        });
    });

    asyncTest('Non url will reject', function () {
        expect(1);

        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'not-a-url', timeout: 10000 }).catch(function () {
            return ok(true);
        }).finally(function () {
            return start();
        });
    });

    QUnit.module('LittleConvoy.Client external tests');

    asyncTest('Will progress', function () {
        expect(11);

        var sourceData = createChunkOfData(10);

        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://localhost:49559/echo', timeout: 20000 }, sourceData).progressed(function () {
            return ok(true);
        }).catch(function (error) {
            return console.log('client error: ' + error);
        }).then(function () {
            return ok(true);
        }).finally(function () {
            return start();
        });
    });

    asyncTest('Can post large chunk of data', function () {
        expect(12);

        var sourceData = createChunkOfData(100000);

        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://localhost:49559/echo', timeout: 20000 }, sourceData).progressed(function (progress) {
            console.log('client progress: ' + progress);
            ok(true);
        }).then(function (data) {
            deepEqual(sourceData[0], data[0]);
            deepEqual(sourceData[sourceData.length - 1], data[sourceData.length - 1]);
        }).finally(function () {
            return start();
        });
    });

    asyncTest('Can get chunk of data', function () {
        expect(12);

        var sourceData = createChunkOfData(10);

        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://localhost:49559/echo', timeout: 20000, method: 'get' }, sourceData).progressed(function (progress) {
            console.log('client progress: ' + progress);
            ok(true);
        }).then(function (data) {
            deepEqual(sourceData[0], data[0]);
            deepEqual(sourceData[sourceData.length - 1], data[sourceData.length - 1]);
        }).finally(function () {
            return start();
        });
    });

    asyncTest('Empty get', function () {
        expect(2);

        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://localhost:49559/echo', timeout: 20000, method: 'get' }).progressed(function (progress) {
            console.log('client progress: ' + progress);
            ok(true);
        }).then(function (data) {
            return ok(true);
        }).finally(function () {
            return start();
        });
    });

    asyncTest('Can timeout', function () {
        expect(1);

        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://localhost:49559/echo', timeout: 1000, delay: 2000 }, {}).catch(function () {
            return ok(true);
        }).finally(function () {
            return start();
        });
    });
});
//# sourceMappingURL=LittleConvoy.Client.Tests.js.map

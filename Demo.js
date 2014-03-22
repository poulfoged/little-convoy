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

    var element = document.getElementById('go1');
    var progressbar = document.getElementById('progress1');
    element.onclick = function () {
        progressbar.style.width = '30%';
        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://littleconvoy.devchamp.com/demo/sample', delay: 1000 }).progressed(function (progress) {
            progressbar.style.width = progress.toString() + '%';
        }).then(function () {
            return setTimeout(function () {
                return progressbar.style.width = '0%';
            }, 4000);
        }).catch(function (message) {
            return alert('unable to contact server:\n' + message);
        });
    };

    var element2 = document.getElementById('go2');
    var progressbar2 = document.getElementById('progress2');
    element2.onclick = function () {
        progressbar2.style.width = '30%';
        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://littleconvoy.devchamp.com/demo/sample', delay: 0 }).progressed(function (progress) {
            progressbar2.style.width = progress.toString() + '%';
        }).then(function () {
            return setTimeout(function () {
                return progressbar2.style.width = '0%';
            }, 4000);
        }).catch(function (message) {
            return alert('unable to contact server:\n' + message);
        });
    };

    var element3 = document.getElementById('go3');
    var progressbar3 = document.getElementById('progress3');
    element3.onclick = function () {
        progressbar3.style.width = '30%';
        new clientLib.LittleConvoy.Client('HiddenFrame').send({ url: 'http://littleconvoy.devchamp.com/demo/echo', delay: 0 }, createChunkOfData(1000)).progressed(function (progress) {
            progressbar3.style.width = progress.toString() + '%';
        }).then(function () {
            return setTimeout(function () {
                return progressbar3.style.width = '0%';
            }, 4000);
        }).catch(function (message) {
            return alert('unable to contact server:\n' + message);
        });
    };
});

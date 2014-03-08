define(["require", "exports", 'lib/Promise'], function(require, exports, Promise) {
    (function (LittleConvoy) {
        var Client = (function () {
            function Client(transportName) {
                this.transportName = transportName;
            }
            Client.prototype.send = function (options, data) {
                var _this = this;
                options.method = options.method ? options.method : 'post';
                options.timeout = options.timeout ? options.timeout : 20000;

                return new Promise.Ten.Promise(function (resolve, reject, progress) {
                    require(["LittleConvoy.Transports." + _this.transportName], function (transportLib) {
                        var transport = new transportLib.LittleConvoy.Transports[_this.transportName + 'Transport']();
                        resolve(transport.send(options, data));
                    });
                });
            };
            return Client;
        })();
        LittleConvoy.Client = Client;
    })(exports.LittleConvoy || (exports.LittleConvoy = {}));
    var LittleConvoy = exports.LittleConvoy;
});

define(["require", "exports", 'lib/Promise'], function(require, exports, Promise) {
    (function (LittleConvoy) {
        (function (Transports) {
            var Status = (function () {
                function Status() {
                    this.progress = 0;
                    this.buffer = [];
                }
                return Status;
            })();

            var HiddenFrameTransport = (function () {
                function HiddenFrameTransport() {
                }
                HiddenFrameTransport.prototype.send = function (options, data) {
                    var _this = this;
                    var status = new Status();
                    var messageHandler;
                    var frame;
                    var form;
                    var timer;

                    var promise = new Promise.Ten.Promise(function (resolve, reject, progress) {
                        if (!JSON)
                            throw new Error('This transport requires JSON to be available, maybe add a polyfill?');

                        var rejecter = function (message) {
                            return reject(new Error(message));
                        };

                        // create a uniue callid to identify this call and prevent caching
                        var callId = _this.createId();

                        // create iframe for send/recieve calls
                        frame = _this.createFrame(callId);

                        // bind handlers if iframe load ends prematurely
                        _this.bindRejectionHandler(status, frame, rejecter);

                        // start timeout timer
                        timer = _this.resetTimeout(timer, options, rejecter);

                        // setup hidden form and post via iframe
                        form = _this.createHiddenForm(callId, options, data);
                        form.submit();

                        messageHandler = function (event) {
                            // check that callback belongs to this call
                            if (callId != event.data.callId)
                                return;

                            // clear timeout timer
                            timer = _this.resetTimeout(timer, options, function (message) {
                                return reject(new Error(message));
                            });

                            // update status object
                            status.buffer.push(event.data.chunk);
                            status.progress = event.data.progress;

                            // fire progress on promise
                            progress(event.data.progress);

                            // check if we are done
                            if (event.data.progress >= 100) {
                                if (status.buffer.length == 1 && status.buffer[0] == '')
                                    resolve();
                                else
                                    resolve(JSON.parse(status.buffer.join('')));
                            }
                        };

                        // add listner, to listen for postmessages from the iframe
                        window.addEventListener("message", messageHandler, false);
                    });

                    promise.finally(function () {
                        // prevent timeout from firing
                        if (timer) {
                            console.log('removing timer');
                            window.clearTimeout(timer);
                        }

                        // remove event message passing event listener
                        if (messageHandler) {
                            console.log('removing eventlistener');
                            window.removeEventListener("message", messageHandler);
                        }

                        // remove iframe
                        if (frame) {
                            console.log('removing frame');
                            frame.parentElement.removeChild(frame);
                        }

                        // remove form from body
                        if (form) {
                            console.log('removing form');
                            form.parentElement.removeChild(form);
                        }
                    });

                    return promise;
                };

                HiddenFrameTransport.prototype.resetTimeout = function (timer, options, rejecter) {
                    if (timer)
                        window.clearTimeout(timer);

                    return window.setTimeout(function () {
                        return rejecter('Timeout');
                    }, options.timeout);
                };

                HiddenFrameTransport.prototype.createHiddenForm = function (callId, options, data) {
                    var form = document.createElement('form');
                    form.setAttribute('method', options.method);
                    form.setAttribute('action', options.url);
                    form.setAttribute('target', 'littleConvoy_' + callId);
                    this.addHiddenField(form, '_callId', callId.toString());

                    if (options.delay)
                        this.addHiddenField(form, '_delay', options.delay.toString());

                    if (data)
                        this.addHiddenField(form, '_json', JSON.stringify(data));

                    document.getElementsByTagName('body')[0].appendChild(form);
                    return form;
                };

                HiddenFrameTransport.prototype.addHiddenField = function (form, name, value) {
                    var field = document.createElement("input");
                    field.type = "hidden";
                    field.name = name;
                    field.value = value;
                    form.appendChild(field);
                };

                HiddenFrameTransport.prototype.createId = function () {
                    return new Date().getUTCMilliseconds();
                };

                HiddenFrameTransport.prototype.bindRejectionHandler = function (status, frame, rejecter) {
                    var handler = function () {
                        if (!status.progress || status.progress <= 0)
                            rejecter('Unable to load, invalid url?');
                        else if (status.progress < 100)
                            rejecter('Only loaded partially');
                    };

                    if (frame.onload) {
                        frame.onload = handler;
                    } else if (frame.addEventListener) {
                        frame.addEventListener("load", handler, false);
                    } else if (frame.attachEvent) {
                        frame.attachEvent("onload", handler);
                    }
                };

                HiddenFrameTransport.prototype.createFrame = function (callId) {
                    var frame = window.document.createElement("iframe");
                    frame.setAttribute("style", "position:absolute;top:0;left:0;width:0;height:0;visibility:hidden;");
                    frame.setAttribute("name", "littleConvoy_" + callId);
                    window.document.body.appendChild(frame);
                    return frame;
                };
                return HiddenFrameTransport;
            })();
            Transports.HiddenFrameTransport = HiddenFrameTransport;
        })(LittleConvoy.Transports || (LittleConvoy.Transports = {}));
        var Transports = LittleConvoy.Transports;
    })(exports.LittleConvoy || (exports.LittleConvoy = {}));
    var LittleConvoy = exports.LittleConvoy;
});
//# sourceMappingURL=LittleConvoy.Transports.HiddenFrame.js.map

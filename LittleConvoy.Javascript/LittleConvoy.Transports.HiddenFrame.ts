
import Promise = require('lib/Promise');

export module LittleConvoy.Transports {
    interface FrameMessage {
        callId: number;
        chunk: string;
        progress: number;
    }

    interface FrameMessageEvent extends Event {
        data: FrameMessage;
    }

    class Status {
        progress: number = 0;
        buffer = [];
    }

    export class HiddenFrameTransport implements Transport {

        public send<T>(options: Options, data?: any): IPromise<T> {
            var status = new Status();
            var messageHandler: (evt: FrameMessageEvent) => void;
            var frame: HTMLIFrameElement;
            var form: HTMLFormElement;
            var timer: number;

            var promise = new Promise.Ten.Promise<T>((resolve, reject, progress) => {
                if (!JSON)
                    throw new Error('This transport requires JSON to be available, maybe add a polyfill?');

                var rejecter = (message: string) => reject(new Error(message));
                
                // create a uniue callid to identify this call and prevent caching
                var callId = this.createId();

                // create iframe for send/recieve calls
                frame = this.createFrame(callId);

                // bind handlers if iframe load ends prematurely
                this.bindRejectionHandler(status, frame, rejecter);

                // start timeout timer
                timer = this.resetTimeout(timer, options, rejecter);

                // setup hidden form and post via iframe
                form = this.createHiddenForm(callId, options, data);
                form.submit();

                messageHandler = event => {
                    // check that callback belongs to this call
                    if (callId != event.data.callId)
                        return;

                    // clear timeout timer
                    timer = this.resetTimeout(timer, options, message => reject(new Error(message)));

                    // update status object
                    status.buffer.push(event.data.chunk);
                    status.progress = event.data.progress;

                    // fire progress on promise
                    progress(event.data.progress);

                    // check if we are done
                    if (event.data.progress >= 100) {
                        if (status.buffer.length == 1 && status.buffer[0] == '') // empty response, still ok
                            resolve();
                        else
                            resolve(JSON.parse(status.buffer.join('')));
                    }
                };

                // add listner, to listen for postmessages from the iframe
                window.addEventListener("message", messageHandler, false);
            });

            promise.finally(() => {
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
        }

        private resetTimeout(timer: number, options: Options, rejecter: (reason: string) => void) {
            if (timer)
                window.clearTimeout(timer);

            return window.setTimeout(() => rejecter('Timeout'), options.timeout);
        }

        private createHiddenForm(callId: number, options: Options, data?: any): HTMLFormElement {
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
        }

        private addHiddenField(form: HTMLFormElement, name: string, value: string): void {
            var field = document.createElement("input");
            field.type = "hidden";
            field.name = name;
            field.value = value;
            form.appendChild(field);
        }

        private createId() {
            return new Date().getUTCMilliseconds();
        }

        private bindRejectionHandler(status: Status, frame: HTMLIFrameElement, rejecter: (reason: string) => void) {
            var handler = () => {
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
        }

        private createFrame(callId: number): HTMLIFrameElement {
            var frame = window.document.createElement("iframe");
            frame.setAttribute("style", "position:absolute;top:0;left:0;width:0;height:0;visibility:hidden;");
            frame.setAttribute("name", "littleConvoy_" + callId);
            window.document.body.appendChild(frame);
            return frame;
        }
    }
}
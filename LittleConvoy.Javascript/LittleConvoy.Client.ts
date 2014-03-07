
import Promise = require('lib/Promise');

export module LittleConvoy {
    export class Client {
        constructor(private transportName: string) { }

        public send<T>(options: Options, data?: any): IPromise<T> {
            options.method = options.method ? options.method : 'post';
            options.timeout = options.timeout ? options.timeout : 20000;
            
            return new Promise.Ten.Promise((resolve, reject, progress) => {
                require(["LittleConvoy.Transports." + this.transportName], (transportLib: any) => {
                    var transport: Transport = new transportLib.LittleConvoy.Transports[this.transportName + 'Transport']();
                    resolve(transport.send(options, data));
                });
            });
        }
    }
}       
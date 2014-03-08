

interface Transport {
    send<T>(options: Options, data?: any): IPromise<T>;
}

interface Options {
    url: string;
    timeout?: number;
    delay?: number;
    method?: string;
}

interface IClient {
    send<T>(options: Options, data?: any): IPromise<T>;
}


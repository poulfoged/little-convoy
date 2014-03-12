interface IPromise<T> {
    then(success?: (data: T) => any, error?: (data: T) => any, progress?: (data: T) => any): IPromise<T>;
    progressed(progressCallback: (data: any) => any): IPromise<T>;
    catch(errorCallback: (data: T) => any): IPromise<T>;
    finally(alwaysCallback: (data: T) => any): IPromise<T>;
}

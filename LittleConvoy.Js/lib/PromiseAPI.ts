//interface IPromise {
//    then(s?, e?, p?): IPromise;
//    progressed(p): IPromise;
//    catch(e): IPromise;
//} 

interface IPromise<T> {
    then(success?: (data: T) => any, error?: (data: T) => any, progress?: (data: T) => any): IPromise<T>;
    progressed(progressCallback: (data: T) => any): IPromise<T>;
    catch(errorCallback: (data: T) => any): IPromise<T>;
    finally(alwaysCallback: (data: T) => any): IPromise<T>;
} 
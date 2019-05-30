import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

declare module 'rxjs/internal/Observable' {
    interface Observable<T> {
        debug: (...any: any[]) => Observable<T>;
    }
}
Observable.prototype.debug = function (message: string) {
    return this.do(
        (next) => {
            if (!environment.production) {
                console.log(message, next);
            }
        },
        (error) => {
            if (!environment.production) {
                console.error('ERROR>>', message, error);
            }
        },
        () => {
            if (!environment.production) {
                console.log('conpleted');
            }
        }
    );
};

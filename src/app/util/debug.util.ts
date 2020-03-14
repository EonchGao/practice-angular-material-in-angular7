import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { tap } from 'rxjs/operators';

declare module 'rxjs/internal/Observable' {
    interface Observable<T> {
        debug: (...param: any[]) => Observable<T>;
    }
}

Observable.prototype.debug = function (message: string) {
    return this.pipe(tap(
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
                console.log('completed');
            }
        }
    ));
};

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Quote } from '../domain/quote.model';

@Injectable()
export class QuoteService {
    constructor(
        @Inject('BASE_CONFIG') private config,
        private http: HttpClient
    ) { }
    getQuote(): Observable<Quote> {
        const uri = `${this.config.uri}/quotes/${Math.floor(Math.random() * 10)}`;
        return this.http.get(uri).debug('quote').pipe(map(res => res as Quote));
    }
}
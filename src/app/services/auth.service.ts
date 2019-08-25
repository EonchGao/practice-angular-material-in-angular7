import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from '../domain';
import { Auth } from '../domain/auth.model';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private readonly domain = 'users';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  private token = `qwerasff`;
  constructor(
    @Inject('BASE_CONFIG') private config,
    private http: HttpClient,
  ) { }

  register(user: User): Observable<Auth> {
    user.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.
      get(uri, { params: { email: user.email } }).pipe(
        switchMap((res: any[]) => {
          if (res.length > 0) {
            throw '用户已存在';
          }
          return this.http
            .post(uri, JSON.stringify(user), { headers: this.headers })
            .pipe(map(r => ({ token: this.token, user: r } as Auth)));
        })
      );
  }
  // put
  login(username: string, password: string): Observable<Auth> {
    const uri = `${this.config.uri}/${this.domain}`;

    return this.http
      .get(uri, { params: { email: username, password: password } })
      .pipe(map((res: any[]) => {
        if (res.length === 0) {
          throw '用户名或密码不匹配';
        }
        return { token: this.token, user: res[0] };
      }));
  }
}

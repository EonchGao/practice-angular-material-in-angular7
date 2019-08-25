import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskList } from '../domain';
import { map, mergeMap, count, switchMap, mapTo, reduce } from 'rxjs/operators';
import { Observable, from, concat } from 'rxjs';

@Injectable()
export class TaskListService {
  private readonly domain = 'taskLists';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(
    @Inject('BASE_CONFIG') private config,
    private http: HttpClient,
  ) { }
  // post
  add(taskList: TaskList): Observable<TaskList> {
    taskList.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .post(uri, JSON.stringify(taskList), { headers: this.headers })
      .pipe(map(res => res as TaskList));
  }
  // put
  update(taskList: TaskList): Observable<TaskList> {
    const uri = `${this.config.uri}/${this.domain}/${taskList.id}`;
    const toUpdate = {
      name: taskList.name
    };
    return this.http
      .patch(uri, JSON.stringify(toUpdate), { headers: this.headers })
      .pipe(map(res => res as TaskList));
  }
  // delete
  del(taskList: TaskList): Observable<TaskList> {
    const uri = `${this.config.uri}/taskLists/${taskList.id}`;
    return this.http.delete(uri).pipe(mapTo(taskList));
  }
  // get
  get(projectId: string): Observable<TaskList[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get(uri, { params: { 'projectId': projectId } })
      .pipe(map(res => res as TaskList[]));
  }
  swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
    const dragUri = `${this.config.uri}/${this.domain}/${src.id}`;
    const dropUri = `${this.config.uri}/${this.domain}/${target.id}`;

    const drag$ = this.http
      .patch(dragUri, JSON.stringify({ order: target.order }), { headers: this.headers })
      .pipe(map(res => res));
    const drop$ = this.http
      .patch(dropUri, JSON.stringify({ order: src.order }), { headers: this.headers })
      .pipe(map(res => res));

    return concat(drag$, drop$)
      .pipe(reduce((arrs, list) => [...arrs, list], []));
  }
}

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task, TaskList } from '../domain';
import { map, mergeMap, count, switchMap, mapTo, reduce } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Injectable()
export class TaskService {
  private readonly domain = 'tasks';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(
    @Inject('BASE_CONFIG') private config,
    private http: HttpClient,
  ) { }
  // post
  add(task: Task): Observable<Task> {
    task.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .post(uri, JSON.stringify(task), { headers: this.headers })
      .pipe(map(res => res as Task));
  }
  // put
  update(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    const toUpdate = {
      priority: task.priority,
      desc: task.desc,
      dueDate: task.dueDate,
      reminder: task.reminder,
      ownerId: task.ownerId,
      participantIds: task.participantIds,
      remark: task.remark
    };
    return this.http
      .patch(uri, JSON.stringify(toUpdate), { headers: this.headers })
      .pipe(map(res => res as Task));
  }
  // delete
  del(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/taskLists/${task.id}`;
    return this.http.delete(uri).pipe(
      mapTo(task)
    );
  }
  // get
  get(taskListId: string): Observable<Task[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get(uri, { params: { 'taskListId': taskListId } })
      .pipe(map(res => res as Task[]));
  }
  getByLists(lists: TaskList[]): Observable<Task[]> {
    return from(lists).pipe(
      mergeMap(list => this.get(list.id)),
      reduce((tasks: Task[], t: Task[]) => [...tasks, ...t], [])
    );
  }

  complete(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;

    return this.http
      .patch(uri, JSON.stringify({ complete: !task.completed }), { headers: this.headers })
      .pipe(map(res => res as Task));
  }

  move(taskId: string, taskListId: string): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${taskId}`;

    return this.http
      .patch(uri, JSON.stringify({ taskListId: taskListId }), { headers: this.headers })
      .pipe(map(res => res as Task));
  }
  moveAll(srcListId: string, targetListId: string): Observable<Task[]> {

    return this.get(srcListId).pipe(mergeMap(tasks => from(tasks)), mergeMap(task => this.move(task.id, targetListId)),
      reduce((arr: any, x: any) => [...arr, x], []));
  }
}

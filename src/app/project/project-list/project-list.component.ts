import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from 'src/app/animation/router.anim';
import { listAnimation } from 'src/app/animation/list.anim';
import { ProjectService } from 'src/app/services/project.service';

import * as _ from 'lodash';
import { filter, switchMap, map, take } from 'rxjs/operators';
import { Project } from 'src/app/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight,
    listAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {
  @HostBinding('@routerAnim') state;

  projects;
  sub: Subscription;
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private service$: ProjectService,
  ) { }

  ngOnInit() {
    this.sub = this.service$.get('1').subscribe(projects => {
      console.log('projects', projects);
      this.projects = projects;
      this.cd.markForCheck();

    });
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }

  }
  openNewProjectDialog() {
    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(NewProjectComponent,
      { data: { thumbnails: this.getThumbnails(), img: selectedImg } });
    // dialogRef.afterClosed().pipe(filter(n => n)).subscribe(project => {
    //   this.service$.add(project);

    //   this.cd.markForCheck();
    // });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({ ...val, coverImg: this.buildImgSrc(val.coverImg) })),
      switchMap(v => this.service$.add(v)))
      .subscribe(project => {
        this.projects = [...this.projects, project];
        this.cd.markForCheck();
      });
  }
  launchInviateDialog() {
    const dialogRef = this.dialog.open(InviteComponent, { data: { members: [] } });
    dialogRef.afterClosed().subscribe(result => console.log('result::', result));
  }
  launchUpdateDialog(project: Project) {
    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(NewProjectComponent,
      { data: { thumbnails: this.getThumbnails(), project: project } });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({ ...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg) })),
      switchMap(v => this.service$.update(v)))
      .subscribe(project => {
        const index = this.projects.map(p => p.id).indexOf(project.id);
        this.projects = [...this.projects.slice(0, index), project, ...this.projects.slice(index + 1)];
        this.cd.markForCheck();
      });
  }
  launchConfirmDialog(project: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除项目', content: '确认删除该项目吗？' } });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      switchMap(_ => this.service$.del(project))
    ).subscribe(prj => {

      this.projects = this.projects.filter(p => p.id !== prj.id);
      this.cd.markForCheck();

    });
  }
  private getThumbnails() {
    return _.range(0, 40)
      .map(i => `/assets/img/covers/${i}_tn.jpg`);
  }
  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }
}

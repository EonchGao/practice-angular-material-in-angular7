import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from 'src/app/animation/router.anim';
import { listAnimation } from 'src/app/animation/list.anim';
import { ProjectService } from 'src/app/services/project.service';

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
export class ProjectListComponent implements OnInit {
  @HostBinding('@routerAnim') state;
  // projects = [
  //   {
  //     id: 1,
  //     name: '企业协作平台',
  //     desc: '这是一个企业内部项目',
  //     coverImg: 'assets/img/covers/0.jpg'
  //   },
  //   {
  //     id: 2,
  //     name: '自动化测试项目',
  //     desc: '这是一个企业内部项目',
  //     coverImg: 'assets/img/covers/1.jpg'
  //   }
  // ];
  projects;
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private service$: ProjectService,
  ) { }

  ngOnInit() {
    this.service$.get('1').subscribe(projects => {
      console.log('projects', projects);
      this.projects = projects;
    });
  }
  openNewProjectDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { title: '新增项目' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result::', result);
      this.projects = [...this.projects,
      { id: 3, name: '一个新项目', desc: '这是一个新项目', coverImg: 'assets/img/covers/1.jpg' },
      { id: 4, name: '又一个新项目', desc: '这是又一个新项目', coverImg: 'assets/img/covers/2.jpg' },
      ];
      this.cd.markForCheck();
    });
  }
  launchInviateDialog() {
    const dialogRef = this.dialog.open(InviteComponent);
    dialogRef.afterClosed().subscribe(result => console.log('result::', result));
  }
  launchUpdateDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { title: '编辑项目' } });
  }
  launchConfirmDialog(project: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除项目', content: '确认删除该项目吗？' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result::', result);
      this.projects = this.projects.filter(p => p.id !== project.id);
      this.cd.markForCheck();

    });
  }
}

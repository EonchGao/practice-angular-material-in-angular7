import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {
  @Input() item: any;

  @Output() Inivate = new EventEmitter<void>();
  @Output() Edit = new EventEmitter<void>();
  @Output() Del = new EventEmitter<void>();



  constructor() { }

  ngOnInit() {
  }
  onInviateClick() {
    this.Inivate.emit();
  }
  onEditClick() {
    this.Edit.emit();
  }
  onDelClick() {
    this.Del.emit();
  }
}

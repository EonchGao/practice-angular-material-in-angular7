import { Component, OnInit, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy, } from '@angular/core';
import { itemAnim } from 'src/app/animation/item.anim';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  animations: [
    itemAnim
  ],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TaskItemComponent implements OnInit {
  @Input() item: any;
  @Input() avatar: any;
  @Output() taskClick = new EventEmitter<void>();
  widerPriority = 'in';
  @HostListener('mouseenter')
  onMouseEnter() {
    this.widerPriority = 'out';
  }
  @HostListener('mouseleave')
  onMouseleave() {
    this.widerPriority = 'in';
  }
  constructor() { }

  ngOnInit() {
    this.avatar = this.item.owner ? this.item.owner.avatar : 'unassigned';
  }
  onItemClick() {
    this.taskClick.emit();
  }
  onCheckBoxClick(event: Event) {
    event.stopPropagation();
  }
}

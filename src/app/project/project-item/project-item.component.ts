import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { cardAnim } from 'src/app/animation/card.anim';
import { listAnimation } from 'src/app/animation/list.anim';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  animations: [
    cardAnim,
    listAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ProjectItemComponent implements OnInit {
  @Input() item: any;

  @Output() Inivate = new EventEmitter<void>();
  @Output() Edit = new EventEmitter<void>();
  @Output() Del = new EventEmitter<void>();

  @HostBinding('@card') cardState = 'out';
  @HostBinding('@listAnim') listAnim;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.cardState = 'hover';
  }
  @HostListener('mouseleave')
  onMouseleave() {
    this.cardState = 'out';
  }

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

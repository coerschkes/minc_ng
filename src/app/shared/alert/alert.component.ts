import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input() message: string = '';
  @Input() alertType: string = 'danger';

  onClose(): void {
    this.close.emit();
  }
}

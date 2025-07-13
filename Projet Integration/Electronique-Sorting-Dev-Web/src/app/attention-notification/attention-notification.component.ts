import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-attention-notification',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './attention-notification.component.html',
  styleUrl: './attention-notification.component.scss'
})
export class AttentionNotificationComponent {

  @Input() notifications: { type: string | null; quantity: number; description: string | null }[] = [];

}

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService, ErrorMessage } from '../../utils/error-handler.service';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.scss'
})
export class ErrorDisplayComponent {
  errorHandler = inject(ErrorHandlerService);
}
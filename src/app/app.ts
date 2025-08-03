import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorDisplayComponent } from './components/error-display/error-display.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorDisplayComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Gerenciador de Viagens');
}

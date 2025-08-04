import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorDisplayComponent } from './components/error-display/error-display.component';
import { InstallPromptComponent } from './components/install-prompt/install-prompt.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorDisplayComponent, InstallPromptComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Gerenciador de Viagens');
}

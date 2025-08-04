import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="install-prompt" *ngIf="showInstallPrompt()">
      <div class="install-content">
        <div class="install-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <div class="install-text">
          <h4>Instalar Plano de Viagem</h4>
          <p>Adicione este app à sua tela inicial para acesso rápido</p>
        </div>
        <div class="install-actions">
          <button class="btn-install" (click)="installApp()">Instalar</button>
          <button class="btn-dismiss" (click)="dismissPrompt()">Agora não</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .install-prompt {
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .install-content {
      display: flex;
      align-items: center;
      padding: 16px;
      gap: 12px;
    }

    .install-icon {
      color: #2196F3;
      flex-shrink: 0;
    }

    .install-text {
      flex: 1;
    }

    .install-text h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .install-text p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .install-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .btn-install, .btn-dismiss {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-install {
      background: #2196F3;
      color: white;
    }

    .btn-install:hover {
      background: #1976D2;
    }

    .btn-dismiss {
      background: #f5f5f5;
      color: #666;
    }

    .btn-dismiss:hover {
      background: #e0e0e0;
    }

    @media (max-width: 480px) {
      .install-prompt {
        left: 10px;
        right: 10px;
        bottom: 10px;
      }

      .install-content {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .install-actions {
        width: 100%;
        justify-content: center;
      }

      .btn-install, .btn-dismiss {
        flex: 1;
        max-width: 120px;
      }
    }
  `]
})
export class InstallPromptComponent implements OnInit {
  showInstallPrompt = signal(false);
  private deferredPrompt: any = null;

  ngOnInit() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      // Show the install prompt
      this.showInstallPrompt.set(true);
    });

    // Listen for the app being installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.showInstallPrompt.set(false);
      this.deferredPrompt = null;
    });
  }

  async installApp() {
    if (!this.deferredPrompt) {
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferredPrompt
    this.deferredPrompt = null;
    this.showInstallPrompt.set(false);
  }

  dismissPrompt() {
    this.showInstallPrompt.set(false);
    // Store in localStorage to not show again for a while
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastosDemoComponent } from './components/gastos-demo/gastos-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GastosDemoComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>💰 Sistema de Gerenciamento de Gastos</h1>
        <p>Controle completo dos seus gastos de viagem</p>
        
      </header>
      
      <main class="app-main">
        <app-gastos-demo></app-gastos-demo>
      </main>
      
      <footer class="app-footer">
        <div class="footer-content">
          <p>&copy; 2024 Sistema de Gastos - Desenvolvido com Angular + TypeScript</p>
          <div class="footer-links">
            <span>📚 <a href="/README-GASTOS.md" target="_blank">Documentação</a></span>
            <span>💡 <a href="/EXEMPLOS-USO.md" target="_blank">Exemplos de Uso</a></span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .app-header {
      text-align: center;
      padding: 40px 20px 20px;
      color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      h1 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 2.5rem;
        font-weight: 700;
      }

      p {
        margin: 0;
        color: #666;
        font-size: 1.1rem;
      }
    }

    .app-main {
      padding: 20px;
      background: white;
      margin: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      min-height: calc(100vh - 200px);
    }

    .app-footer {
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      text-align: center;
      margin-top: 20px;

      p {
        margin: 0 0 15px 0;
        color: #666;
      }

      .features {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 15px;

        .feature {
          background: #28a745;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }
      }
    }

    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 1.8rem;
      }

      .app-main {
        margin: 10px;
        padding: 15px;
      }

      .features {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class AppComponent {
  title = 'Sistema de Gastos';
  activeTab: 'demo' | 'avancado' = 'demo';
  
  setActiveTab(tab: 'demo' | 'avancado') {
    this.activeTab = tab;
  }
}

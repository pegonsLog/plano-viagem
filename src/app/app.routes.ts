import { Routes } from '@angular/router';
import { ListaViagensComponent } from './components/lista-viagens/lista-viagens.component';

import { viagemExistsGuard } from './guards/viagem-exists.guard';

export const routes: Routes = [
  {
    path: '',
    component: ListaViagensComponent,
    title: 'Minhas Viagens'
  },
  {
    path: 'viagem/:id',
    loadComponent: () => import('./components/detalhes-viagem/detalhes-viagem.component').then(m => m.DetalhesViagemComponent),
    canActivate: [viagemExistsGuard],
    title: 'Detalhes da Viagem',
    data: { prerender: false }
  },
  {
    path: 'viagem/:viagemId/dia/novo',
    loadComponent: () => import('./components/formulario-dia-page/formulario-dia-page.component').then(m => m.FormularioDiaPageComponent),
    title: 'Adicionar Detalhes do Dia',
    data: { prerender: false }
  },
  {
    path: 'viagem/:viagemId/dia/:diaId/editar',
    loadComponent: () => import('./components/formulario-dia-page/formulario-dia-page.component').then(m => m.FormularioDiaPageComponent),
    title: 'Editar Detalhes do Dia',
    data: { prerender: false }
  },
  {
    path: 'viagem/:id/tabela-dias',
    loadComponent: () => import('./components/tabela-dias-planejados/tabela-dias-planejados').then(m => m.TabelaDiasPlanejadosComponent),
    canActivate: [viagemExistsGuard],
    title: 'Dias Planejados',
    data: { prerender: false }
  },
  {
    path: 'viagem/:id/checklist',
    loadComponent: () => import('./components/checklist-viagem/checklist-viagem').then(m => m.ChecklistViagemComponent),
    canActivate: [viagemExistsGuard],
    title: 'Checklist da Viagem',
    data: { prerender: false }
  },
  {
    path: 'viagem/:id/relatorio',
    loadComponent: () => import('./components/relatorio-viagem/relatorio-viagem').then(m => m.RelatorioViagem),
    canActivate: [viagemExistsGuard],
    title: 'Relatório da Viagem',
    data: { prerender: false }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
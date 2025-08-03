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
    title: 'Detalhes da Viagem'
  },
  {
    path: 'viagem/:viagemId/dia/novo',
    loadComponent: () => import('./components/formulario-dia-page/formulario-dia-page.component').then(m => m.FormularioDiaPageComponent),
    title: 'Adicionar Detalhes do Dia'
  },
  {
    path: 'viagem/:viagemId/dia/:diaId/editar',
    loadComponent: () => import('./components/formulario-dia-page/formulario-dia-page.component').then(m => m.FormularioDiaPageComponent),
    title: 'Editar Detalhes do Dia'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
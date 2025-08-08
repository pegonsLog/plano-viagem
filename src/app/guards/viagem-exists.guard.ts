import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ViagemService } from '../services/viagem.service';

export const viagemExistsGuard: CanActivateFn = (route, state) => {
  const viagemService = inject(ViagemService);
  const router = inject(Router);

  const viagemId = route.paramMap.get('id');

  if (!viagemId) {
    router.navigate(['/']);
    return false;
  }

  const viagem = viagemService.obterViagem(viagemId);

  if (!viagem) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
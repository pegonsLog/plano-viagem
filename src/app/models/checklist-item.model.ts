export interface ChecklistItem {
  id: string;
  viagemId: string;
  descricao: string;
  concluido: boolean;
  criadoEm: Date;
}

export interface NovoChecklistItem {
  viagemId: string;
  descricao: string;
  concluido: boolean;
}

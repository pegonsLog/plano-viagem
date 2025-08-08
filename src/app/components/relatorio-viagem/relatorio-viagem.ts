import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ViagemService } from '../../services/viagem.service';
import { DiaViagemService } from '../../services/dia-viagem.service';
import { DateService } from '../../utils/date.service';
import { Viagem } from '../../models/viagem.model';
import { DiaViagem } from '../../models/dia-viagem.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-relatorio-viagem',
  imports: [CommonModule],
  templateUrl: './relatorio-viagem.html',
  styleUrl: './relatorio-viagem.scss'
})
export class RelatorioViagem implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private viagemService = inject(ViagemService);
  private diaViagemService = inject(DiaViagemService);
  private dateService = inject(DateService);

  viagem = signal<Viagem | null>(null);
  dias = signal<DiaViagem[]>([]);
  gerandoPdf = signal(false);
  carregando = signal(true);
  erro = signal<string | null>(null);
  dadosCarregados = signal(false);

  diasOrdenados = computed(() => {
    return this.dias().sort((a, b) => a.data.getTime() - b.data.getTime());
  });

  totalDias = computed(() => {
    const viagemData = this.viagem();
    if (!viagemData) return 0;
    return this.dateService.getDaysDifference(viagemData.dataInicio, viagemData.dataFim);
  });

  diasComDetalhes = computed(() => {
    return this.dias().length;
  });

  valorTotalHospedagem = computed(() => {
    return this.dias().reduce((total, dia) => {
      return total + (dia.valorHospedagem || 0);
    }, 0);
  });

  valorTotalParcelas = computed(() => {
    return this.dias().reduce((total, dia) => {
      return total + (dia.valorParcela || 0);
    }, 0);
  });

  valorTotalTransporte = computed(() => {
    return this.dias().reduce((total, dia) => {
      return total + (dia.custoTransporte || 0);
    }, 0);
  });

  dataAtual = new Date();
  horaAtual = new Date().toLocaleTimeString('pt-BR');

  async ngOnInit(): Promise<void> {
    const viagemId = this.route.snapshot.paramMap.get('id');
    if (viagemId) {
      await this.carregarDadosRelatorio(viagemId);
    } else {
      this.erro.set('ID da viagem não encontrado');
      setTimeout(() => this.router.navigate(['/']), 2000);
    }
  }

  private async carregarDadosRelatorio(viagemId: string): Promise<void> {
    try {
      this.carregando.set(true);
      this.erro.set(null);
      this.dadosCarregados.set(false);

      console.log('Iniciando carregamento dos dados do relatório para viagem:', viagemId);

      // Sempre buscar dados frescos do Firebase para garantir consistência
      const [viagemData, diasCarregados] = await Promise.all([
        this.buscarViagemCompleta(viagemId),
        this.buscarDiasCompletos(viagemId)
      ]);

      if (!viagemData) {
        throw new Error('Viagem não encontrada');
      }

      // Definir os dados apenas quando ambos estiverem carregados
      this.viagem.set(viagemData);
      this.dias.set(diasCarregados);

      console.log('Dados carregados com sucesso:', {
        viagem: viagemData.titulo,
        totalDias: diasCarregados.length
      });

      // Marcar como carregado apenas quando tudo estiver pronto
      this.dadosCarregados.set(true);

    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
      this.erro.set(error instanceof Error ? error.message : 'Erro desconhecido ao carregar dados');

      // Aguardar um pouco antes de redirecionar para mostrar o erro
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    } finally {
      this.carregando.set(false);
    }
  }

  private async buscarViagemCompleta(viagemId: string): Promise<Viagem | null> {
    try {
      // Primeiro tentar do cache
      let viagemData: Viagem | null = this.viagemService.obterViagem(viagemId) || null;

      if (!viagemData) {
        console.log('Viagem não encontrada no cache, buscando no Firebase...');
        viagemData = await this.viagemService.obterViagemPorId(viagemId);
      }

      return viagemData;
    } catch (error) {
      console.error('Erro ao buscar viagem:', error);
      throw new Error('Não foi possível carregar os dados da viagem');
    }
  }

  private async buscarDiasCompletos(viagemId: string): Promise<DiaViagem[]> {
    try {
      // Sempre recarregar os dias do Firebase para garantir dados atualizados
      console.log('Carregando dias da viagem do Firebase...');
      await this.diaViagemService.carregarDiasPorViagem(viagemId);

      const diasViagem = this.diaViagemService.obterDiasPorViagem(viagemId);
      console.log(`Encontrados ${diasViagem.length} dias para a viagem`);

      return diasViagem;
    } catch (error) {
      console.error('Erro ao buscar dias da viagem:', error);
      // Não falhar se não conseguir carregar os dias, apenas retornar array vazio
      return [];
    }
  }

  voltarParaViagem(): void {
    const viagemData = this.viagem();
    if (viagemData) {
      this.router.navigate(['/viagem', viagemData.id]);
    } else {
      this.router.navigate(['/']);
    }
  }

  formatarData(data: Date): string {
    return this.dateService.formatDate(data);
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarTransporte(transporte: string): string {
    const transporteMap: Record<string, string> = {
      'Avião': 'Avião',
      'Carro': 'Carro',
      'Ônibus': 'Ônibus',
      'Trem': 'Trem',
      'Metro': 'Metrô',
      'Táxi': 'Táxi',
      'Uber': 'Uber/App',
      'A pé': 'A pé',
      'Bicicleta': 'Bicicleta',
      'Barco': 'Barco',
      'Outro': 'Outro',
      'N/A': 'N/A'
    };
    return transporteMap[transporte] || transporte;
  }

  formatarLinksHospedagem(links: string): string[] {
    if (!links || links.trim() === '') {
      return [];
    }

    return links
      .split('\n')
      .map(link => link.trim())
      .filter(link => link.length > 0)
      .filter(link => {
        // Validar se é um link válido (começa com http/https ou www)
        return link.startsWith('http://') ||
          link.startsWith('https://') ||
          link.startsWith('www.') ||
          link.includes('.');
      });
  }

  formatarValorParcela(valor: string | number | undefined | null): string {
    // Se o valor já está formatado como string (ex: "R$ 123,45"), retornar como está
    if (typeof valor === 'string' && valor.includes('R$')) {
      return valor;
    }

    // Se é um número válido, formatar
    const numeroValor = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (numeroValor && !isNaN(numeroValor) && numeroValor > 0) {
      return this.formatarMoeda(numeroValor);
    }

    // Se não é válido, retornar valor padrão
    return '(Não informado)';
  }

  calcularSaldo(): number {
    const viagemData = this.viagem();
    if (!viagemData) return 0;

    const totalGastos = this.valorTotalHospedagem() + this.valorTotalTransporte();
    return Math.abs(viagemData.orcamento - totalGastos);
  }

  temSaldoPositivo(): boolean {
    const viagemData = this.viagem();
    if (!viagemData) return true;

    const totalGastos = this.valorTotalHospedagem() + this.valorTotalTransporte();
    return viagemData.orcamento >= totalGastos;
  }

  async gerarPDF(): Promise<void> {
    this.gerandoPdf.set(true);

    try {
      const elemento = document.getElementById('relatorio-content');
      if (!elemento) {
        throw new Error('Elemento do relatório não encontrado');
      }

      // Configurações do html2canvas
      const canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: elemento.scrollWidth,
        height: elemento.scrollHeight
      });

      // Configurações do PDF com margens adequadas
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Margens: superior/inferior 15mm, laterais 10mm
      const marginTop = 15;
      const marginBottom = 15;
      const marginLeft = 10;
      const marginRight = 10;

      const contentWidth = pdfWidth - marginLeft - marginRight;
      const contentHeight = pdfHeight - marginTop - marginBottom;

      // Calcular dimensões da imagem respeitando as margens
      const imgWidth = contentWidth;

      let sourceY = 0; // Posição Y na imagem original
      let pageNumber = 1;

      while (sourceY < canvas.height) {
        // Adicionar nova página (exceto a primeira)
        if (pageNumber > 1) {
          pdf.addPage();
        }

        // Calcular altura da seção a ser renderizada nesta página
        const remainingCanvasHeight = canvas.height - sourceY;
        const scaledRemainingHeight = (remainingCanvasHeight * imgWidth) / canvas.width;
        const pageContentHeight = Math.min(scaledRemainingHeight, contentHeight);

        // Calcular altura proporcional no canvas original
        const canvasSliceHeight = (pageContentHeight * canvas.width) / imgWidth;

        // Criar canvas temporário para esta seção
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = canvas.width;
        tempCanvas.height = canvasSliceHeight;

        if (tempCtx) {
          // Desenhar a seção específica no canvas temporário
          tempCtx.drawImage(
            canvas,
            0, sourceY, canvas.width, canvasSliceHeight,
            0, 0, canvas.width, canvasSliceHeight
          );

          const tempImgData = tempCanvas.toDataURL('image/png');

          // Adicionar a imagem ao PDF com margens adequadas
          pdf.addImage(
            tempImgData,
            'PNG',
            marginLeft,
            marginTop,
            imgWidth,
            pageContentHeight
          );
        }

        // Avançar para a próxima seção
        sourceY += canvasSliceHeight;
        pageNumber++;
      }

      // Salvar o PDF
      const viagemData = this.viagem();
      const nomeArquivo = `relatorio-${viagemData?.titulo.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(nomeArquivo);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      this.gerandoPdf.set(false);
    }
  }
}

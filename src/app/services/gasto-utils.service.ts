import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Gasto, CategoriaGasto, FormaPagamento } from '../models/gasto.model';

/**
 * Serviço utilitário com funcionalidades interessantes para gastos
 */
@Injectable({
  providedIn: 'root'
})
export class GastoUtilsService {

  constructor() {}

  /**
   * Gera insights inteligentes baseados nos gastos
   */
  gerarInsights(gastos: Gasto[]): Observable<string[]> {
    const insights: string[] = [];
    
    if (gastos.length === 0) {
      return of(['Adicione alguns gastos para ver insights personalizados!']);
    }

    // Análise de padrões de gasto
    const gastosPorCategoria = this.agruparPorCategoria(gastos);
    const categoriaComMaiorGasto = this.getCategoriaComMaiorGasto(gastosPorCategoria);
    const mediaGastoDiario = this.calcularMediaGastoDiario(gastos);
    
    // Insight sobre categoria dominante
    if (categoriaComMaiorGasto) {
      const percentual = (gastosPorCategoria[categoriaComMaiorGasto] / this.calcularTotalGastos(gastos)) * 100;
      insights.push(`💡 ${percentual.toFixed(1)}% dos seus gastos são em ${categoriaComMaiorGasto}`);
    }

    // Insight sobre média diária
    if (mediaGastoDiario > 0) {
      insights.push(`📊 Sua média de gasto diário é de R$ ${mediaGastoDiario.toFixed(2)}`);
    }

    // Insight sobre forma de pagamento preferida
    const formaPagamentoPreferida = this.getFormaPagamentoMaisUsada(gastos);
    if (formaPagamentoPreferida) {
      insights.push(`💳 Você prefere pagar com ${formaPagamentoPreferida}`);
    }

    // Insight sobre horários de gasto
    const horarioPico = this.getHorarioPicoGastos(gastos);
    if (horarioPico) {
      insights.push(`⏰ Você gasta mais no período da ${horarioPico}`);
    }

    // Insight sobre economia
    const economiasPossiveis = this.identificarEconomiasPossiveis(gastos);
    insights.push(...economiasPossiveis);

    return of(insights);
  }

  /**
   * Gera recomendações personalizadas
   */
  gerarRecomendacoes(gastos: Gasto[], orcamento: number): Observable<string[]> {
    const recomendacoes: string[] = [];
    const totalGasto = this.calcularTotalGastos(gastos);
    const percentualOrcamento = (totalGasto / orcamento) * 100;

    // Recomendações baseadas no orçamento
    if (percentualOrcamento > 90) {
      recomendacoes.push('🚨 Atenção! Você já gastou mais de 90% do orçamento. Considere reduzir gastos não essenciais.');
    } else if (percentualOrcamento > 75) {
      recomendacoes.push('⚠️ Você está próximo do limite do orçamento. Monitore os próximos gastos.');
    } else if (percentualOrcamento < 50) {
      recomendacoes.push('✅ Parabéns! Você está dentro do orçamento. Continue assim!');
    }

    // Recomendações por categoria
    const gastosPorCategoria = this.agruparPorCategoria(gastos);
    Object.entries(gastosPorCategoria).forEach(([categoria, valor]) => {
      const percentualCategoria = (valor / totalGasto) * 100;
      
      if (categoria === 'Alimentação' && percentualCategoria > 40) {
        recomendacoes.push('🍽️ Considere cozinhar mais ou procurar opções mais econômicas para alimentação.');
      }
      
      if (categoria === 'Entretenimento' && percentualCategoria > 30) {
        recomendacoes.push('🎭 Que tal explorar atividades gratuitas ou mais baratas para entretenimento?');
      }
      
      if (categoria === 'Compras' && percentualCategoria > 25) {
        recomendacoes.push('🛍️ Avalie se todas as compras são realmente necessárias.');
      }
    });

    // Recomendações sobre formas de pagamento
    const usaCartaoCredito = gastos.some(g => g.formaPagamento === 'Cartão de Crédito');
    if (usaCartaoCredito) {
      recomendacoes.push('💳 Monitore os gastos no cartão de crédito para evitar surpresas na fatura.');
    }

    return of(recomendacoes);
  }

  /**
   * Detecta gastos suspeitos ou incomuns
   */
  detectarGastosSuspeitos(gastos: Gasto[]): Observable<Gasto[]> {
    const gastosSuspeitos: Gasto[] = [];
    
    if (gastos.length < 3) {
      return of(gastosSuspeitos);
    }

    const mediaValor = gastos.reduce((sum, g) => sum + g.valor, 0) / gastos.length;
    const limiteAlto = mediaValor * 3; // 3x a média

    // Gastos muito acima da média
    gastos.forEach(gasto => {
      if (gasto.valor > limiteAlto) {
        gastosSuspeitos.push(gasto);
      }
    });

    // Gastos duplicados no mesmo dia
    const gastosPorDia = new Map<string, Gasto[]>();
    gastos.forEach(gasto => {
      const dataStr = gasto.data.toDateString();
      if (!gastosPorDia.has(dataStr)) {
        gastosPorDia.set(dataStr, []);
      }
      gastosPorDia.get(dataStr)!.push(gasto);
    });

    gastosPorDia.forEach(gastosNoDia => {
      if (gastosNoDia.length > 1) {
        // Verifica gastos muito similares no mesmo dia
        for (let i = 0; i < gastosNoDia.length; i++) {
          for (let j = i + 1; j < gastosNoDia.length; j++) {
            const gasto1 = gastosNoDia[i];
            const gasto2 = gastosNoDia[j];
            
            if (Math.abs(gasto1.valor - gasto2.valor) < 0.01 && 
                gasto1.categoria === gasto2.categoria &&
                !gastosSuspeitos.includes(gasto1)) {
              gastosSuspeitos.push(gasto1);
            }
          }
        }
      }
    });

    return of(gastosSuspeitos);
  }

  /**
   * Sugere categorização automática baseada no título/descrição
   */
  sugerirCategoria(titulo: string, descricao?: string): CategoriaGasto | null {
    const texto = `${titulo} ${descricao || ''}`.toLowerCase();
    
    // Palavras-chave por categoria
    const palavrasChave = {
      'Transporte': ['uber', 'taxi', 'ônibus', 'metro', 'avião', 'voo', 'passagem', 'combustível', 'gasolina'],
      'Hospedagem': ['hotel', 'pousada', 'hostel', 'airbnb', 'booking', 'hospedagem', 'quarto'],
      'Alimentação': ['restaurante', 'lanche', 'café', 'jantar', 'almoço', 'comida', 'bebida', 'bar'],
      'Entretenimento': ['cinema', 'teatro', 'show', 'ingresso', 'parque', 'museu', 'tour'],
      'Compras': ['loja', 'shopping', 'souvenir', 'roupa', 'presente', 'mercado'],
      'Saúde': ['farmácia', 'remédio', 'médico', 'hospital', 'consulta'],
      'Comunicação': ['internet', 'wifi', 'chip', 'telefone', 'dados']
    };

    for (const [categoria, palavras] of Object.entries(palavrasChave)) {
      if (palavras.some(palavra => texto.includes(palavra))) {
        return categoria as CategoriaGasto;
      }
    }

    return null;
  }

  /**
   * Calcula tendência de gastos (crescente, decrescente, estável)
   */
  calcularTendenciaGastos(gastos: Gasto[]): 'crescente' | 'decrescente' | 'estável' {
    if (gastos.length < 7) {
      return 'estável';
    }

    // Ordena por data
    const gastosOrdenados = [...gastos].sort((a, b) => a.data.getTime() - b.data.getTime());
    
    // Divide em duas metades
    const metade = Math.floor(gastosOrdenados.length / 2);
    const primeiraMetade = gastosOrdenados.slice(0, metade);
    const segundaMetade = gastosOrdenados.slice(metade);
    
    const mediaPrimeira = primeiraMetade.reduce((sum, g) => sum + g.valor, 0) / primeiraMetade.length;
    const mediaSegunda = segundaMetade.reduce((sum, g) => sum + g.valor, 0) / segundaMetade.length;
    
    const diferenca = ((mediaSegunda - mediaPrimeira) / mediaPrimeira) * 100;
    
    if (diferenca > 10) return 'crescente';
    if (diferenca < -10) return 'decrescente';
    return 'estável';
  }

  /**
   * Gera relatório de economia potencial
   */
  calcularEconomiaPotencial(gastos: Gasto[]): Observable<{categoria: string, economia: number, dicas: string[]}[]> {
    const economias: {categoria: string, economia: number, dicas: string[]}[] = [];
    const gastosPorCategoria = this.agruparPorCategoria(gastos);
    
    Object.entries(gastosPorCategoria).forEach(([categoria, valor]) => {
      let economiaPotencial = 0;
      const dicas: string[] = [];
      
      switch (categoria) {
        case 'Alimentação':
          economiaPotencial = valor * 0.3; // 30% de economia possível
          dicas.push('Cozinhe mais em casa');
          dicas.push('Procure restaurantes com preços mais acessíveis');
          dicas.push('Evite bebidas caras');
          break;
          
        case 'Transporte':
          economiaPotencial = valor * 0.2; // 20% de economia possível
          dicas.push('Use transporte público quando possível');
          dicas.push('Caminhe distâncias curtas');
          dicas.push('Compare preços de diferentes apps de transporte');
          break;
          
        case 'Entretenimento':
          economiaPotencial = valor * 0.4; // 40% de economia possível
          dicas.push('Procure atividades gratuitas');
          dicas.push('Aproveite promoções e descontos');
          dicas.push('Explore atrações naturais');
          break;
          
        case 'Compras':
          economiaPotencial = valor * 0.5; // 50% de economia possível
          dicas.push('Faça uma lista antes de comprar');
          dicas.push('Compare preços em diferentes lojas');
          dicas.push('Evite compras por impulso');
          break;
      }
      
      if (economiaPotencial > 0) {
        economias.push({ categoria, economia: economiaPotencial, dicas });
      }
    });
    
    return of(economias.sort((a, b) => b.economia - a.economia));
  }

  // Métodos auxiliares privados
  private agruparPorCategoria(gastos: Gasto[]): {[key: string]: number} {
    return gastos.reduce((acc, gasto) => {
      acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.valor;
      return acc;
    }, {} as {[key: string]: number});
  }

  private getCategoriaComMaiorGasto(gastosPorCategoria: {[key: string]: number}): string | null {
    const entradas = Object.entries(gastosPorCategoria);
    if (entradas.length === 0) return null;
    
    return entradas.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  private calcularMediaGastoDiario(gastos: Gasto[]): number {
    if (gastos.length === 0) return 0;
    
    const datas = gastos.map(g => g.data.toDateString());
    const diasUnicos = new Set(datas).size;
    const totalGasto = this.calcularTotalGastos(gastos);
    
    return totalGasto / Math.max(diasUnicos, 1);
  }

  private calcularTotalGastos(gastos: Gasto[]): number {
    return gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
  }

  private getFormaPagamentoMaisUsada(gastos: Gasto[]): string | null {
    const contagem = gastos.reduce((acc, gasto) => {
      acc[gasto.formaPagamento] = (acc[gasto.formaPagamento] || 0) + 1;
      return acc;
    }, {} as {[key: string]: number});
    
    const entradas = Object.entries(contagem);
    if (entradas.length === 0) return null;
    
    return entradas.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  private getHorarioPicoGastos(gastos: Gasto[]): string | null {
    const periodos = gastos.reduce((acc, gasto) => {
      const hora = gasto.data.getHours();
      let periodo: string;
      
      if (hora >= 6 && hora < 12) periodo = 'manhã';
      else if (hora >= 12 && hora < 18) periodo = 'tarde';
      else if (hora >= 18 && hora < 24) periodo = 'noite';
      else periodo = 'madrugada';
      
      acc[periodo] = (acc[periodo] || 0) + 1;
      return acc;
    }, {} as {[key: string]: number});
    
    const entradas = Object.entries(periodos);
    if (entradas.length === 0) return null;
    
    return entradas.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  private identificarEconomiasPossiveis(gastos: Gasto[]): string[] {
    const economias: string[] = [];
    const gastosPorCategoria = this.agruparPorCategoria(gastos);
    const totalGasto = this.calcularTotalGastos(gastos);
    
    Object.entries(gastosPorCategoria).forEach(([categoria, valor]) => {
      const percentual = (valor / totalGasto) * 100;
      
      if (categoria === 'Entretenimento' && percentual > 25) {
        economias.push('🎯 Considere atividades gratuitas para reduzir gastos com entretenimento');
      }
      
      if (categoria === 'Alimentação' && percentual > 35) {
        economias.push('🍳 Cozinhar mais pode reduzir significativamente os gastos com alimentação');
      }
      
      if (categoria === 'Transporte' && percentual > 30) {
        economias.push('🚶‍♂️ Caminhar ou usar transporte público pode economizar em transporte');
      }
    });
    
    return economias;
  }
}

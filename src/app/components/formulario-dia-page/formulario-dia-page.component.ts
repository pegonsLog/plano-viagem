import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DiaViagem, NovoDiaViagem, TIPOS_TRANSPORTE, FORMAS_PAGAMENTO } from '../../models/dia-viagem.model';
import { DiaViagemService } from '../../services/dia-viagem.service';
import { ViagemService } from '../../services/viagem.service';
import { DateService } from '../../utils/date.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';

@Component({
    selector: 'app-formulario-dia-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './formulario-dia-page.component.html',
    styleUrl: './formulario-dia-page.component.scss'
})
export class FormularioDiaPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private diaViagemService = inject(DiaViagemService);
    private viagemService = inject(ViagemService);
    private dateService = inject(DateService);
    private errorHandler = inject(ErrorHandlerService);
    private fb = inject(FormBuilder);

    salvando = signal(false);
    dataString = signal('');
    viagemId = signal('');
    diaId = signal<string | null>(null);

    formulario: FormGroup = this.fb.group({
        data: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        transporte: [''],
        nomeHospedagem: [''],
        enderecoHospedagem: [''],
        contatoHospedagem: [''],
        numeroReserva: [''],
        horarioChecks: [''],
        linkHospedagem: [''],
        deslocamentoLocal: [''],
        detalhesVoo: [''],
        observacoes: [''],
        formaPagamento: [''],
        formaPagamentoTransporte: [''],
        titularCartao: [''],
        finalCartao: [''],
        quantidadeParcelas: [null],
        valorHospedagem: [null, [Validators.min(0)]],
        valorParcela: [null, [Validators.min(0)]],
        custoTransporte: [null, [Validators.min(0)]],
        temPendencia: [false],
        motivoPendencia: ['']
    });

    tiposTransporte = TIPOS_TRANSPORTE;
    formasPagamento = FORMAS_PAGAMENTO;

    modoEdicao = computed(() => !!this.diaId());

    diaSemanaCalculado = computed(() => {
        const dataFormulario = this.formulario.get('data')?.value;
        if (dataFormulario) {
            const data = this.dateService.createDateFromInput(dataFormulario);
            return this.dateService.getWeekdayName(data);
        }
        return '';
    });

    isFimDeSemana = computed(() => {
        const dataFormulario = this.formulario.get('data')?.value;
        if (dataFormulario) {
            const data = this.dateService.createDateFromInput(dataFormulario);
            return this.dateService.isWeekend(data);
        }
        return false;
    });

    ngOnInit() {
        // Obter parâmetros da rota
        this.viagemId.set(this.route.snapshot.paramMap.get('viagemId') || '');
        const diaIdParam = this.route.snapshot.paramMap.get('diaId');
        this.diaId.set(diaIdParam);



        // Obter data da query string ou usar data atual
        const dataParam = this.route.snapshot.queryParamMap.get('data');
        const dataInicial = dataParam || this.dateService.formatDateForInput(this.dateService.createBrazilDate());

        this.dataString.set(dataInicial);
        this.formulario.patchValue({ data: dataInicial });

        // Se estiver editando, carregar dados do dia
        if (this.modoEdicao() && diaIdParam) {
            this.carregarDadosDia(diaIdParam);
        }

        // Configurar cálculo automático do valor da parcela
        this.configurarCalculoAutomatico();
    }

    private async carregarDadosDia(diaId: string) {
        try {
            const dia = await this.diaViagemService.obterDiaPorId(diaId);
            if (dia) {
                // Atualizar a data primeiro
                const dataFormatada = this.dateService.formatDateForInput(dia.data);
                this.dataString.set(dataFormatada);

                // Preencher o formulário completo, incluindo a data
                this.formulario.patchValue({
                    data: dataFormatada,
                    cidade: dia.cidade,
                    transporte: dia.transporte || '',
                    nomeHospedagem: dia.nomeHospedagem || '',
                    enderecoHospedagem: dia.enderecoHospedagem || '',
                    contatoHospedagem: dia.contatoHospedagem || '',
                    numeroReserva: dia.numeroReserva || '',
                    horarioChecks: dia.horarioChecks || '',
                    linkHospedagem: dia.linkHospedagem || '',
                    deslocamentoLocal: dia.deslocamentoLocal || '',
                    detalhesVoo: dia.detalhesVoo || '',
                    observacoes: dia.observacoes || '',
                    formaPagamento: dia.formaPagamento || '',
                    formaPagamentoTransporte: dia.formaPagamentoTransporte || '',
                    titularCartao: dia.titularCartao || '',
                    finalCartao: dia.finalCartao || '',
                    quantidadeParcelas: dia.quantidadeParcelas,
                    valorHospedagem: dia.valorHospedagem,
                    valorParcela: dia.valorParcela,
                    custoTransporte: dia.custoTransporte,
                    temPendencia: dia.status === 'Pendente',
                    motivoPendencia: dia.motivoPendencia || ''
                });


            }
        } catch (error) {
            console.error('Erro ao carregar dados do dia:', error);
            this.errorHandler.showError('Erro ao carregar dados do dia.');
        }
    }

    onDataChange() {
        // Sincronizar com o signal para manter compatibilidade
        const dataFormulario = this.formulario.get('data')?.value;
        if (dataFormulario) {
            this.dataString.set(dataFormulario);
        }
    }

    private limparCamposVazios(obj: any): any {
        const resultado: any = {};
        console.log('Limpando campos vazios do objeto:', obj);

        for (const [key, value] of Object.entries(obj)) {
            console.log(`Campo ${key}:`, value, `(tipo: ${typeof value})`);
            if (value !== '' && value !== null && value !== undefined) {
                resultado[key] = value;
                console.log(`✓ Campo ${key} mantido:`, value);
            } else {
                console.log(`✗ Campo ${key} removido (vazio):`, value);
            }
        }

        console.log('Resultado após limpeza:', resultado);
        return resultado;
    }

    async onSubmit() {
        console.log('🔥 SUBMIT CHAMADO!');

        if (this.formulario.invalid) {
            console.log('❌ Formulário inválido');
            this.formulario.markAllAsTouched();
            return;
        }

        if (this.salvando()) {
            console.log('⏳ Já está salvando...');
            return;
        }

        this.salvando.set(true);

        try {
            const formValues = this.formulario.value;
            const dataForm = this.dateService.createDateFromInput(formValues.data);



            if (this.modoEdicao() && this.diaId()) {
                // Modo edição - INCLUIR campos vazios para limpar no Firebase
                const diaAtualizado: Partial<DiaViagem> = {
                    data: dataForm,
                    cidade: formValues.cidade,
                    transporte: formValues.transporte || '',
                    nomeHospedagem: formValues.nomeHospedagem || '',
                    enderecoHospedagem: formValues.enderecoHospedagem || '',
                    contatoHospedagem: formValues.contatoHospedagem || '',
                    numeroReserva: formValues.numeroReserva || '',
                    horarioChecks: formValues.horarioChecks || '',
                    linkHospedagem: formValues.linkHospedagem || '',
                    deslocamentoLocal: formValues.deslocamentoLocal || '',
                    detalhesVoo: formValues.detalhesVoo || '',
                    observacoes: formValues.observacoes || '',
                    formaPagamento: formValues.formaPagamento || '',
                    formaPagamentoTransporte: formValues.formaPagamentoTransporte || '',
                    titularCartao: formValues.titularCartao || '',
                    finalCartao: formValues.finalCartao || '',
                    quantidadeParcelas: formValues.quantidadeParcelas || null,
                    valorHospedagem: formValues.valorHospedagem || null,
                    valorParcela: formValues.valorParcela || null,
                    custoTransporte: formValues.custoTransporte || null,
                    status: formValues.temPendencia ? 'Pendente' : 'Concluído',
                    motivoPendencia: formValues.temPendencia ? formValues.motivoPendencia : ''
                };



                await this.diaViagemService.atualizarDia(this.diaId()!, diaAtualizado);
                this.errorHandler.showInfo('Detalhes do dia atualizados com sucesso!');
            } else {
                // Modo criação - aqui sim, limpar campos vazios
                const dadosLimpos = this.limparCamposVazios({
                    transporte: formValues.transporte,
                    nomeHospedagem: formValues.nomeHospedagem,
                    enderecoHospedagem: formValues.enderecoHospedagem,
                    contatoHospedagem: formValues.contatoHospedagem,
                    numeroReserva: formValues.numeroReserva,
                    horarioChecks: formValues.horarioChecks,
                    linkHospedagem: formValues.linkHospedagem,
                    deslocamentoLocal: formValues.deslocamentoLocal,
                    detalhesVoo: formValues.detalhesVoo,
                    observacoes: formValues.observacoes,
                    formaPagamento: formValues.formaPagamento,
                    formaPagamentoTransporte: formValues.formaPagamentoTransporte,
                    titularCartao: formValues.titularCartao,
                    finalCartao: formValues.finalCartao,
                    quantidadeParcelas: formValues.quantidadeParcelas,
                    valorHospedagem: formValues.valorHospedagem,
                    valorParcela: formValues.valorParcela,
                    custoTransporte: formValues.custoTransporte,
                    status: formValues.temPendencia ? 'Pendente' : 'Concluído',
                    motivoPendencia: formValues.temPendencia ? formValues.motivoPendencia : ''
                });

                const novoDia: NovoDiaViagem = {
                    viagemId: this.viagemId(),
                    data: dataForm,
                    cidade: formValues.cidade,
                    ...dadosLimpos
                };



                await this.diaViagemService.adicionarDia(novoDia);
                this.errorHandler.showInfo('Detalhes do dia adicionados com sucesso!');
            }

            // Voltar para a página de detalhes da viagem
            this.voltarParaViagem();
        } catch (error) {
            console.error('Erro ao salvar dia:', error);
            // Erro já tratado no serviço
        } finally {
            this.salvando.set(false);
        }
    }

    voltarParaViagem() {
        this.router.navigate(['/viagem', this.viagemId()]);
    }

    onCancelar() {
        this.voltarParaViagem();
    }

    private configurarCalculoAutomatico() {
        // Observar mudanças no valor da hospedagem e quantidade de parcelas
        const valorHospedagem = this.formulario.get('valorHospedagem');
        const quantidadeParcelas = this.formulario.get('quantidadeParcelas');
        const valorParcela = this.formulario.get('valorParcela');

        if (valorHospedagem && quantidadeParcelas && valorParcela) {
            // Listener para valor da hospedagem
            valorHospedagem.valueChanges.subscribe(() => {
                this.calcularValorParcela();
            });

            // Listener para quantidade de parcelas
            quantidadeParcelas.valueChanges.subscribe(() => {
                this.calcularValorParcela();
            });

            // Calcular inicialmente se já houver valores
            this.calcularValorParcela();
        }
    }

    private calcularValorParcela() {
        const valorHospedagem = this.formulario.get('valorHospedagem')?.value;
        const quantidadeParcelas = this.formulario.get('quantidadeParcelas')?.value;
        const valorParcelaControl = this.formulario.get('valorParcela');

        if (!valorParcelaControl) return;

        // Limpar o campo se algum valor estiver vazio ou inválido
        if (!valorHospedagem || !quantidadeParcelas ||
            valorHospedagem <= 0 || quantidadeParcelas <= 0) {
            valorParcelaControl.setValue('', { emitEvent: false });
            return;
        }

        // Calcular o valor
        const valorCalculado = valorHospedagem / quantidadeParcelas;

        // Arredondar para 2 casas decimais
        const valorArredondado = Math.round(valorCalculado * 100) / 100;

        // Formatar como moeda brasileira
        const valorFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valorArredondado);

        // Atualizar o campo sem disparar eventos (para evitar loop)
        valorParcelaControl.setValue(valorFormatado, { emitEvent: false });
    }

    async preencherIdem(campo: string) {
        try {
            // Buscar o dia anterior baseado na data atual do formulário
            const dataFormulario = this.formulario.get('data')?.value;
            const dataAtual = dataFormulario ?
                this.dateService.createDateFromInput(dataFormulario) :
                this.dateService.createBrazilDate();
            const diaAnterior = await this.diaViagemService.buscarDiaAnterior(this.viagemId(), dataAtual);

            if (diaAnterior && diaAnterior[campo as keyof DiaViagem]) {
                const valor = diaAnterior[campo as keyof DiaViagem];
                if (valor !== undefined && valor !== null && valor !== '') {
                    this.formulario.patchValue({ [campo]: valor });

                    // Se preencheu valor da hospedagem ou quantidade de parcelas, recalcular
                    if (campo === 'valorHospedagem' || campo === 'quantidadeParcelas') {
                        setTimeout(() => this.calcularValorParcela(), 100);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dia anterior:', error);
        }
    }
}
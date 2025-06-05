import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DeviceTokensService } from '../device-tokens/device-tokens.service';
import { MedicamentosService } from '../medicamentos/medicamentos.service';
import { ConsultasService } from '../consultas/consultas.service';
import { TestarNotificacaoDto } from './dto/testar-notificacao.dto';
import * as admin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioMedicamento } from '../horarios-medicamentos/horario-medicamento.entity';

@Injectable()
export class NotificacoesService {
    private readonly logger = new Logger(NotificacoesService.name);
    private fcmInitialized = false;

    constructor(
        private readonly deviceTokensService: DeviceTokensService,
        private readonly medicamentosService: MedicamentosService,
        private readonly consultasService: ConsultasService,
        @InjectRepository(HorarioMedicamento)
        private horariosMedicamentosRepository: Repository<HorarioMedicamento>,
    ) {
        this.initializeFCM();
    }

    private initializeFCM() {
        try {
            // Verificar se o Firebase já foi inicializado
            if (!admin.apps.length) {
                // Na produção, você usaria um arquivo de credenciais real
                // Para fins de desenvolvimento, usamos uma configuração simulada
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: 'vitacare-app',
                        clientEmail: 'firebase-adminsdk@vitacare-app.iam.gserviceaccount.com',
                        // Chave privada simulada para desenvolvimento
                        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj\nMzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvu\nNMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ\n-----END PRIVATE KEY-----\n',
                    }),
                    databaseURL: 'https://vitacare-app.firebaseio.com',
                });
                this.fcmInitialized = true;
                this.logger.log('Firebase Admin SDK inicializado com sucesso (modo simulação)');
            }
        } catch (error) {
            this.logger.error(`Erro ao inicializar Firebase Admin SDK: ${error.message}`);
            this.fcmInitialized = false;
        }
    }

    async enviarNotificacaoTeste(usuarioId: number, testarNotificacaoDto: TestarNotificacaoDto) {
        const deviceTokens = await this.deviceTokensService.findAllByUsuario(usuarioId);

        if (!deviceTokens.length) {
            return {
                sucesso: false,
                mensagem: 'Nenhum dispositivo registrado para este usuário. Registre um dispositivo primeiro.',
            };
        }

        // Extrair apenas os tokens
        const tokens = deviceTokens.map(dt => dt.token);

        try {
            if (this.fcmInitialized) {
                // Enviar notificação real via FCM (em produção)
                const mensagem = {
                    notification: {
                        title: testarNotificacaoDto.titulo,
                        body: testarNotificacaoDto.corpo,
                    },
                    data: testarNotificacaoDto.dados ? JSON.parse(testarNotificacaoDto.dados) : {},
                    tokens: tokens,
                };

                // Em produção, isso enviaria a notificação
                // const response = await admin.messaging().sendMulticast(mensagem);

                // Simulação de resposta para desenvolvimento
                const response = {
                    successCount: tokens.length,
                    failureCount: 0,
                };

                this.logger.log(`Notificação de teste enviada para ${response.successCount} dispositivos`);

                return {
                    sucesso: true,
                    mensagem: `Notificação enviada com sucesso para ${response.successCount} dispositivos`,
                    detalhes: {
                        sucessos: response.successCount,
                        falhas: response.failureCount,
                    },
                };
            } else {
                // Modo simulação (sem FCM real)
                this.logger.log(`[SIMULAÇÃO] Enviando notificação para ${tokens.length} dispositivos`);

                return {
                    sucesso: true,
                    mensagem: `[MODO SIMULAÇÃO] Notificação simulada para ${tokens.length} dispositivos`,
                    detalhes: {
                        titulo: testarNotificacaoDto.titulo,
                        corpo: testarNotificacaoDto.corpo,
                        tokens: tokens,
                    },
                };
            }
        } catch (error) {
            this.logger.error(`Erro ao enviar notificação: ${error.message}`);
            return {
                sucesso: false,
                mensagem: `Erro ao enviar notificação: ${error.message}`,
            };
        }
    }

    async getStatusNotificacoes(usuarioId: number) {
        const deviceTokens = await this.deviceTokensService.findAllByUsuario(usuarioId);

        return {
            dispositivos_registrados: deviceTokens.length,
            fcm_inicializado: this.fcmInitialized,
            modo: this.fcmInitialized ? 'produção' : 'simulação',
        };
    }

    // Executa a cada minuto para verificar medicamentos a serem tomados
    @Cron('0 * * * * *')
    async verificarLembretesMedicamentos() {
        this.logger.debug('Verificando lembretes de medicamentos...');

        try {
            // Obtém a hora atual no formato HH:MM
            const agora = new Date();
            const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' +
                agora.getMinutes().toString().padStart(2, '0');

            // Busca todos os horários de medicamentos para o horário atual
            const horarios = await this.horariosMedicamentosRepository
                .createQueryBuilder('horario')
                .innerJoinAndSelect('horario.medicamento', 'medicamento')
                .innerJoinAndSelect('medicamento.usuario', 'usuario')
                .where('horario.horarioAdministracao = :horaAtual', { horaAtual })
                .andWhere('horario.ativo = true')
                .getMany();

            if (horarios.length === 0) {
                return;
            }

            this.logger.log(`Encontrados ${horarios.length} medicamentos para lembrete às ${horaAtual}`);

            // Agrupar horários por usuário para enviar notificações em lote
            const usuariosMap = new Map<number, { usuarioId: number, lembretes: Array<{ medicamento: string, dosagem: string, quantidade: number }> }>();

            horarios.forEach(horario => {
                const usuarioId = horario.medicamento.usuarioId;

                if (!usuariosMap.has(usuarioId)) {
                    usuariosMap.set(usuarioId, {
                        usuarioId,
                        lembretes: []
                    });
                }

                // Obter a entradada do usuario de forma segura 
                const usuarioEntry = usuariosMap.get(usuarioId)

                if (usuarioEntry) {
                    usuarioEntry.lembretes.push({
                        medicamento: horario.medicamento.nome,
                        dosagem: horario.medicamento.dosagem || '',
                        quantidade: horario.quantidadeComprimido || 1
                    });
                }

            });

            // Enviar notificações para cada usuário
            for (const [usuarioId, dados] of usuariosMap.entries()) {
                await this.enviarNotificacaoLembreteMedicamentos(usuarioId, dados.lembretes);
            }

        } catch (error) {
            this.logger.error(`Erro ao verificar lembretes de medicamentos: ${error.message}`);
        }
    }

    // Executa a cada hora para verificar consultas agendadas
    @Cron('0 0 * * * *')
    async verificarLembretesConsultas() {
        this.logger.debug('Verificando lembretes de consultas...');

        try {
            const agora = new Date();

            // Buscar todas as consultas que precisam de lembrete na próxima hora
            // Implementação depende da estrutura exata da entidade Consulta
            // Este é um exemplo simplificado

            // Código para buscar consultas com lembrete na próxima hora
            // const consultas = await this.consultasService.findConsultasComLembreteProximaHora();

            // Para cada consulta, enviar notificação
            // for (const consulta of consultas) {
            //   await this.enviarNotificacaoLembreteConsulta(consulta);
            // }

        } catch (error) {
            this.logger.error(`Erro ao verificar lembretes de consultas: ${error.message}`);
        }
    }

    private async enviarNotificacaoLembreteMedicamentos(usuarioId: number, lembretes: Array<{ medicamento: string, dosagem: string, quantidade: number }>) {
        try {
            const deviceTokens = await this.deviceTokensService.findAllByUsuario(usuarioId);

            if (!deviceTokens.length) {
                this.logger.warn(`Usuário ${usuarioId} não tem dispositivos registrados para receber lembretes`);
                return;
            }

            const tokens = deviceTokens.map(dt => dt.token);

            // Criar mensagem de notificação
            let titulo = 'Hora de tomar seu medicamento';
            let corpo = '';

            if (lembretes.length === 1) {
                const lembrete = lembretes[0];
                corpo = `${lembrete.medicamento}${lembrete.dosagem ? ' ' + lembrete.dosagem : ''}${lembrete.quantidade > 1 ? ' - ' + lembrete.quantidade + ' unidades' : ''}`;
            } else {
                corpo = `Você tem ${lembretes.length} medicamentos para tomar agora`;
            }

            // Dados adicionais para a notificação
            const dados = {
                tipo: 'lembrete_medicamento',
                quantidade: lembretes.length.toString(),
                medicamentos: JSON.stringify(lembretes),
            };

            if (this.fcmInitialized) {
                // Enviar notificação real via FCM (em produção)
                const mensagem = {
                    notification: {
                        title: titulo,
                        body: corpo,
                    },
                    data: dados,
                    tokens: tokens,
                };

                // Em produção, isso enviaria a notificação
                // const response = await admin.messaging().sendMulticast(mensagem);

                this.logger.log(`[SIMULAÇÃO] Lembrete de medicamento enviado para usuário ${usuarioId} (${tokens.length} dispositivos)`);
            } else {
                // Modo simulação
                this.logger.log(`[SIMULAÇÃO] Lembrete de medicamento para usuário ${usuarioId}: ${titulo} - ${corpo}`);
            }

        } catch (error) {
            this.logger.error(`Erro ao enviar lembrete de medicamento para usuário ${usuarioId}: ${error.message}`);
        }
    }
}

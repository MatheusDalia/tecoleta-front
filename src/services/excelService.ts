import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import api from '../api';

interface ServicoData {
  obraId: number;
  obra: string;
  servico: string;
  unidade: string;
  observacao: string;
  timestamp: string;
}

interface FinalServicoData {
  quantidade: number;
  data: string;
  observacoes: string;
  // ... outros campos
}

interface AtividadeData {
  obra: string;
  nome: string;
  data: string;
  numeroOperarios: number;
  numeroAjudantes?: number;
  horasTrabalho: number;
  quantidadeExecutada: number;
  local: string;
  observacoes?: string;
  obraId: number;
}

export const saveServicoData = async (data: ServicoData) => {
  try {
    const key = `servico_${data.obraId}_${Date.now()}`;
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};

export const saveFinalServicoData = async (obraId: number, data: FinalServicoData) => {
  try {
    const dataFormatada = new Date().toISOString();

    const atividadeData: AtividadeData = {
      obra: data.obra,
      nome: data.servico,
      data: dataFormatada,
      numeroOperarios: Number(data.oficiais),
      numeroAjudantes: Number(data.ajudantes),
      horasTrabalho: Number(data.horas),
      quantidadeExecutada: Number(data.quantidade),
      local: data.local || 'Local não especificado',
      observacoes: data.observacao || '',
      obraId: obraId
    };

    if (!atividadeData.obra || !atividadeData.nome || !atividadeData.data || !atividadeData.numeroOperarios || 
        !atividadeData.horasTrabalho || !atividadeData.quantidadeExecutada || !atividadeData.obraId ||
        !atividadeData.local) {
      throw new Error('Dados incompletos: ' + JSON.stringify(atividadeData));
    }

    const dadosParaAPI = {
      ...atividadeData,
      data: atividadeData.data || new Date().toISOString(),
      local: atividadeData.local || 'Local não especificado',
      observacoes: atividadeData.observacoes || ''
    };

    const response = await api.post('/atividades', dadosParaAPI);
    console.log('Resposta da API:', response.data);

    const key = `final_servico_${obraId}_${Date.now()}`;
    await AsyncStorage.setItem(key, JSON.stringify(data));

  } catch (error) {
    console.error('Erro ao salvar dados finais:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
      console.error('Status do erro:', error.response.status);
      console.error('Headers da resposta:', error.response.headers);
    }
    throw error;
  }
};

export const generateExcel = async (obraId: number, nomeAtividade?: string) => {
  try {
    console.log('Iniciando geração do CSV para obra:', obraId);

    const response = await api.get(`/atividades`, {
      params: { obraId }
    });

    const response2 = await api.get(`/obras/${obraId}`);
    const obraNome = response2.data.nome;

    let atividades = response.data;

    if (nomeAtividade) {
      atividades = atividades.filter(atividade => atividade.nome === nomeAtividade);
    }

    if (!atividades || atividades.length === 0) {
      throw new Error('Nenhuma atividade encontrada para esta obra');
    }

    const dadosFormatados = atividades.map(atividade => ({
      'Obra': obraNome,
      'Nome da Atividade': atividade.nome,
      'Data': new Date(atividade.data).toLocaleDateString(),
      'Número de Operários': atividade.numeroOperarios,
      'Número de Ajudantes': atividade.numeroAjudantes ?? '',
      'Horas de Trabalho': atividade.horasTrabalho,
      'Quantidade Executada': atividade.quantidadeExecutada,
      'Local': atividade.local,
      'Observações': atividade.observacoes ?? ''
    }));

    const chaves = Object.keys(dadosFormatados[0]);
    const cabecalho = chaves.join(',');
    const linhas = dadosFormatados.map(obj =>
      chaves.map(k => `"${(obj[k] ?? '').toString().replace(/"/g, '""')}"`).join(',')
    );
    const csv = [cabecalho, ...linhas].join('\n');

    const fileName = `obra_${obraId}_atividades_${Date.now()}.csv`;
    const filePath = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(filePath, csv, {
      encoding: FileSystem.EncodingType.UTF8
    });

    await Sharing.shareAsync(filePath);
  } catch (error) {
    console.error('Erro ao gerar CSV:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
    throw error;
  }
};

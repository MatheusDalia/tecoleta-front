import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as XLSX from 'xlsx';
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
  // Adicione aqui os campos do FinalServicoScreen
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
    // Converter a data para o formato ISO
    const dataFormatada = new Date().toISOString(); // Por enquanto usando data atual
    console.log("Data formatada:", data);
    // Preparar dados para o formato da tabela Atividade
    const atividadeData: AtividadeData = {
      obra: data.obra,
      nome: data.servico,
      data: dataFormatada,
      numeroOperarios: Number(data.oficiais),
      numeroAjudantes: Number(data.ajudantes), // Adicionando valor default
      horasTrabalho: Number(data.horas),
      quantidadeExecutada: Number(data.quantidade),
      local: data.local || 'Local não especificado',
      observacoes: data.observacao || '',
      obraId: obraId
    };

    console.log('Dados completos recebidos:', data);
    console.log('Dados formatados para API:', atividadeData);
    console.log('Tipo da data:', typeof atividadeData.data);
    console.log('Tipo do local:', typeof atividadeData.local);

    // Validar dados antes de enviar
    if (!atividadeData.obra || !atividadeData.nome || !atividadeData.data || !atividadeData.numeroOperarios || 
        !atividadeData.horasTrabalho || !atividadeData.quantidadeExecutada || !atividadeData.obraId ||
        !atividadeData.local) {
      throw new Error('Dados incompletos: ' + JSON.stringify(atividadeData));
    }

    // Garantir que todos os campos obrigatórios estão presentes e não são undefined
    const dadosParaAPI = {
      ...atividadeData,
      data: atividadeData.data || new Date().toISOString(),
      local: atividadeData.local || 'Local não especificado',
      observacoes: atividadeData.observacoes || ''
    };

    // Salvar no banco de dados via API
    const response = await api.post('/atividades', dadosParaAPI);
    console.log('Resposta da API:', response.data);

    // Salvar também no AsyncStorage para o Excel
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
    console.log('Iniciando geração do Excel para obra:', obraId);
    
    // Buscar dados do banco de dados via API
    const response = await api.get(`/atividades`, {
      params: { obraId }
    });

    const response2 = await api.get(`/obras/${obraId}`);
    const obraNome = response2.data.nome;
    
    let atividades = response.data;
    console.log('Número de atividades encontradas:', atividades);
    

    if (nomeAtividade) {
      atividades = atividades.filter(atividade => atividade.nome === nomeAtividade);
      console.log(`Atividades filtradas pelo nome "${nomeAtividade}":`, atividades.length);
    }  

    if (!atividades || atividades.length === 0) {
      throw new Error('Nenhuma atividade encontrada para esta obra');
    }

    // Formatar dados para o Excel
    const dadosFormatados = atividades.map(atividade => ({
      'Obra': obraNome,
      'Nome da Atividade': atividade.nome,
      'Data': new Date(atividade.data).toLocaleDateString(),
      'Número de Operários': atividade.numeroOperarios,
      'Número de Ajudantes': atividade.numeroAjudantes,
      'Horas de Trabalho': atividade.horasTrabalho,
      'Quantidade Executada': atividade.quantidadeExecutada,
      'Local': atividade.local,
      'Observações': atividade.observacoes
    }));

    // Criar workbook
    const ws = XLSX.utils.json_to_sheet(dadosFormatados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Atividades");

    if (Platform.OS === 'web') {
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      return blob;
    } else {
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const fileName = `obra_${obraId}_servicos_${Date.now()}.xlsx`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, wbout, {
        encoding: FileSystem.EncodingType.Base64
      });
      await Sharing.shareAsync(filePath);
    }
  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
    throw error;
  }
}; 
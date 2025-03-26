import api from '../api';

// Corrigindo a URL da API
const API_URL = 'https://tecoleta.tecomat.com.br/api/obras';
const API_USUARIOS_URL = 'https://tecoleta.tecomat.com.br/api/usuarios';

// Função para buscar obras
export const fetchObras = async (userId: number) => {
  try {
    const response = await api.get('/obras');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar obras:', error);
    throw error;
  }
};

// Função para buscar usuários
export const fetchUsuarios = async () => {
  try {
    const response = await api.get('/usuarios');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// Função para criar ou atualizar uma obra
export const createOrUpdateObra = async (
  id: number | null,
  nome: string,
  colaboradores: number[],
  userId: number
) => {
  try {
    console.log('Enviando requisição para:', id ? `/obras/${id}` : '/obras');
    console.log('Dados:', { nome, colaboradores, userId });

    if (id) {
      // Atualizar obra existente
      const response = await api.put(`/obras/${id}`, {
        nome,
        colaboradores,
        userId
      });
      return response.data;
    } else {
      // Criar nova obra
      const response = await api.post('/obras', {
        nome,
        colaboradores,
        userId
      });
      return response.data;
    }
  } catch (error) {
    console.error('Erro detalhado:', error.response?.data);
    throw error;
  }
};
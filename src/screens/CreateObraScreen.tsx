import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image
} from 'react-native';
import Toast from 'react-native-toast-message';
import styles from './styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import logoBranca from '../../assets/iejc-horizontal-branco.png';
import logoBranca2 from '../../assets/tecoletaBranco.png';

type RootStackParamList = {
  ObrasScreen: undefined;
  ObraDetails: { obraId: number };
  Login: undefined;
  CreateObra: { obraId?: number };
};

type CreateObraScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'CreateObra'>;
};

type Colaborador = {
  id: number;
  email: string;
};

const CreateObraScreen = ({ navigation, route }: CreateObraScreenProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [obraName, setObraName] = useState('');
  const [selectedObra, setSelectedObra] = useState<number | null>(null);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [emailInput, setEmailInput] = useState('');

  const { obraId } = route.params || {};

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      // Se estiver editando uma obra existente
      if (obraId) {
        try {
          console.log('Carregando obra:', obraId);
          const obraResponse = await api.get(`/obras/${obraId}`);
          const obra = obraResponse.data;
          console.log('Dados da obra carregados:', obra);
          
          setObraName(obra.nome);
          setSelectedObra(obraId);
          
          // Verificar se há colaboradores e setá-los
          if (obra.colaboradores) {
            console.log('Colaboradores encontrados:', obra.colaboradores);
            setColaboradores(obra.colaboradores);
          }
        } catch (error) {
          console.error('Erro ao carregar detalhes da obra:', error);
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Não foi possível carregar os detalhes da obra',
            position: 'bottom'
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao carregar dados. Tente novamente mais tarde.',
        position: 'bottom'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateObra = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Usuário não autenticado',
        position: 'bottom'
      });
      return;
    }

    if (!obraName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'O nome da obra não pode estar vazio.',
        position: 'bottom'
      });
      return;
    }

    try {
      // Extrair apenas os IDs dos colaboradores para enviar ao servidor
      const colaboradoresIds = colaboradores.map(colab => colab.id);
      
      console.log('Enviando dados:', {
        id: selectedObra,
        nome: obraName,
        colaboradores: colaboradoresIds,
        userId: user.id
      });
      
      const response = await api.post('/obras', {
        id: selectedObra,
        nome: obraName,
        colaboradores: colaboradoresIds,
        userId: user.id
      });

      console.log('Resposta do servidor:', response.data);
      
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: obraId ? 'Obra atualizada com sucesso!' : 'Obra criada com sucesso!',
        position: 'bottom'
      });
      
      setObraName('');
      setSelectedObra(null);
      setColaboradores([]);
      navigation.navigate('ObrasScreen');
    } catch (error: any) {
      console.error('Erro ao criar/editar obra:', error);
      console.log('Erro detalhado:', error.response?.data);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.response?.data?.message || 'Erro ao criar/editar obra',
        position: 'bottom'
      });
    }
  };

  const handleAddColaborador = async () => {
    if (!emailInput.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Por favor, digite um email válido',
        position: 'bottom'
      });
      return;
    }

    // Verificar se o email já foi adicionado
    if (colaboradores.some(colab => colab.email === emailInput)) {
      Toast.show({
        type: 'info',
        text1: 'Aviso',
        text2: 'Este colaborador já foi adicionado',
        position: 'bottom'
      });
      return;
    }

    try {
      // Verificar se o usuário existe no sistema
      const response = await api.get(`/usuarios/por-email?email=${emailInput}`);
      
      if (response.data && response.data.id) {
        // O usuário existe
        if (response.data.id === user?.id) {
          Toast.show({
            type: 'info',
            text1: 'Aviso',
            text2: 'Você não pode adicionar a si mesmo como colaborador',
            position: 'bottom'
          });
          return;
        }

        // Adicionar à lista de colaboradores
        setColaboradores(prev => [
          ...prev, 
          { id: response.data.id, email: response.data.email }
        ]);
        
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Colaborador adicionado com sucesso!',
          position: 'bottom'
        });
        
        // Limpar o campo de input
        setEmailInput('');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Usuário não encontrado',
          position: 'bottom'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Usuário não encontrado no sistema',
        position: 'bottom'
      });
    }
  };

  const removeColaborador = (id: number) => {
    setColaboradores(prev => prev.filter(colab => colab.id !== id));
    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Colaborador removido com sucesso!',
      position: 'bottom'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={logoBranca2} style={styles.logoBranca} />
          <Image source={logoBranca} style={styles.logoBranca} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{obraId ? 'Editar Obra' : 'Criar Obra'}</Text>
        <TextInput
          style={styles.input}
          placeholder={obraId ? obraName || 'Nome da obra' : 'Nome da obra'}
          value={obraName}
          onChangeText={setObraName}
        />

        <Text style={styles.title}>Adicionar Colaboradores</Text>
        <View style={styles.emailInputContainer}>
          <TextInput
            style={styles.emailInput}
            placeholder="Digite o email do colaborador"
            value={emailInput}
            onChangeText={setEmailInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddColaborador}
          >
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {colaboradores.length > 0 ? (
              <View style={styles.colaboradoresList}>
                <Text style={styles.subtitle}>Colaboradores:</Text>
                {colaboradores.map(colab => (
                  <View key={colab.id} style={styles.colaboradorItem}>
                    <Text style={styles.colaboradorText}>{colab.email}</Text>
                    <TouchableOpacity 
                      onPress={() => removeColaborador(colab.id)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noColabsText}>Nenhum colaborador adicionado</Text>
            )}
          </>
        )}

        <TouchableOpacity 
          style={[
            styles.createButton,
            !obraName.trim() && styles.disabledButton
          ]} 
          onPress={handleCreateOrUpdateObra}
          disabled={!obraName.trim()}
        >
          <Text style={styles.createButtonText}>{obraId ? 'Salvar' : 'Criar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ObrasScreen')}>
          <Text style={styles.createButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateObraScreen;
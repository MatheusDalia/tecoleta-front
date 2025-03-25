import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import styles from './styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { fetchObras, fetchUsuarios, createOrUpdateObra } from '../services/obraService';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

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

const CreateObraScreen = ({ navigation, route }: CreateObraScreenProps) => {
  const { user } = useAuth();
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [obraName, setObraName] = useState('');
  const [selectedObra, setSelectedObra] = useState<number | null>(null);
  const [usuarios, setUsuarios] = useState([]);
  const [colaboradoresSelecionados, setColaboradoresSelecionados] = useState<number[]>([]);
  const [userId, setUserId] = useState(1); // Defina o userId corretamente (pode vir do contexto de autenticação)

  const { obraId } = route.params || {};

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar usuários primeiro
      try {
        const usuariosResponse = await api.get('/usuarios');
        console.log('Usuários carregados:', usuariosResponse.data);
        setUsuarios(usuariosResponse.data);
      } catch (usuariosError) {
        console.error('Erro ao carregar usuários:', usuariosError);
        setUsuarios([]);
      }

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
            // Garantir que estamos pegando os IDs corretamente
            const colaboradoresIds = obra.colaboradores.map((colab: any) => colab.id);
            console.log('IDs dos colaboradores:', colaboradoresIds);
            setColaboradoresSelecionados(colaboradoresIds);
          }
        } catch (error) {
          console.error('Erro ao carregar detalhes da obra:', error);
          Alert.alert('Erro', 'Não foi possível carregar os detalhes da obra');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Erro ao carregar dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateObra = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    if (!obraName.trim()) {
      Alert.alert('Erro', 'O nome da obra não pode estar vazio.');
      return;
    }

    try {
      console.log('Enviando dados:', {
        id: selectedObra,
        nome: obraName,
        colaboradores: colaboradoresSelecionados,
        userId: user.id
      });
      
      const response = await api.post('/obras', {
        id: selectedObra,
        nome: obraName,
        colaboradores: colaboradoresSelecionados,
        userId: user.id
      });

      console.log('Resposta do servidor:', response.data);
      
      setObraName('');
      setSelectedObra(null);
      setColaboradoresSelecionados([]);
      navigation.navigate('ObrasScreen');
    } catch (error: any) {
      console.error('Erro ao criar/editar obra:', error);
      console.log('Erro detalhado:', error.response?.data);
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao criar/editar obra');
    }
  };

  const renderUsuarioItem = ({ item }: any) => {
    if (item.id === user?.id) return null;

    const isSelected = colaboradoresSelecionados.includes(item.id);
    console.log(`Usuário ${item.email} (ID: ${item.id}) - Selecionado: ${isSelected}`);

    return (
      <TouchableOpacity
        style={[
          styles.userItem,
          isSelected && styles.selectedUserItem
        ]}
        onPress={() => {
          setColaboradoresSelecionados((prev) =>
            prev.includes(item.id)
              ? prev.filter((id) => id !== item.id)
              : [...prev, item.id]
          );
        }}
      >
        <Text style={[
          styles.userText,
          isSelected && styles.selectedUserText
        ]}>
          {item.email}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{obraId ? 'Editar Obra' : 'Criar Obra'}</Text>
        <TextInput
          style={styles.input}
          placeholder={obraId ? obraName || 'Nome da obra' : 'Nome da obra'}
          value={obraName}
          onChangeText={setObraName}
        />

        <Text style={styles.title}>Selecionar Colaboradores</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {usuarios.length > 1 ? (
              <FlatList
                data={usuarios}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={renderUsuarioItem}
                style={styles.userList}
              />
            ) : (
              <Text style={styles.noUsersText}>Não há outros usuários disponíveis</Text>
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
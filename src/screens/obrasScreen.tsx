import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Linking,
  Platform
} from 'react-native';
import styles from './styles';
import { NavigationProp } from '@react-navigation/native';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Menu, Provider as PaperProvider } from 'react-native-paper';
import { generateExcel } from '../services/excelService';

type RootStackParamList = {
  ObrasScreen: undefined;
  ObraDetails: { obraId: number };
  Login: undefined;
  CreateObra: { obraId?: number };
  ViewColaboradores: { obraId: number };
  EscolhaServicoScreen: { obraId: number };
};

type ObrasScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

const ObrasScreen = ({ navigation }: ObrasScreenProps) => {
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isColaboradoresVisible, setIsColaboradoresVisible] = useState(false);
  const [colaboradores, setColaboradores] = useState([]);
  const { user } = useAuth();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [obraToDelete, setObraToDelete] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [servicos, setServicos] = useState<any[]>([]);
  const [selectedServico, setSelectedServico] = useState<string | null>(null);
  const [isServicoModalVisible, setIsServicoModalVisible] = useState(false);
  const [selectedObraId, setSelectedObraId] = useState<number | null>(null);
  
  const fetchAtividades = async () => {
    try {
      const response = await api.get('/atividades');
      if (!response.data) {
        throw new Error('Nenhuma atividade encontrada');
      }
  
      const atividades = response.data;
      
      // Extrair apenas os nomes únicos de serviços
      const uniqueServiceNames = [...new Set(atividades.map((atividade: any) => atividade.nome))];
      
      // Criar um array de nomes de serviços únicos
      const uniqueServices = uniqueServiceNames.map(nome => ({
        nome: nome
      }));
      
      setServicos(uniqueServices);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      Alert.alert('Erro', 'Não foi possível carregar os serviços.');
    }
  };
  
  const handleSelectServico = (servicoNome: string) => {
    setSelectedServico(servicoNome);
  };

  // Função de download atualizada para usar apenas o nome do serviço
  const handleDownloadServico = async () => {
    if (!selectedServico) {
      Alert.alert('Erro', 'Selecione um serviço para baixar.');
      return;
    }
    
    try {
      if (Platform.OS === 'web') {
        // Código para web usando generateExcel do excelService
        const blob = await generateExcel(selectedObraId, selectedServico);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `servico_${selectedServico}_${Date.now()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Para dispositivos móveis, use o generateExcel do excelService
        await generateExcel(selectedObraId, selectedServico);
      }
      
      // Feche o modal após o download
      setIsServicoModalVisible(false);
      setSelectedServico(null);
      
    } catch (error) {
      console.error('Erro ao baixar o serviço:', error);
      Alert.alert('Erro', 'Não foi possível baixar o serviço.');
    }
  };

  useEffect(() => {
    const loadObras = async () => {
      try {
        if (!user) return;
        
        let response;

        console.log('Qual o role?:' + JSON.stringify(user, null, 2));
        
        // Verificar se o usuário tem o role 'tecomat'
        if (user.role === 'tecomat') {
          // Buscar todas as obras de todos os usuários
          response = await api.get(`/obras`);
          console.log('Resposta da API para tecomat:', response.data); // Depuração
        } else {
          // Buscar apenas as obras do usuário logado
          response = await api.get(`/obras/user/${user.id}`);
          console.log('Resposta da API para usuário comum:', response.data); // Depuração
        }
        
        if (Array.isArray(response.data)) {
          setObras(response.data);
        } else {
          console.error('Resposta não é um array:', response.data);
          setObras([]);
        }
      } catch (error) {
        console.error('Erro ao buscar obras:', error);
        setObras([]);
      } finally {
        setLoading(false);
      }
    };

    loadObras();
  }, [user]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const handleViewColaboradores = async (obraId: number) => {
    try {
      const response = await api.get(`/obras/${obraId}`);
      const obra = response.data;
      
      const colaboradoresData = obra.colaboradores || [];
      
      setColaboradores(colaboradoresData);
      setIsColaboradoresVisible(true);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      Alert.alert('Erro', 'Erro ao carregar colaboradores. Tente novamente mais tarde.');
    }
  };

  const handleCreateObra = () => {
    navigation.navigate('CreateObra');
  };

  const handleDeleteObra = (id: number) => {
    setObraToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!obraToDelete) return;
    
    try {
      await api.delete(`/obras/${obraToDelete}`, {
        data: { userId: user.id }
      });
      
      setObras(prevObras => prevObras.filter((obra: any) => obra.id !== obraToDelete));
      setIsDeleteModalVisible(false);
      setObraToDelete(null);
    } catch (error) {
      console.error('Delete operation failed:', error);
      Alert.alert('Erro', 'Não foi possível excluir a obra.');
    }
  };

  const handleAddColaborador = (obraId: number) => {
    navigation.navigate('CreateObra', { obraId });
  };

  const handleNavigateToServicos = (obraId: number) => {
    navigation.navigate('EscolhaServicoScreen', { obraId });
  };

  const handleOpenServicosModal = (obraId: number) => {
    setSelectedObraId(obraId);
    fetchAtividades();
    setIsServicoModalVisible(true);
  };

  const openMenu = (obraId: number) => setMenuVisible(obraId);
  const closeMenu = () => setMenuVisible(null);

  // Verificar se o usuário tem permissão para editar uma obra
  const canEditObra = (obra: any) => {
    return obra.userId === user.id || user.role === 'tecomat';
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header} />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>
              {user.role === 'tecomat' ? 'Todas as Obras:' : 'Selecione a obra:'}
            </Text>
            <View style={styles.cardsContainer}>
              {Array.isArray(obras) && obras.length > 0 ? (
                obras.map((obra: any) => (
                  <View key={obra.id} style={styles.cardContainer}>
                    <TouchableOpacity
                      style={styles.card}
                      onPress={() => handleNavigateToServicos(obra.id)}
                    >
                      <Text style={styles.cardTitle}>{obra.nome}</Text>
                      
                      
                      <Menu
                        visible={menuVisible === obra.id}
                        onDismiss={closeMenu}
                        anchor={
                          <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => openMenu(obra.id)}
                          >
                            <Text style={styles.menuDots}>⋮</Text>
                          </TouchableOpacity>
                        }
                      >
                        {canEditObra(obra) && (
                          <>
                            <Menu.Item
                              onPress={() => {
                                closeMenu();
                                handleOpenServicosModal(obra.id);
                              }}
                              title="Download de Planilhas"
                            />
                            <Menu.Item
                              onPress={() => {
                                closeMenu();
                                handleDeleteObra(obra.id);
                              }}
                              title="Excluir"
                            />
                            <Menu.Item
                              onPress={() => {
                                closeMenu();
                                handleAddColaborador(obra.id);
                              }}
                              title="Adicionar Colaborador"
                            />
                          </>
                        )}
                        <Menu.Item
                          onPress={() => {
                            closeMenu();
                            handleViewColaboradores(obra.id);
                          }}
                          title="Ver Colaboradores"
                        />
                      </Menu>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>Nenhuma obra encontrada</Text>
              )}
            </View>
  
            <TouchableOpacity style={styles.createButton} onPress={handleCreateObra}>
              <Text style={styles.createButtonText}>+ Criar Obra</Text>
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        <View style={styles.footer} />
  
        {/* Modal para exibir colaboradores */}
        <Modal
          visible={isColaboradoresVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsColaboradoresVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Colaboradores</Text>
              {colaboradores.length > 0 ? (
                colaboradores.map((colaborador: any) => (
                  <View key={colaborador.id} style={styles.colaboradorItem}>
                    <Text style={styles.colaboradorText}>{colaborador.email}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noColaboradoresText}>Nenhum colaborador cadastrado</Text>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsColaboradoresVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Delete Confirmation Modal */}
        <Modal
          visible={isDeleteModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsDeleteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
              <Text style={styles.modalText}>Tem certeza que deseja excluir esta obra?</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsDeleteModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={handleDeleteConfirmed}
                >
                  <Text style={styles.modalButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Serviços - Simplificado para mostrar apenas os nomes dos serviços */}
        <Modal
          visible={isServicoModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setIsServicoModalVisible(false);
            setSelectedServico(null);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione um Serviço</Text>
              <ScrollView style={styles.servicesScrollView}>
                {servicos.length > 0 ? (
                  servicos.map((servico) => (
                    <TouchableOpacity
                      key={servico.nome}
                      style={[
                        styles.serviceItem,
                        selectedServico === servico.nome && styles.selectedServiceItem
                      ]}
                      onPress={() => handleSelectServico(servico.nome)}
                    >
                      <Text style={styles.serviceText}>{servico.nome}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noServicesText}>Nenhum serviço disponível</Text>
                )}
              </ScrollView>

              <TouchableOpacity
                style={[
                  styles.downloadServiceButton,
                  !selectedServico && styles.disabledButton
                ]}
                onPress={handleDownloadServico}
                disabled={!selectedServico}
              >
                <Text style={styles.downloadButtonText}>Baixar Planilha</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setIsServicoModalVisible(false);
                  setSelectedServico(null);
                }}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default ObrasScreen;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import styles from './styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { saveFinalServicoData, generateExcel } from '../services/excelService';
import api from '../api';

type RootStackParamList = {
  ObrasScreen: undefined;
  ProximoPasso: undefined;
  EscolhaServicoScreen: { obraId: number };
  LocalServicoScreen: { 
    obraId: number;
    servicoData: any;
  };
  FinalServicoScreen: {
    obraId: number;
    servicoData: any;
    dataLocal: {
      data: Date;
      local: string;
    };
  };
};

type FinalServicoScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'FinalServicoScreen'>;
};

const FinalServicoScreen = ({ navigation, route }: FinalServicoScreenProps) => {
  const { obraId, servicoData, dataLocal } = route.params;
  const [oficiais, setOficiais] = useState("");
  const [ajudantes, setAjudantes] = useState("");
  const [horas, setHoras] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [obraNome, setObraNome] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const carregarObra = async () => {
      try {
        const response = await api.get(`/obras/${obraId}`);
        setObraNome(response.data.nome);
      } catch (error) {
        console.error('Erro ao carregar obra:', error);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes da obra');
      }
    };

    carregarObra();
  }, [obraId]);

  const isActionEnabled = oficiais && horas && quantidade;

  // Função para preparar os dados a serem salvos
  const prepareDataToSave = () => {
    return {
      quantidade: Number(quantidade),
      data: dataLocal.data.toISOString(),
      oficiais: Number(oficiais),
      ajudantes: ajudantes.trim() !== "" ? Number(ajudantes) : 0, // Evita string vazia
      horas: Number(horas),
      local: dataLocal.local,
      servico: servicoData.servico,
      unidade: servicoData.unidade,
      observacao: servicoData.observacao || '',
      obraId: obraId,
      obra: obraNome,
      timestamp: new Date().toISOString(),
    };
  };

  // Função para apenas salvar os dados
  const handleSave = async () => {
    if (!isActionEnabled) return;

    try {
      const dadosParaSalvar = prepareDataToSave();
      console.log("Enviando dados para salvamento:", dadosParaSalvar);
      
      await saveFinalServicoData(obraId, dadosParaSalvar);
      
      // Navega diretamente para a tela EscolhaServicoScreen sem mostrar Alert
      navigation.navigate('EscolhaServicoScreen', { obraId });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível salvar o registro');
    }
  };

  // Função para salvar e baixar o Excel
  const handleSaveAndDownload = async () => {
    if (!isActionEnabled) return;

    try {
      const dadosParaSalvar = prepareDataToSave();
      console.log("Enviando dados para salvamento e download:", dadosParaSalvar);
      
      await saveFinalServicoData(obraId, dadosParaSalvar);

      if (Platform.OS === 'web') {
        const blob = await generateExcel(obraId, servicoData.servico);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `obra_${obraId}_servicos_${Date.now()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        await generateExcel(obraId, servicoData.servico);
      }

      // Navega para a tela EscolhaServicoScreen após o download
      navigation.navigate('EscolhaServicoScreen', { obraId });
    } catch (error) {
      console.error('Erro ao salvar e baixar:', error);
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível completar a operação');
    }
  };

  // Função para rolar até o final da página
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Função para rolar até o topo da página
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  // Efeito para adicionar os botões de scroll no web
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Adiciona os botões de scroll apenas no ambiente web
      const addScrollButtons = () => {
        // Botão de scroll para baixo
        if (!document.getElementById('scroll-to-bottom-btn')) {
          const bottomButton = document.createElement('button');
          bottomButton.id = 'scroll-to-bottom-btn';
          bottomButton.innerHTML = '↓';
          bottomButton.style.position = 'fixed';
          bottomButton.style.bottom = '20px';
          bottomButton.style.right = '20px';
          bottomButton.style.width = '40px';
          bottomButton.style.height = '40px';
          bottomButton.style.borderRadius = '50%';
          bottomButton.style.backgroundColor = '#4D82B8';
          bottomButton.style.color = 'white';
          bottomButton.style.fontSize = '20px';
          bottomButton.style.border = 'none';
          bottomButton.style.cursor = 'pointer';
          bottomButton.style.zIndex = '1000';
          bottomButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
          
          bottomButton.onclick = () => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
          };
          
          document.body.appendChild(bottomButton);
        }

        // Botão de scroll para cima
        if (!document.getElementById('scroll-to-top-btn')) {
          const topButton = document.createElement('button');
          topButton.id = 'scroll-to-top-btn';
          topButton.innerHTML = '↑';
          topButton.style.position = 'fixed';
          topButton.style.bottom = '70px'; // Posicionado acima do botão de scroll para baixo
          topButton.style.right = '20px';
          topButton.style.width = '40px';
          topButton.style.height = '40px';
          topButton.style.borderRadius = '50%';
          topButton.style.backgroundColor = '#4D82B8';
          topButton.style.color = 'white';
          topButton.style.fontSize = '20px';
          topButton.style.border = 'none';
          topButton.style.cursor = 'pointer';
          topButton.style.zIndex = '1000';
          topButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
          
          topButton.onclick = () => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          };
          
          document.body.appendChild(topButton);
        }
      };

      addScrollButtons();

      // Limpa os botões quando o componente for desmontado
      return () => {
        const bottomButton = document.getElementById('scroll-to-bottom-btn');
        if (bottomButton) {
          bottomButton.remove();
        }
        
        const topButton = document.getElementById('scroll-to-top-btn');
        if (topButton) {
          topButton.remove();
        }
      };
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.content2}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Projeto <Text style={styles.bold}>{obraNome}</Text>
        </Text>
        
        <Text style={styles.subtitle}>Serviço: {servicoData.servico}</Text>
        <Text style={styles.subtitle}>Unidade: {servicoData.unidade}</Text>

        <Text style={styles.label}>N° de Oficiais:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o número de oficiais"
          value={oficiais}
          onChangeText={setOficiais}
          keyboardType="numeric"
        />

        <Text style={styles.label}>N° de Ajudantes (opcional):</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o número de ajudantes"
          value={ajudantes}
          onChangeText={setAjudantes}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Horas:</Text>
        <TextInput
          style={styles.input}
          placeholder="0 a 24h"
          value={horas}
          onChangeText={setHoras}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Quantidade:</Text>
        <TextInput
          style={styles.input}
          placeholder={`1,2,3... (${servicoData.unidade})`}
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.navigate("LocalServicoScreen", { obraId, servicoData })}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isActionEnabled ? styles.nextButton : styles.disabledButton]}
            onPress={handleSaveAndDownload}
            disabled={!isActionEnabled}
          >
            <Text style={styles.buttonText}>Salvar e Baixar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button, 
              isActionEnabled ? {...styles.nextButton, backgroundColor: '#2a6099'} : styles.disabledButton
            ]}
            onPress={handleSave}
            disabled={!isActionEnabled}
          >
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.footer} />
    </View>
  );
};

export default FinalServicoScreen;
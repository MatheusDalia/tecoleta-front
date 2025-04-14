// LocalServicoScreen.tsx - Nova tela para data e local
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  Image
} from 'react-native';
import styles from './styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import api from '../api';
import logoBranca from '../../assets/iejc-horizontal-branco.png';
import logoBranca2 from '../../assets/tecoletaBranco.png';

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

type LocalServicoScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'LocalServicoScreen'>;
};

const LocalServicoScreen = ({ navigation, route }: LocalServicoScreenProps) => {
  const { obraId, servicoData } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [local, setLocal] = useState("");
  const [obraNome, setObraNome] = useState("");

  const onChange = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

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

  const isNextEnabled = !!selectedDate;



  const handleNext = () => {
    if (!isNextEnabled) return;

    // Navega para a tela final com os dados já preenchidos
    navigation.navigate('FinalServicoScreen', { 
      obraId, 
      servicoData,
      dataLocal: {
        data: selectedDate,
        local: local.trim() || "", // Se local estiver vazio, envia uma string vazia
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={logoBranca2} style={styles.logoBranca} />
          <Image source={logoBranca} style={styles.logoBranca} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content2}>
        <Text style={styles.title}>
          <Text style={styles.bold}>{obraNome}</Text>
        </Text>
        
        <Text style={styles.subtitle}>Serviço: {servicoData.servico}</Text>
        <Text style={styles.subtitle}>Unidade: {servicoData.unidade}</Text>

        <Text style={styles.label}>Data:</Text>

        <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
          }}
        >
          <Text>{selectedDate.toLocaleDateString('pt-BR')}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
          />
        )}
      </View>

        <Text style={styles.label}>Local(Opcional):</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o local"
          value={local}
          onChangeText={setLocal}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.navigate("EscolhaServicoScreen", { obraId })}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isNextEnabled ? styles.nextButton : styles.disabledButton]}
            onPress={handleNext}
            disabled={!isNextEnabled}
          >
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.footer} />
    </View>
  );
};

export default LocalServicoScreen;
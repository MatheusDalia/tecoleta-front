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
  const [selectedData, setSelectedData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [local, setLocal] = useState("");
  const [obraNome, setObraNome] = useState("");

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

  const isNextEnabled = !!selectedData;

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || selectedData;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedData(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleNext = () => {
    if (!isNextEnabled) return;

    // Navega para a tela final com os dados já preenchidos
    navigation.navigate('FinalServicoScreen', { 
      obraId, 
      servicoData,
      dataLocal: {
        data: selectedData,
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
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={selectedData.toISOString().split('T')[0]}
            onChange={(e) => setSelectedData(new Date(e.target.value))}
            style={{
              padding: 15,
              fontSize: 16,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#ddd',
              marginBottom: 15,
              width: '100%',
            }}
          />
        ) : (
          <>
            <TouchableOpacity 
              style={styles.input}
              onPress={showDatepicker}
            >
              <Text>{selectedData.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedData}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onDateChange}
              />
            )}
          </>
        )}

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
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import styles from './styles';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import api from '../api';
import { saveServicoData } from '../services/excelService';
import logoBranca from '../../assets/iejc-horizontal-branco.png';
import logoBranca2 from '../../assets/tecoletaBranco.png';

type RootStackParamList = {
  ObrasScreen: undefined;
  ProximoPasso: undefined;
  EscolhaServicoScreen: { obraId: number };
  LocalServicoScreen: { obraId: number; servicoData: any };
};

type EscolhaServicoScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'EscolhaServicoScreen'>;
};

const serviceUnits: Record<string, string> = {
  "Cerâmica externa": "m²",
  "Cerâmica interna": "m²",
  "Contrapiso": "m²",
  "Drywall - 01ª Etapa": "m²",
  "Drywall - 02ª Etapa": "m²",
  "Drywall - 03ª Etapa": "m²",
  "Elevação de alvenaria": "m²",
  "Emboço externo": "m²",
  "Emboço interno": "m²",
  "Forro de gesso": "m²",
  "Gesso em pasta": "m²",
  "Parede de concreto - Armação": "kg",
  "Parede de concreto - Concreto": "m³",
  "Parede de concreto - Forma": "m²",
  "Pintura": "m²",
};

const EscolhaServicoScreen = ({ navigation, route }: EscolhaServicoScreenProps) => {
  const { obraId } = route.params;
  const [selectedService, setSelectedService] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [observation, setObservation] = useState("");
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

  useEffect(() => {
    if (selectedService) {
      setSelectedUnit(serviceUnits[selectedService] || "");
    } else {
      setSelectedUnit("");
    }
  }, [selectedService]);

  const isNextEnabled = selectedService !== "";

  const handleNext = async () => {
    if (!isNextEnabled) return;

    const servicoData = {
      obraId,
      obra: obraNome,
      servico: selectedService,
      unidade: selectedUnit,
      observacao: observation,
      timestamp: new Date().toISOString(),
    };

    try {
      await saveServicoData(servicoData);
      navigation.navigate("LocalServicoScreen", { obraId, servicoData });
    } catch (error) {
      console.error('Erro ao salvar dados do serviço:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados do serviço');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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

        <Text style={styles.label}>Selecione o serviço:</Text>
        <Picker
          selectedValue={selectedService}
          onValueChange={(itemValue) => setSelectedService(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione..." value="" />
          {Object.keys(serviceUnits).map((service) => (
            <Picker.Item key={service} label={service} value={service} />
          ))}
        </Picker>

        <Text style={styles.label}>Unidade de medida:</Text>
        <Text style={styles.unitText}>{selectedUnit || "Selecione um serviço"}</Text>

        <Text style={styles.label}>Observação:</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={observation}
          onChangeText={setObservation}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.navigate("ObrasScreen")}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isNextEnabled ? styles.nextButton : styles.disabledButton]}
            onPress={handleNext}
            disabled={!isNextEnabled}
          >
            <Text style={styles.buttonText}>Avançar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

export default EscolhaServicoScreen;

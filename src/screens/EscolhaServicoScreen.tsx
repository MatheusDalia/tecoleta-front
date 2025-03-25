import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import styles from './styles';
import {useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import api from '../api';
import { saveServicoData } from '../services/excelService';

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

  const isNextEnabled = selectedService && selectedUnit;

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
      navigation.navigate("LocalServicoScreen", {
        obraId,
        servicoData
      });
    } catch (error) {
      console.error('Erro ao salvar dados do serviço:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados do serviço');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.header} />
     <ScrollView contentContainerStyle={styles.content2}>
      <Text style={styles.title}>
        Projeto <Text style={styles.bold}>{obraNome}</Text>
      </Text>

      <Text style={styles.label}>Selecione o serviço:</Text>
      <Picker
        selectedValue={selectedService}
        onValueChange={(itemValue) => setSelectedService(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione..." value="" />
        <Picker.Item label="1. Cerâmica externa (m²)" value="Cerâmica externa" />
        <Picker.Item label="2. Cerâmica interna (m²)" value="Cerâmica interna" />
        <Picker.Item label="3. Contrapiso (m²)" value="Contrapiso" />
        <Picker.Item label="4. Drywall - 01ª Etapa (m²)" value="Drywall - 01ª Etapa" />
        <Picker.Item label="5. Drywall - 02ª Etapa (m²)" value="Drywall - 02ª Etapa" />
        <Picker.Item label="6. Drywall - 03ª Etapa (m²)" value="Drywall - 03ª Etapa" />
        <Picker.Item label="7. Elevação de alvenaria (m²)" value="Elevação de alvenaria" />
        <Picker.Item label="8. Emboço externo (m²)" value="Emboço externo" />
        <Picker.Item label="9. Emboço interno (m²)" value="Emboço interno" />
        <Picker.Item label="10. Forro de gesso (m²)" value="Forro de gesso" />
        <Picker.Item label="11. Gesso em pasta (m²)" value="Gesso em pasta" />
        <Picker.Item label="12. Parede de concreto - Armação (kg)" value="Parede de concreto - Armação" />
        <Picker.Item label="13. Parede de concreto - Concreto (m³)" value="Parede de concreto - Concreto" />
        <Picker.Item label="14. Parede de concreto - Forma (m²)" value="Parede de concreto - Forma" />
        <Picker.Item label="15. Pintura (m²)" value="Pintura" />
      </Picker>

      <Text style={styles.label}>Unidade de medida:</Text>
      <Picker
        selectedValue={selectedUnit}
        onValueChange={(itemValue) => setSelectedUnit(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione..." value="" />
        <Picker.Item label="m²" value="m²" />
        <Picker.Item label="m³" value="m³" />
        <Picker.Item label="kg" value="kg" />
      </Picker>

      <Text style={styles.label}>Observação:</Text>
      <TextInput
        style={styles.input}
        placeholder="Norma, requisito..."
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
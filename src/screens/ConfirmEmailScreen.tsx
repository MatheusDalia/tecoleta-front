import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api';

const ConfirmEmailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = route.params || {}; // Captura o token da rota

  useEffect(() => {
    if (token) {
      api.get(`/confirmar-email?token=${token}`)
        .then(response => {
          if (response.data.success) {
            // Email confirmado com sucesso
            navigation.navigate('Login');
          } else {
            console.error('Erro ao confirmar email:', response.data.message);
          }
        })
        .catch(error => console.error('Erro ao confirmar email:', error));
    }
  }, [token]);

  return <Text>Confirmando email...</Text>;
};

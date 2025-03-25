import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/signUpScreen';
import ObrasScreen from './src/screens/obrasScreen';
import EscolhaServicoScreen from './src/screens/EscolhaServicoScreen';
import FinalServicoScreen from './src/screens/FinalServicoScreen';
import Toast from 'react-native-toast-message';
import CreateObraScreen from './src/screens/CreateObraScreen';
import { AuthProvider } from './src/contexts/AuthContext';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import LocalServicoScreen from './src/screens/LocalServicoScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false }} // Desativa o header para todas as telas
        >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ObrasScreen" component={ObrasScreen} />
        <Stack.Screen name="EscolhaServicoScreen" component={EscolhaServicoScreen} />
        <Stack.Screen name="LocalServicoScreen" component={LocalServicoScreen} />
        <Stack.Screen name="FinalServicoScreen" component={FinalServicoScreen} />
        <Stack.Screen name="CreateObra" component={CreateObraScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;

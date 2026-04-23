import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';



export default function PokemonCameraScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const cameraRef = useRef<React.ComponentRef<typeof CameraView> | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PokemonCamera'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PokemonCamera'>>();
  const { id } = route.params;

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Carregando permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Precisamos da permissão da câmera.</Text>
        <TouchableOpacity style={styles.actionButton} onPress={requestPermission}>
          <Text style={styles.actionText}>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

 async function handleTakePhoto() {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.7,
      skipProcessing: true,
      base64: true, 
    });

     if (photo) {
      console.log('PHOTO_RESULT (pokemon id = ' + id + '):', photo);

      const state = navigation.getState();
      const previousRoutes = state.routes.slice(0, -2);

      navigation.dispatch(
        CommonActions.reset({
          ...state,
          routes: [
            ...previousRoutes,
            {
              name: 'PokemonDetail',
              params: { id, photoUri: photo.uri, base64: photo.base64 },
            },
          ],
          index: previousRoutes.length,
        }),
      );
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
          <Text style={styles.actionText}>Tirar foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

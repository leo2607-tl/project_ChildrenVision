import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);

  const { width, height } = Dimensions.get('window');
  const cameraWidth = width * 0.9;
  const cameraHeight = height * 0.7;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <LinearGradient
        colors={['#e0c3fc', '#8ec5fc']}
        style={styles.gradientContainer}
      >
        <Text style={styles.message}>Chúng tôi cần quyền truy cập camera của bạn</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionText}>Cấp quyền</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCamera() {
    setIsCameraActive((current) => !current);
  }

  return (
    <LinearGradient
      colors={['#8ec5fc', '#e0c3fc']}
      style={styles.gradientContainer}
    >
      <View style={[styles.cameraCard, { width: cameraWidth, height: cameraHeight }]}>
        {isCameraActive ? (
          <CameraView style={styles.camera} facing={facing}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Đổi Camera</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        ) : (
          <Text style={styles.instructionText}>Bé hãy bật camera để theo dõi mọi người nhé</Text>
        )}
      </View>
      <View style={styles.controlContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
          <Text style={styles.controlButtonText}>
            {isCameraActive ? 'Tắt Camera' : 'Bật Camera'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: '#4a4a4a',
  },
  permissionButton: {
    backgroundColor: '#f78fb3',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffffaa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6c5ce7',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c757d',
    textAlign: 'center',
  },
  controlContainer: {
    width: '90%',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: '#74b9ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

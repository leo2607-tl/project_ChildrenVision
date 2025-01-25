import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, ActivityIndicator, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
export default function HideScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [classCounts, setClassCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus.status !== 'granted' || galleryStatus.status !== 'granted') {
        Alert.alert('Cần cấp quyền truy cập camera và thư viện ảnh!');
      }
    };
    checkPermissions();
  }, []);

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const imageBlob = await response.blob();
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
    return base64.split(',')[1];
  };

  const classTranslations: Record<string, string> = {
    "Araneae": "Họ nhà Nhện (bao gồm các loại nhện nhỏ và nhện lớn)",
    "Coleoptera": "Họ nhà Bọ cánh cứng (bao gồm bọ rùa, bọ cánh cứng, v.v.)",
    "Diptera": "Họ nhà Ruồi thật (bao gồm muỗi, ruồi mòng, ruồi hạc, v.v.)",
    "Hemiptera": "Họ nhà Bọ thật (bao gồm rệp, ve sầu, cào cào, bọ khiên, v.v.)",
    "Hymenoptera": "Họ nhà Kiến, Ong (bao gồm kiến, ong, ong bắp cày, v.v.)",
    "Lepidoptera": "Họ nhà Bướm, Bướm đêm (bao gồm các loại bướm và sâu bướm)",
    "Odonata": "Họ nhà Chuồn chuồn, Chuồn chuồn kim (bao gồm các loài chuồn chuồn đẹp mắt)",
  };  

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Vui lòng chọn hoặc chụp một bức ảnh!');
      return;
    }

    setLoading(true);

    try {
      const base64Data = await convertImageToBase64(imageUri);

      const payload = { image: base64Data };

      const response = await axios.post('http://192.168.32.55:5002/predict', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { annotated_image, predictions } = response.data as {
        annotated_image: string;
        predictions: { class: string; confidence: number; bbox: number[] }[];
      };

      if (!predictions || predictions.length === 0) {
        Alert.alert('Không tìm thấy đối tượng nào trong ảnh!');
        setAnnotatedImage(null);
        setClassCounts({});
        return;
      }

      setAnnotatedImage(`data:image/jpeg;base64,${annotated_image}`);

      const counts: Record<string, number> = {};
      predictions.forEach((pred) => {
        const translatedClass = `${classTranslations[pred.class as keyof typeof classTranslations] || pred.class}`;
        counts[translatedClass] = (counts[translatedClass] || 0) + 1;
      });
      setClassCounts(counts);
    } catch (error) {
      Alert.alert('Không thể tải ảnh lên server');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      Alert.alert('Không có ảnh nào được chọn');
      return;
    }

    setImageUri(result.assets[0].uri);
    setAnnotatedImage(null);
    setClassCounts({});
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ['images'],
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      Alert.alert('Lỗi: Không có ảnh nào được chụp');
      return;
    }

    setImageUri(result.assets[0].uri);
    setAnnotatedImage(null);
    setClassCounts({});
  };

  return (
    <LinearGradient
      colors={['#bef5ff', '#bef5ff','#bef5ff', '#fff4c9','#fff4c9','rgb(229, 250, 180)','rgb(229, 250, 180)','rgb(229, 250, 180)','rgb(152, 255, 233)', 'rgb(152, 255, 233)']}
      style={styles.container}>
    <View style={styles.container}>
        <ImageBackground
          source={require('../../../assets/images/flowflow.jpg')}
          style={[styles.backgroundImage, {height: height * .3}]}
        >
        <View style={styles.lottieCard}>
        <LottieView
          source={require('../../../assets/images/bee.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        </View>
        </ImageBackground>
        <View style={styles.imageCard}>
          {!imageUri ? (
            <Text style={styles.placeholderText}>Bé hãy gửi ảnh của một loài côn trùng, Meobot sẽ chỉ rõ nó thuộc loại nào và ở đâu cho bé nhé!</Text>
          ) : (
            <>
              {!annotatedImage ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <Image source={{ uri: annotatedImage }} style={styles.image} />
              )}
            </>
          )}
        </View>

  
      <View style={styles.resultsCard}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {!loading && annotatedImage && (
          <View>
            <Text style={styles.resultsHeader}>Kết quả phân loại:</Text>
            {Object.entries(classCounts).map(([className, count]) => (
              <Text key={className} style={styles.resultText}>
                {className}: {count}
              </Text>
            ))}
          </View>
        )}
      </View>
  
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <FontAwesome name="image" size={20} color="rgb(58, 213, 161)" />
            <Text style={styles.buttonText}>Bé Chọn Ảnh</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <FontAwesome name="camera" size={20} color="rgb(58, 213, 161)" />
            <Text style={styles.buttonText}>Bé Chụp Ảnh</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={uploadImage}>
            <FontAwesome name="upload" size={20} color="rgb(58, 213, 161)" />
            <Text style={styles.buttonText}>Bé Gửi Ảnh</Text>
          </TouchableOpacity>
        </View>
    </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backgroundCard: {
    width: '100%',
    height: '30%',
    position: 'relative',
  },
  backgroundImage: {
    width: width, 
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  lottieCard: {
    width: width * 0.5,
    height: height * 0.5,
    overflow: 'hidden',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  imageCard: {
    width: width * 0.9,
    height: height * 0.3, 
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: height * 0.01,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  resultsCard: {
    width: width * 0.9, 
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginTop: height * 0.01,
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: height * 0.25,
    justifyContent: 'center',
  },
  resultsHeader: {
    fontSize: height * .02,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultText: {
    fontSize: height * .02,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.9,
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    paddingVertical: 14,
    marginHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'rgb(58, 213, 161)',
    marginTop: 5,
  },
  placeholderText: {
    fontSize: 16,
    color: 'rgb(153, 153, 153)',
    textAlign: 'center',
  },
});
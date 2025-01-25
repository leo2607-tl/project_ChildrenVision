import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert, TextInput,ScrollView, ImageBackground} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { FontAwesome } from '@expo/vector-icons';
const { height: H, width: W } = Dimensions.get('window'); 
export default function EdgeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [processedImageUri, setProcessedImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<{
    kernelSize: string;
    sigmaS: string;
    sigmaR: string;
    blockSize: string;
    C: string;
    lowThreshold: string;
    highThreshold: string;
    dilationIterations: string;
    erosionIterations: string;
  }>({
    kernelSize: '',
    sigmaS: '',
    sigmaR: '',
    blockSize: '',
    C: '',
    lowThreshold: '',
    highThreshold: '',
    dilationIterations: '',
    erosionIterations: '',
  });
  

  const paramLabels: { [key: string]: string } = {
    kernelSize: 'Kích thước bộ lọc',
    sigmaS: 'Sigma S',
    sigmaR: 'Sigma R',
    blockSize: 'Kích thước khối',
    C: 'Giá trị C',
    lowThreshold: 'Ngưỡng thấp',
    highThreshold: 'Ngưỡng cao',
    dilationIterations: 'Lần lặp nở',
    erosionIterations: 'Lần lặp co',
  };

  const validateParams = (): boolean => {
    const errors: string[] = [];

    if (isNaN(Number(params.kernelSize)) || Number(params.kernelSize) <= 0) {
      errors.push('Kích thước bộ lọc phải là số dương.');
    }
    if (isNaN(Number(params.sigmaS)) || Number(params.sigmaS) <= 0) {
      errors.push('Sigma S phải là số dương.');
    }
    if (isNaN(Number(params.sigmaR)) || Number(params.sigmaR) <= 0) {
      errors.push('Sigma R phải là số dương.');
    }
    if (isNaN(Number(params.blockSize)) || Number(params.blockSize) <= 0 || Number(params.blockSize) % 2 === 0) {
      errors.push('Kích thước khối phải là số lẻ dương.');
    }
    if (isNaN(Number(params.C))) {
      errors.push('C phải là một số.');
    }
    if (isNaN(Number(params.lowThreshold)) || Number(params.lowThreshold) < 0) {
      errors.push('Ngưỡng thấp phải là số không âm.');
    }
    if (isNaN(Number(params.highThreshold)) || Number(params.highThreshold) <= Number(params.lowThreshold)) {
      errors.push('Ngưỡng cao phải lớn hơn ngưỡng thấp.');
    }
    if (isNaN(Number(params.dilationIterations)) || Number(params.dilationIterations) < 0) {
      errors.push('Lần lặp nở phải là số không âm.');
    }
    if (isNaN(Number(params.erosionIterations)) || Number(params.erosionIterations) < 0) {
      errors.push('Lần lặp co phải là số không âm.');
    }

    if (errors.length > 0) {
      Alert.alert('Lỗi nhập tham số', errors.join('\n'));
      return false;
    }
    return true;
  };
  const paramDescriptions: { [key: string]: string } = {
    kernelSize: 'Kích thước của bộ lọc giúp làm mịn bức ảnh. Chọn giá trị nhỏ như 3 hoặc 5 để bức ảnh không bị quá mờ nhé, bé có thể thử với những con số này.',
    sigmaS: 'Đây là hệ số giúp điều chỉnh độ mờ của bộ lọc. Gợi ý cho bé là chọn giá trị 1.0 để bức ảnh mờ vừa phải, không quá nhiều.',
    sigmaR: 'Hệ số này giúp điều chỉnh độ mờ của các điểm ảnh. Để dễ dàng cho bé, có thể thử với giá trị 0.1 để không làm bức ảnh bị quá mờ.',
    blockSize: 'Đây là kích thước của từng phần nhỏ trong việc xử lý ảnh. Bé nhớ chọn số lẻ nhé, ví dụ như 3 sẽ là lựa chọn tốt.',
    C: 'Đây là một con số giúp phát hiện các cạnh trong ảnh. Bé thử với giá trị 2 để ảnh trông rõ ràng hơn.',
    lowThreshold: 'Giá trị này là ngưỡng thấp giúp tìm các cạnh trong ảnh. Bé có thể thử với số 50 để bắt đầu phát hiện các cạnh dễ dàng.',
    highThreshold: 'Giá trị này phải lớn hơn ngưỡng thấp để phát hiện cạnh rõ ràng. Gợi ý cho bé là thử 150 để xem các cạnh rõ hơn nhé.',
    dilationIterations: 'Đây là số lần bé muốn nở các cạnh trong ảnh. Gợi ý thử 1 lần để làm các cạnh rõ nét hơn.',
    erosionIterations: 'Đây là số lần bé muốn co lại các cạnh trong ảnh. Bé có thể thử với 1 lần để làm cho ảnh gọn gàng hơn.',
  };
  
  const convertImageToBase64 = async (uri: string): Promise<string> => {
    console.log('Bắt đầu chuyển đổi ảnh sang Base64:', uri);
    const response = await fetch(uri);
    const imageBlob = await response.blob();
    console.log('Blob ảnh:', imageBlob);
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Kết quả Base64:', reader.result);
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
    return base64.split(',')[1];
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Vui lòng chọn hoặc chụp một bức ảnh!');
      return;
    }

    console.log('Ảnh URI:', imageUri);

    if (!validateParams()) {
      console.log('Validation thất bại.');
      return;
    }

    console.log('Tham số đã được validate:', params);

    setLoading(true);

    try {
      const base64Data = await convertImageToBase64(imageUri);
      console.log('Chuỗi Base64 ảnh:', base64Data.slice(0, 100), '...'); // Chỉ log phần đầu để tránh log quá dài

      const payload = {
        image: base64Data,
        params: {
          kernelSize: Number(params.kernelSize),
          sigmaS: Number(params.sigmaS),
          sigmaR: Number(params.sigmaR),
          blockSize: Number(params.blockSize),
          C: Number(params.C),
          lowThreshold: Number(params.lowThreshold),
          highThreshold: Number(params.highThreshold),
          dilationIterations: Number(params.dilationIterations),
          erosionIterations: Number(params.erosionIterations),
        },
      };

      console.log('Payload gửi lên server:', payload);

      const response = await axios.post('http://192.168.32.55:5000/process', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Phản hồi từ server:', response.data);
      const processedImageBase64 = (response.data as { output_image: string }).output_image;
      if (processedImageBase64) {
        setProcessedImageUri(`data:image/jpeg;base64,${processedImageBase64}`);
        console.log('Ảnh đã xử lý được trả về.');
      } else {
        Alert.alert('Lỗi', 'Không thể xử lý ảnh.');
        console.log('Không có ảnh trả về.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Lỗi: Không thể tải ảnh lên server');
    } finally {
      setLoading(false);
      console.log('Hoàn thành xử lý ảnh.');
    }
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      Alert.alert('Lỗi: Không có ảnh nào được chọn');
      return;
    }

    setImageUri(result.assets[0].uri);
    setProcessedImageUri(null); 
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
    setProcessedImageUri(null); 
  };

  const handleInputChange = (name: keyof typeof params, value: string) => {
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };
  
  return (
    <LinearGradient
      colors={['rgb(0, 0, 0)', 'rgb(0, 0, 0)','rgb(0, 0, 0)','rgb(0, 0, 0)','rgb(0, 0, 0)','rgb(0, 0, 0)','rgb(0, 0, 0)','rgb(0, 0, 0)', 'rgb(46, 46, 46)']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground 
          source={require('../../../assets/images/moon2moon.jpg')} 
          style={[styles.backgroundImage, { height: H * 0.3 }]}
        >
        <View style={styles.lottieCard}>
          <LottieView
          source={require('../../../assets/images/moon.json')}
          autoPlay
          loop
          style={styles.lottie}
          />
        </View>
        </ImageBackground>

        <View style={styles.card}>
          {imageUri && !processedImageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}
          {processedImageUri && (
            <Image source={{ uri: processedImageUri }} style={styles.image} />
          )}
        </View>

        {loading && <ActivityIndicator size="large" color="#ffffff" style={styles.loading} />}

        <View style={styles.paramsContainer}>
          <View style={styles.row}>
            {Object.keys(params).map((key, index) => (
              index < 3 && (
                <View key={key} style={styles.paramItem}>
                  <Text style={styles.paramLabel}>{paramLabels[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</Text>
                  <TextInput
                    style={styles.input}
                    value={params[key as keyof typeof params]}
                    onChangeText={(text) => handleInputChange(key as keyof typeof params, text)}
                    keyboardType="numeric"
                  />
                </View>
              )
            ))}
          </View>
          <View style={styles.row}>
            {Object.keys(params).map((key, index) => (
              index >= 3 && index < 6 && (
                <View key={key} style={styles.paramItem}>
                  <Text style={styles.paramLabel}>{paramLabels[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</Text>
                  <TextInput
                    style={styles.input}
                    value={params[key as keyof typeof params]}
                    onChangeText={(text) => handleInputChange(key as keyof typeof params, text)}
                    keyboardType="numeric"
                  />
                </View>
              )
            ))}
          </View>
          <View style={styles.row}>
            {Object.keys(params).map((key, index) => (
              index >= 6 && (
                <View key={key} style={styles.paramItem}>
                  <Text style={styles.paramLabel}>{paramLabels[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</Text>
                  <TextInput
                    style={styles.input}
                    value={params[key as keyof typeof params]}
                    onChangeText={(text) => handleInputChange(key as keyof typeof params, text)}
                    keyboardType="numeric"
                  />
                </View>
              )
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <FontAwesome name="image" size={20} color="rgb(0, 0, 0)" />
            <Text style={styles.buttonText}>Bé Chọn Ảnh</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <FontAwesome name="camera" size={20} color="rgb(0, 0, 0)" />
            <Text style={styles.buttonText}>Bé Chụp Ảnh</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={uploadImage}>
            <FontAwesome name="upload" size={20} color="rgb(0, 0, 0)" />
            <Text style={styles.buttonText}>Bé Gửi Ảnh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Mô Tả Chi Tiết</Text>
          {Object.keys(paramDescriptions).map((key) => (
            <View key={key} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{paramLabels[key]}</Text>
              <Text style={styles.infoDescription}>{paramDescriptions[key]}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backgroundImage: {
    width: W, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: H * 0.01,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  lottieCard: {
    width: W * 0.35,
    height: H * 0.35,
    overflow: 'hidden',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  card: {
    marginTop: H * 0.01,
    width: '90%',
    aspectRatio: 6 / 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: H * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loading: {
    marginVertical: 20,
  },
  paramsContainer: {
    width: '90%',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  paramItem: {
    width: '30%',
  },
  paramLabel: {
    color: '#fff',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: H * 0.01,
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
    color: 'rgb(0, 0, 0)',
    marginTop: 5,
  },
  infoCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: H * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: H * 0.01,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoDescription: {
    fontSize: 12,
    color: '#666',
  },
});
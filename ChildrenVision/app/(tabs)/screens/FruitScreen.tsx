import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert, 
  ImageBackground, 
  Dimensions 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
const { height: H, width: W } = Dimensions.get('window'); 

const predictionMap = {
  apple: 'Táo',
  banana: 'Chuối',
  beetroot: 'Củ dền',
  'bell pepper': 'Ớt chuông',
  cabbage: 'Bắp cải',
  capsicum: 'Ớt ngọt',
  carrot: 'Cà rốt',
  cauliflower: 'Súp lơ',
  'chilli pepper': 'Ớt cay',
  corn: 'Ngô',
  cucumber: 'Dưa chuột',
  eggplant: 'Cà tím',
  garlic: 'Tỏi',
  ginger: 'Gừng',
  grapes: 'Nho',
  jalepeno: 'Ớt jalapeño',
  kiwi: 'Kiwi',
  lemon: 'Chanh',
  lettuce: 'Xà lách',
  mango: 'Xoài',
  onion: 'Hành',
  orange: 'Cam',
  paprika: 'Ớt bột',
  pear: 'Lê',
  peas: 'Đậu Hà Lan',
  pineapple: 'Dứa',
  pomegranate: 'Lựu',
  potato: 'Khoai tây',
  raddish: 'Củ cải',
  'soy beans': 'Đậu nành',
  spinach: 'Rau bina',
  sweetcorn: 'Ngô ngọt',
  sweetpotato: 'Khoai lang',
  tomato: 'Cà chua',
  turnip: 'Củ cải trắng',
  watermelon: 'Dưa hấu'
};

interface Descriptions {
  [key: string]: string;
}

const getDescription = (prediction: string): string => {
  const descriptions: Descriptions = {
    apple: 'Bé biết không, táo rất ngon và giúp bé khỏe mạnh vì có nhiều vitamin và chất xơ đấy!',
    banana: 'Chuối là một người bạn tốt cho bé vì nó cung cấp nhiều năng lượng và kali cho cơ thể bé.',
    beetroot: 'Củ dền giúp bé có làn da khỏe mạnh và đầy vitamin, rất tốt cho sức khỏe đấy!',
    'bell pepper': 'Ớt chuông màu sắc rực rỡ không chỉ đẹp mắt mà còn chứa nhiều vitamin C giúp bé khỏe mạnh hơn.',
    cabbage: 'Bắp cải giúp bé có xương chắc khỏe và chứa nhiều vitamin K đấy.',
    capsicum: 'Ớt ngọt rất tốt cho cơ thể bé vì có vitamin C và rất dễ ăn đấy!',
    carrot: 'Cà rốt giúp bé có đôi mắt sáng và khỏe, vì nó chứa nhiều beta-carotene đấy.',
    cauliflower: 'Súp lơ có rất ít calo nhưng lại nhiều chất xơ, giúp bé ăn ngon và dễ tiêu hóa.',
    'chilli pepper': 'Ớt cay giúp cơ thể bé hoạt động nhanh nhẹn hơn nhờ một chất đặc biệt gọi là capsaicin.',
    corn: 'Ngô ngon lắm và cung cấp nhiều vitamin B, giúp bé có năng lượng để vui chơi suốt cả ngày.',
    cucumber: 'Dưa chuột có nhiều nước giúp bé luôn cảm thấy mát mẻ và cũng chứa vitamin K nữa.',
    eggplant: 'Cà tím có ít calo nhưng lại tốt cho bụng bé vì có nhiều chất xơ.',
    garlic: 'Tỏi giúp cơ thể bé chống lại bệnh tật và giúp bé khỏe mạnh hơn, nhờ một chất gọi là allicin.',
    ginger: 'Gừng là một loại gia vị giúp bụng bé luôn vui và không bị đau, đặc biệt khi bé bị nôn nao.',
    grapes: 'Nho là món ăn ngọt ngào, chứa nhiều vitamin C giúp bảo vệ cơ thể bé khỏi bệnh tật.',
    jalepeno: 'Ớt jalapeño cay cay giúp cơ thể bé đỡ bị viêm và khỏe mạnh hơn.',
    kiwi: 'Kiwi có nhiều vitamin C giúp bé khỏe mạnh và có sức đề kháng tốt.',
    lemon: 'Chanh giúp cơ thể bé luôn sạch sẽ và khỏe mạnh vì nó chứa nhiều vitamin C.',
    lettuce: 'Xà lách giúp bé giữ cơ thể khỏe mạnh vì chứa nhiều nước và vitamin K đấy.',
    mango: 'Xoài là một loại trái cây ngon miệng, giàu vitamin C và có thể giúp cơ thể bé khỏe mạnh hơn.',
    onion: 'Hành giúp bé tránh bệnh tật và rất tốt cho tim mạch nữa.',
    orange: 'Cam giúp bé chống lại bệnh cảm lạnh vì có nhiều vitamin C, rất tốt cho sức khỏe.',
    paprika: 'Ớt bột không chỉ cay mà còn chứa vitamin A giúp cơ thể bé khỏe mạnh và bảo vệ làn da.',
    pear: 'Lê ngọt ngào là nguồn cung cấp chất xơ và vitamin C, giúp bé tiêu hóa tốt và khỏe mạnh.',
    peas: 'Đậu Hà Lan có nhiều chất giúp cơ thể bé khỏe mạnh và giúp xương chắc chắn.',
    pineapple: 'Dứa giúp bé tiêu hóa tốt hơn và có tác dụng làm cơ thể bé mạnh mẽ hơn.',
    pomegranate: 'Lựu là loại trái cây siêu ngon, chứa nhiều chất giúp bảo vệ cơ thể bé khỏi bệnh tật.',
    potato: 'Khoai tây rất ngon và giúp bé có nhiều năng lượng, vì có vitamin C và tinh bột tốt cho cơ thể.',
    raddish: 'Củ cải giúp bé chống lại bệnh cảm lạnh và cung cấp vitamin C để bé luôn khỏe mạnh.',
    'soy beans': 'Đậu nành giúp cơ thể bé khỏe mạnh vì chứa nhiều protein và các chất tốt cho tim mạch.',
    spinach: 'Rau bina giúp bé có nhiều năng lượng và khỏe mạnh hơn nhờ nhiều sắt trong rau đấy.',
    sweetcorn: 'Ngô ngọt cung cấp nhiều năng lượng cho bé để vui chơi suốt cả ngày, đầy năng lượng.',
    sweetpotato: 'Khoai lang rất ngon và giúp bé khỏe mạnh hơn vì có vitamin A và chất xơ.',
    tomato: 'Cà chua có chất chống oxy hóa mạnh mẽ giúp bảo vệ cơ thể bé khỏi bệnh và làm da bé mịn màng hơn.',
    turnip: 'Củ cải trắng rất tốt cho cơ thể bé vì giúp tăng cường hệ miễn dịch và có vitamin C.',
    watermelon: 'Dưa hấu là món trái cây siêu ngon, chứa nhiều nước giúp cơ thể bé luôn tươi mát và khỏe mạnh.'
  };  
  return descriptions[prediction] || 'Thông tin chưa được cập nhật.';
};

export default function PlayScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null); 
  const [prediction, setPrediction] = useState<keyof typeof predictionMap | null>(null); 
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

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Vui lòng chọn hoặc chụp một bức ảnh!');
      return;
    }
    setLoading(true);

    try {
      const base64Data = await convertImageToBase64(imageUri);
      const payload = { image: base64Data };
      const response = await axios.post('http://192.168.32.55:5001/predict', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const predictionResult = (response.data as { predicted_label: string }).predicted_label;

      if (predictionResult) {
        setPrediction(predictionResult as keyof typeof predictionMap);
      } else {
        Alert.alert('Lỗi', 'Không thể xử lý ảnh.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
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
    setPrediction(null); 
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
    setPrediction(null); 
  };

  return (
    <LinearGradient
      colors={['rgb(255, 255, 255)', 'rgb(255, 255, 255)','rgb(255, 255, 255)','rgb(255, 255, 255)','rgb(163, 255, 198)', 'rgb(93, 255, 193)']}
      style={styles.container}
    >
      <View style={styles.container}>
        <ImageBackground 
          source={require('../../../assets/images/hoahoa.jpg')} 
          style={[styles.backgroundImage, { height: H * 0.3 }]}
        >
          <View style={styles.lottieCard}>
            <LottieView
              source={require('../../../assets/images/hoahoa.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
        </ImageBackground>

        <View style={styles.imageCard}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>Bé hãy gửi một bức ảnh về một loại hoa quả hoặc rau củ lên cho MeoBot nhé! MeoBot sẽ cho bạn biết nó là gì.</Text>
          )}
        </View>

        {prediction && (
          <View style={styles.predictionCard}>
            <Text style={styles.label}>Kết Quả</Text>
            <Text style={styles.prediction}>{predictionMap[prediction]}</Text>
          </View>
        )}

        {prediction && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Thông Tin</Text>
            <Text style={styles.infoText}>{getDescription(prediction)}</Text>
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="rgb(255, 255, 255)" style={styles.loading} />}

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
  backgroundImage: {
    width: W, 
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(0, 0, 0)',
  },
  imageCard: {
    width: W * 0.9,
    height: H * 0.3, 
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
    marginTop: H * 0.01,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  lottieCard: {
    width: W * 0.5,
    height: H * 0.5,
    overflow: 'hidden',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  predictionCard: {
    width: W * 0.9, 
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginTop: H * 0.01,
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'rgb(58, 213, 161)',
  },
  prediction: {
    fontSize: 18,
    color: 'rgb(51, 51, 51)',
  },
  infoCard: {
    width: W * 0.9,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: H * 0.01,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'rgb(58, 213, 161)',
  },
  infoText: {
    fontSize: 16,
    color: 'rgb(51, 51, 51)',
  },
  loading: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: W * 0.9,
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GraphemeSplitter from 'grapheme-splitter';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window'); 

type RootStackParamList = {
  Hide: undefined;
  Fruit: undefined;
  Draw: undefined;
  Edge: undefined;
};

export default function HomeScreen() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [typingIntervalId, setTypingIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [botAnimation, setBotAnimation] = useState('talking'); 
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const messages = [
    'Chào mừng bé đến với ChildrenVision!',
    'Mình là MeoBot đồng hành cùng bạn!',
    'Cùng khám phá thế giới vui vẻ nhé!',
    'Hãy bắt đầu ngay thôi nào!',
  ];

  useEffect(() => {
    const splitter = new GraphemeSplitter();
    const graphemes = splitter.splitGraphemes(messages[currentMessageIndex]);

    let charIndex = 0;
    let tempText = '';

    if (typingIntervalId) {
      clearInterval(typingIntervalId);
    }

    setBotAnimation('talking');  

    const intervalId = setInterval(() => {
      if (charIndex < graphemes.length) {
        tempText += graphemes[charIndex];
        setDisplayedText(tempText);
        charIndex++;
      } else {
        clearInterval(intervalId);
        setTimeout(() => {
          setDisplayedText('');
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          setBotAnimation('idle'); 
        }, 3500); 
      }
    }, 95);
    setTypingIntervalId(intervalId);

    return () => clearInterval(intervalId);
  }, [currentMessageIndex]);

  return (
    <LinearGradient
      colors={['rgb(255, 255, 255)', 'rgba(163, 255, 199, 0.23)', 'rgba(93, 255, 193, 0.32)']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <MaterialIcons name="notifications" size={SCREEN_WIDTH * 0.055} color="#333" style={styles.icon} />
          <Text style={styles.title}>ChildrenVision</Text>
          <MaterialIcons name="menu" size={SCREEN_WIDTH * 0.055} color="#333" style={styles.icon} />
        </View>

        <ImageBackground
          source={require('../../../assets/images/background.jpg')}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <View style={styles.lottieCard}>
            <LottieView
              source={require('../../../assets/images/hello.json')}
              autoPlay
              loop
              style={styles.lottie}
              key={botAnimation}
            />
          </View>
        </ImageBackground>

        <View style={styles.card}>
          <Text style={styles.message}>{displayedText}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <View style={styles.cardButton}>
            <TouchableOpacity onPress={() => navigation.navigate('Hide')} style={styles.lottieButton}>
              <LottieView
                source={require('../../../assets/images/lion.json')}
                autoPlay
                loop
                style={styles.lottieIcon}
              />
              <Text style={styles.buttonText}>Tiếng Gọi Rừng Xanh</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardButton}>
            <TouchableOpacity onPress={() => navigation.navigate('Fruit')} style={styles.lottieButton}>
              <LottieView
                source={require('../../../assets/images/bo.json')}
                autoPlay
                loop
                style={styles.lottieIcon}
              />
              <Text style={styles.buttonText}>Sắc Màu Hoa Quả</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.cardButton}>
            <TouchableOpacity onPress={() => navigation.navigate('Edge')} style={styles.lottieButton}>
              <LottieView
                source={require('../../../assets/images/edge.json')}
                autoPlay
                loop
                style={styles.lottieIcon}
              />
              <Text style={styles.buttonText}>Điểm Ảnh Diệu Kỳ</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardButton}>
            <TouchableOpacity onPress={() => navigation.navigate('Draw')} style={styles.lottieButton}>
              <LottieView
                source={require('../../../assets/images/draw.json')}
                autoPlay
                loop
                style={styles.lottieIcon}
              />
              <Text style={styles.buttonText}>Bí Ẩn Khung Tranh</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', 
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, 
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  icon: {
    padding: 5,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  imageBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieCard: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    overflow: 'hidden',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    padding: SCREEN_WIDTH * 0.05,
    borderRadius: SCREEN_WIDTH * 0.04,
    backgroundColor: 'rgb(255, 255, 255)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  message: {
    fontSize: SCREEN_WIDTH * 0.05,
    color: '#333',
    textAlign: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.92,
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  lottieButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.01,
  },
  lottieIcon: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
  },
  lottieIcon_2: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
  },
  cardButton: {
    flex: 1,
    marginHorizontal: SCREEN_WIDTH * 0.01,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: SCREEN_WIDTH * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.02,
  },
  buttonText: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

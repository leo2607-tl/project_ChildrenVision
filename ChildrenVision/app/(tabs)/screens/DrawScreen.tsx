import React, { useState } from 'react';
import { View, StyleSheet, Button, TouchableOpacity, Dimensions, ImageBackground, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
const { width, height } = Dimensions.get('window');

export default function DrawScreen() {
  const [paths, setPaths] = useState<{ d: string; color: string }[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [color, setColor] = useState('#ff0000');

  const handleTouchStart = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    setCurrentPath(`M ${locationX} ${locationY}`);
  };

  const handleTouchMove = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    setCurrentPath((prev) => `${prev} L ${locationX} ${locationY}`);
  };

  const handleTouchEnd = () => {
    setPaths([...paths, { d: currentPath, color }]);
    setCurrentPath('');
  };

  return (
    <LinearGradient
      colors={['#cdffd8', '#cdffd8']}
      style={styles.container}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../../assets/images/light2light.jpg')}
          style={[styles.backgroundImage, {height: height * .3}]}
        >
        <View style={styles.lottieCard}>
        <LottieView
          source={require('../../../assets/images/sun.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        </View>
        </ImageBackground>

      <View style={styles.cardContainer}>
        <View
          style={styles.drawingArea}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
          onResponderRelease={handleTouchEnd}
        >
          <Svg style={StyleSheet.absoluteFill}>
            {paths.map((path, index) => (
              <Path key={index} d={path.d} stroke={path.color} strokeWidth={3} fill="none" />
            ))}
            {currentPath && <Path d={currentPath} stroke={color} strokeWidth={3} fill="none" />}
          </Svg>
        </View>
      </View>

      <View style={styles.colorCard}>
        <View style={styles.colorPicker}>
          {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff','#a52a2a', '#d2691e', '#008080', '#00008b', '#808080', '#f0e68c', '#800080', '#ff6347', '#7fff00', '#adff2f', '#ffd700', '#dda0dd'].map((col) => (
            <TouchableOpacity
              key={col}
              style={[styles.colorOption, { backgroundColor: col, borderWidth: col === color ? 2 : 0 }]}
              onPress={() => setColor(col)}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={() => setPaths([])}>
          <Text style={styles.clearButtonText}>Dọn Dẹp</Text>
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
  imageBackground: {
    width: '100%',
    height: height * 0.3, // 30% height
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardContainer: {
    width: width * 0.9,  
    height: height * 0.45,  
    marginTop: height * 0.01, 
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  drawingArea: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#000',
  },
  colorCard: {
    width: width * 0.9,  
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    margin: 5,
    borderRadius: 15,
  },
  backgroundImage: {
    width: width, 
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  lottieCard: {
    width: width * 0.4,
    height: height * 0.4,
    overflow: 'hidden',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  clearButton: {
    backgroundColor: '#cdffd8',
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 25, 
    shadowColor: '#000',
    shadowOpacity: 0.2, 
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5, 
    elevation: 5,
    alignItems: 'center', 
    marginTop: 10, 
  },
  clearButtonText: {
    color: '#rgba(0, 0, 0, 0.3)',
    fontSize: 16, 
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  
});

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   ImageBackground,
// } from 'react-native';
// import Modal from 'react-native-modal';
// import LottieView from 'lottie-react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width, height } = Dimensions.get('window');

// export default function ProfileScreen() {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [modalContent, setModalContent] = useState('');

//   const handleOpenModal = (content: string) => {
//     setModalContent(content);
//     setModalVisible(true);
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//   };

//   const buttons = [
//     {
//       title: 'Chi Tiết Ứng Dụng',
//       content:
//         'Ứng dụng này là sự kết hợp giữa công nghệ xử lý ảnh và trí tuệ nhân tạo (AI) nhằm mang lại trải nghiệm học tập và giải trí hiệu quả cho trẻ em. Trẻ có thể tương tác trực tiếp với các tính năng như nhận diện hình ảnh, vẽ, và chơi các trò chơi giáo dục. Giao diện đơn giản, dễ sử dụng, và đặc biệt phù hợp với trẻ nhỏ.',
//       animation: require('../../../assets/images/edge.json'),
//     },
//     {
//       title: 'Mục Tiêu Ứng Dụng',
//       content:
//         'Ứng dụng hướng đến việc tạo ra môi trường học tập vui nhộn và hấp dẫn, giúp trẻ em phát triển tư duy sáng tạo, khả năng giải quyết vấn đề, và niềm yêu thích học hỏi. Thông qua các hoạt động vừa học vừa chơi, trẻ được khuyến khích khám phá và tiếp thu kiến thức một cách tự nhiên.',
//       animation: require('../../../assets/images/edge.json'),
//     },
//     {
//       title: 'Đối Tượng Nghiên Cứu',
//       content:
//         'Ứng dụng được thiết kế dành riêng cho trẻ em từ 4 đến 12 tuổi. Nội dung và các hoạt động được phân chia theo độ tuổi để đảm bảo phù hợp với sự phát triển tư duy và kỹ năng của từng nhóm trẻ. Điều này giúp trẻ học tập một cách hiệu quả và thú vị.',
//       animation: require('../../../assets/images/edge.json'),
//     },
//     {
//       title: 'Phiên Bản Ứng Dụng',
//       content:
//         'Phiên bản hiện tại của ứng dụng là 1.0.0. Đây là phiên bản đầu tiên được ra mắt với các tính năng cơ bản như nhận diện hình ảnh, trò chơi học tập, và hướng dẫn sử dụng thân thiện. Chúng tôi sẽ tiếp tục cải tiến và cập nhật các tính năng mới dựa trên phản hồi của người dùng.',
//       animation: require('../../../assets/images/edge.json'),
//     },
//     {
//       title: 'Hướng Dẫn Sử Dụng',
//       content:
//         '1. Từ giao diện chính, chọn các chức năng bạn muốn sử dụng, ví dụ: nhận diện hình ảnh, vẽ, hoặc chơi trò chơi.\n' +
//         '2. Làm theo hướng dẫn hiển thị trên màn hình để tương tác với ứng dụng.\n' +
//         '3. Khám phá các tính năng khác nhau để học tập và giải trí.\n' +
//         '4. Trẻ có thể lưu lại các thành quả của mình hoặc chia sẻ với bạn bè và gia đình.',
//       animation: require('../../../assets/images/edge.json'),
//     },
//     {
//       title: 'Lời Cảm Ơn',
//       content:
//         'Chúng tôi chân thành cảm ơn bạn đã lựa chọn và trải nghiệm ứng dụng của chúng tôi. Sự ủng hộ của bạn là động lực để chúng tôi tiếp tục cải thiện và phát triển ứng dụng. Nếu có bất kỳ ý kiến đóng góp nào, xin vui lòng chia sẻ để chúng tôi có thể phục vụ bạn tốt hơn!',
//       animation: require('../../../assets/images/edge.json'),
//     },
//   ];
  

//   return (
//     <LinearGradient
//       colors={['rgb(255, 255, 255)', 'rgb(255, 255, 255)','rgb(255, 255, 255)','rgb(163, 255, 198)', 'rgb(93, 255, 193)']}
//       style={styles.container}
//     >
//      <View style={styles.container}>
//       <ImageBackground
//           source={require('../../../assets/images/light2light.jpg')}
//           style={[styles.backgroundImage, {height: height * .35}]}
//         >
//         <View style={styles.lottieCard}>
//         <LottieView
//           source={require('../../../assets/images/botbot.json')}
//           autoPlay
//           loop
//           style={styles.lottie}
//         />
//         </View>
//       </ImageBackground>
      
//       <View style={styles.buttonGrid}>
//         {buttons.map((button, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.button}
//             onPress={() => handleOpenModal(button.content)}
//           >
//             <LottieView
//               source={button.animation}
//               autoPlay
//               loop
//               style={styles.lottie_}
//             />
//             <Text style={styles.buttonText}>{button.title}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
      
//       <Modal
//         isVisible={isModalVisible}
//         onBackdropPress={handleCloseModal}
//         animationIn="zoomIn"
//         animationOut="zoomOut"
//         useNativeDriver={true}
//       >
//         <View style={styles.modalCard}>
//           <Text style={styles.modalContent}>{modalContent}</Text>
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={handleCloseModal}
//           >
//             <Text style={styles.closeButtonText}>Đóng</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   headerContainer: {
//     width: width,
//     height: height * 0.05,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: width * 0.05,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     marginTop: height * 0.03,
//   },
//   backgroundImage: {
//     width: width, 
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   lottieCard: {
//     width: width * 0.5,
//     height: height * 0.5,
//     overflow: 'hidden',
//   },
//   lottie: {
//     width: '100%',
//     height: '100%',
//   },
//   lottie_: {
//     width: '60%',
//     height: '60%',
//   },
//   buttonGrid: {
//     flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     backgroundColor: 'rgb(255, 255, 255)',
//   },
//   button: {
//     width: '45%',
//     height: height * 0.15, 
//     marginVertical: 10,
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     backgroundColor: 'rgb(255, 255, 255)',
//     borderRadius: 10,
//     elevation: 5,
//     shadowColor: 'rgb(0, 0, 0)',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//   },
//   buttonText: {
//     marginTop: 5, 
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: 'rgb(50, 50, 50)',
//     textAlign: 'center',
//   },
//   modalCard: {
//     backgroundColor: 'rgb(255, 255, 255)',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: 'rgb(0, 0, 0)',
//     shadowOpacity: 0.25,
//     shadowOffset: { width: 0, height: 5 },
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   modalContent: {
//     fontSize: 16,
//     color: 'rgb(70, 70, 70)',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   closeButton: {
//     backgroundColor: 'rgb(255, 77, 77)',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   closeButtonText: {
//     color: 'rgb(255, 255, 255)',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  interface Button {
    title: string;
    content: string;
    animation: any;
  }

  const handleOpenModal = (content: string): void => {
    setModalContent(content);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const buttons = [
    {
      title: 'Chi Tiết Ứng Dụng',
      content:
        'Ứng dụng này là sự kết hợp giữa công nghệ xử lý ảnh và trí tuệ nhân tạo (AI) nhằm mang lại trải nghiệm học tập và giải trí hiệu quả cho trẻ em. Trẻ có thể tương tác trực tiếp với các tính năng như nhận diện hình ảnh, vẽ, và chơi các trò chơi giáo dục. Giao diện đơn giản, dễ sử dụng, và đặc biệt phù hợp với trẻ nhỏ.',
      animation: require('../../../assets/images/pan1pan.json'),
    },
    {
      title: 'Mục Tiêu Ứng Dụng',
      content:
        'Ứng dụng hướng đến việc tạo ra môi trường học tập vui nhộn và hấp dẫn, giúp trẻ em phát triển tư duy sáng tạo, khả năng giải quyết vấn đề, và niềm yêu thích học hỏi. Thông qua các hoạt động vừa học vừa chơi, trẻ được khuyến khích khám phá và tiếp thu kiến thức một cách tự nhiên.',
      animation: require('../../../assets/images/pan2pan.json'),
    },
    {
      title: 'Đối Tượng Nghiên Cứu',
      content:
        'Ứng dụng được thiết kế dành riêng cho trẻ em từ 4 đến 12 tuổi. Nội dung và các hoạt động được phân chia theo độ tuổi để đảm bảo phù hợp với sự phát triển tư duy và kỹ năng của từng nhóm trẻ. Điều này giúp trẻ học tập một cách hiệu quả và thú vị.',
      animation: require('../../../assets/images/pan7pan.json'),
    },
    {
      title: 'Phiên Bản Ứng Dụng',
      content:
        'Phiên bản hiện tại của ứng dụng là 1.0.0. Đây là phiên bản đầu tiên được ra mắt với các tính năng cơ bản như nhận diện hình ảnh, trò chơi học tập, và hướng dẫn sử dụng thân thiện. Chúng tôi sẽ tiếp tục cải tiến và cập nhật các tính năng mới dựa trên phản hồi của người dùng.',
      animation: require('../../../assets/images/pan4pan.json'),
    },
    {
      title: 'Hướng Dẫn Sử Dụng',
      content:
        '1. Từ giao diện chính, chọn các chức năng bạn muốn sử dụng, ví dụ: nhận diện hình ảnh, vẽ, hoặc chơi trò chơi.\n' +
        '2. Làm theo hướng dẫn hiển thị trên màn hình để tương tác với ứng dụng.\n' +
        '3. Khám phá các tính năng khác nhau để học tập và giải trí.\n' +
        '4. Trẻ có thể lưu lại các thành quả của mình hoặc chia sẻ với bạn bè và gia đình.',
      animation: require('../../../assets/images/pan5pan.json'),
    },
    {
      title: 'Lời Cảm Ơn',
      content:
        'Chúng tôi chân thành cảm ơn bạn đã lựa chọn và trải nghiệm ứng dụng của chúng tôi. Sự ủng hộ của bạn là động lực để chúng tôi tiếp tục cải thiện và phát triển ứng dụng. Nếu có bất kỳ ý kiến đóng góp nào, xin vui lòng chia sẻ để chúng tôi có thể phục vụ bạn tốt hơn!',
      animation: require('../../../assets/images/pan8pan.json'),
    },
  ];

  return (
    <LinearGradient
      colors={['rgb(8, 41, 10)', 'rgb(7, 41, 35)', 'rgb(8, 63, 46)']}
      style={styles.container}
    >
      <View style={styles.container}>
        <ImageBackground
          source={require('../../../assets/images/prop.jpg')}
          style={[styles.backgroundImage, { height: height * 0.35 }]}
        >
          <View style={styles.lottieCard}>
            <LottieView
              source={require('../../../assets/images/prop.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
        </ImageBackground>

        <View style={styles.buttonGrid}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => handleOpenModal(button.content)}
            >
              <LottieView
                source={button.animation}
                autoPlay
                loop
                style={styles.lottie_}
              />
              <Text style={styles.buttonText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={handleCloseModal}
          animationIn="zoomIn"
          animationOut="zoomOut"
          useNativeDriver={true}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalContent}>{modalContent}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  lottieCard: {
    width: width * 0.7,
    height: height * 0.7,
    overflow: 'hidden',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  lottie_: {
    width: '60%',
    height: '60%',
  },
  buttonGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgb(9, 31, 22)',
  },
  button: {
    width: '45%',
    height: height * 0.15,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 10,
    elevation: 5,
    shadowColor: 'rgb(0, 0, 0)',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgb(50, 50, 50)',
    textAlign: 'center',
  },
  modalCard: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgb(0, 0, 0)',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  modalContent: {
    fontSize: 16,
    color: 'rgb(70, 70, 70)',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'rgb(255, 77, 77)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

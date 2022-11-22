import React from 'react';
import {View} from 'react-native';

const CustomImageSlider = () => {
  return <View></View>;
};

export default CustomImageSlider;

// import React, {cloneElement, createRef, useState,useEffect} from 'react';
// import {
//   Dimensions,
//   FlatList,
//   Image,
//   LayoutAnimation,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   UIManager,
//   View,
// } from 'react-native';
// import {GlobalStyles} from '../../Constants/GlobalStyles';
// import { Indicator } from './Indiacators/Indicators';
// import {ChildItem} from "../ImageSlider/ChildItem"

// const CustomImageSlider = ({data, width, style, data,timer,local,imageKey,
//   separator,loop,autoscroll,currentIndexCallback,onPress}) => {
//   const slider = createRef();

//   console.log(data);
//   const [index, setIndex] = useState();
//   const [imageData, setData] = useState([]);

//   if (Platform.OS === 'android') {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
//    const props = {
//     data: data,
//     imageKey: 'image',
//     local: local,
//     width: Math.round(Dimensions.get('window').width),
//     height: 230,
//     separatorWidth: separator,
//     loop: loop,
//     indicator: true,
//     indicatorStyle: {},
//     indicatorContainerStyle: {},
//     indicatorActiveColor: '#3498db',
//     indicatorInActiveColor: '#bdc3c7',
//     indicatorActiveWidth: 6,
//     animation: true,
//     autoscroll: true,
//     timer: timer,
//     onPress: onPress,
//     contentContainerStyle: {},
//     component: <ChildItem />,
//     currentIndexCallback:currentIndexCallback,
//   };

//   useEffect(() => {
//     if (props.autoscroll) {
//       startAutoPlay();
//     }
//     return () => {
//       if (props.autoscroll) {
//         stopAutoPlay();
//       }
//     };
//   }, []);

//   let sliderTimer;
//   const itemWidth = props.width;
//   const separatorWidth = props.separatorWidth;
//   const totalItemWidth = itemWidth + separatorWidth;

//   changeSliderListIndex = () => {
//     if (props.animation) {
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     }
//     setIndex(index + 1);
//     slider.current({
//       index: index,
//       animated: true,
//     });
//   };

//   // return (
//   //   <FlatList
//   //     showsHorizontalScrollIndicator={false}
//   //     pagingEnabled={true}
//   //     horizontal
//   //     style={{flex: 1, marginTop: 20}}
//   //     data={data}
//   //     renderItem={renderData}
//   //     keyExtractor={(item, index) => index}
//   //     // numColumns={2}
//   //   />

//   // <ScrollView
//   //   horizontal={true}
//   //   style={styles.scrollViewStyle}>
//   //   {data.map((e, index) => {
//   //     // return (
//   //     //   <Pressable key={index + 1}>
//   //     //     <View style={[styles.imageContainer, {width: width}, style]}>
//   //     //       <Image style={styles.imageStyle} source={{uri: e}} />
//   //     //     </View>
//   //     //   </Pressable>
//   //     // );
//   //   })}
//   // </ScrollView>
//   // const renderData = itemData => {
//   //   return (
//   //     <Pressable>
//   //       <View style={[styles.imageContainer, {width: width}, style]}>
//   //         <Image style={styles.imageStyle} source={{uri: itemData.item}} />
//   //       </View>
//   //     </Pressable>
//   //   );
//   // };

//   onViewableItemsChanged = ({viewableItems, changed}) => {
//     if (viewableItems.length > 0) {
//       let currentIndex = viewableItems[0].index;
//       if (
//         currentIndex % props.data.length === props.data.length - 1 &&
//         props.loop
//       ) {
//         setIndex(currentIndex);
//         setData(...data, props.data);
//         // {
//         //   index: currentIndex,
//         //   data: [...this.state.data, ...this.props.data],
//         // });
//       } else {
//         setIndex(currentIndex);
//       }

//       if (props.currentIndexCallback) {
//         props.currentIndexCallback(currentIndex);
//       }
//     }
//   };

//   const viewabilityConfig = {
//     viewAreaCoveragePercentThreshold: 50,
//   };

//   changeSliderListIndex = () => {
//     if (props.animation) {
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     }
//     setIndex(index + 1);
//     slider.current({
//       index: index,
//       animated: true,
//     });
//   };

//   startAutoPlay = () => {
//     sliderTimer = setInterval(changeSliderListIndex, props.timer);
//   };

//   stopAutoPlay = () => {
//     if (sliderTimer) {
//       clearInterval(sliderTimer);
//       sliderTimer = null;
//     }
//   };

//   return (
//     <View>
//       <FlatList
//         ref={slider}
//         horizontal
//         pagingEnabled={true}
//         snapToInterval={totalItemWidth}
//         decelerationRate="fast"
//         bounces={false}
//         contentContainerStyle={props.contentContainerStyle}
//         data={imageData}
//         showsHorizontalScrollIndicator={false}
//         renderItem={({item, index}) =>
//           cloneElement(props.component, {
//             style: {width: props.width},
//             item: item,
//             imageKey: props.imageKey,
//             onPress: props.onPress,
//             index: index % data.length,
//             active: index === index,
//             local: props.local,
//             height: props.height,
//           })
//         }
//         ItemSeparatorComponent={() => (
//           <View style={{width: props.separatorWidth}} />
//         )}
//         keyExtractor={(item, index) => item.toString() + index}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         getItemLayout={(data, index) => ({
//           length: totalItemWidth,
//           offset: totalItemWidth * index,
//           index,
//         })}
//         windowSize={1}
//         initialNumToRender={1}
//         maxToRenderPerBatch={1}
//         removeClippedSubviews={true}
//       />
//       {props.indicator && (
//         <Indicator
//           itemCount={props.data.length}
//           currentIndex={index % props.data.length}
//           indicatorStyle={props.indicatorStyle}
//           indicatorContainerStyle={[
//             styles.indicatorContainerStyle,
//             props.indicatorContainerStyle,
//           ]}
//           indicatorActiveColor={props.indicatorActiveColor}
//           indicatorInActiveColor={props.indicatorInActiveColor}
//           indicatorActiveWidth={props.indicatorActiveWidth}
//           style={{...styles.indicator, ...props.indicatorStyle}}
//         />
//       )}
//     </View>
//   );
// };

// export default CustomImageSlider;

// const styles = StyleSheet.create({
//   scrollViewStyle: {
//     flex: 1,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//   },
//   imageContainer: {
//     width: 100,
//     height: 200,
//     backgroundColor: GlobalStyles.colors.Primary1,
//   },
//   imageStyle: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   image: {
//     height: 230,
//     resizeMode: 'stretch',
//   },
//   indicatorContainerStyle: {
//     marginTop: 18,
//   },
//   shadow: {
//     ...Platform.select({
//       ios: {
//         shadowColor: 'black',
//         shadowOffset: {width: 3, height: 3},
//         shadowOpacity: 0.4,
//         shadowRadius: 10,
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
//   },
// });

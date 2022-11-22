import {Dimensions} from 'react-native';

export const IndicatorStyle = {
  width: Math.round(Dimensions.get('window').width),
  height: 230,
  separatorWidth: 0,
  loop: true,
  indicator: true,
  indicatorStyle: {},
  indicatorContainerStyle: {},
  indicatorActiveColor: '#3498db',
  indicatorInActiveColor: '#bdc3c7',
  indicatorActiveWidth: 6,
  animation: true,
  autoscroll: true,
  timer: 3000,
  onPress: {},
  contentContainerStyle: {},
};

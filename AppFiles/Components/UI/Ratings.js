import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Ratings = ({size, Touchable, howManyStarShow}) => {
  const [nameOntap1, setNameOnTap1] = useState('star-o');
  const [nameOntap2, setNameOnTap2] = useState('star-o');
  const [nameOntap3, setNameOnTap3] = useState('star-o');
  const [nameOntap4, setNameOnTap4] = useState('star-o');
  const [nameOntap5, setNameOnTap5] = useState('star-o');

  const color = '#FFDF00';
  if (Touchable == false) {
    const arr = Array(howManyStarShow).fill(0);
    return (
      <View style={{flexDirection: 'row'}}>
        {arr.map((res, index) => {
          return (
            <View key={index + res} style={styles.StarNotTouchable}>
              <Icon name="star" color={color} size={size} />
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={{flexDirection: 'row'}}>
      <Pressable
        style={styles.StarTouchable}
        onPress={() => {
          const change = nameOntap1 === 'star-o' ? 'star' : 'star-o';
          setNameOnTap1(change);
        }}>
        <Icon name={nameOntap1} color={color} size={size} />
      </Pressable>

      <Pressable
        style={styles.StarTouchable}
        onPress={() => {
          const change = nameOntap2 === 'star-o' ? 'star' : 'star-o';
          setNameOnTap2(change);
        }}>
        <Icon name={nameOntap2} color={color} size={size} />
      </Pressable>

      <Pressable
        style={styles.StarTouchable}
        onPress={() => {
          const change = nameOntap3 === 'star-o' ? 'star' : 'star-o';
          setNameOnTap3(change);
        }}>
        <Icon name={nameOntap3} color={color} size={size} />
      </Pressable>

      <Pressable
        style={styles.StarTouchable}
        onPress={() => {
          const change = nameOntap4 === 'star-o' ? 'star' : 'star-o';
          setNameOnTap4(change);
        }}>
        <Icon name={nameOntap4} color={color} size={size} />
      </Pressable>

      <Pressable
        style={styles.StarTouchable}
        onPress={() => {
          const change = nameOntap5 === 'star-o' ? 'star' : 'star-o';
          setNameOnTap5(change);
        }}>
        <Icon name={nameOntap5} color={color} size={size} />
      </Pressable>
    </View>
  );
};

export default Ratings;
const styles = StyleSheet.create({
  StarTouchable: {
    paddingHorizontal: 2,
    paddingVertical: 20,
  },
  StarNotTouchable: {
    paddingHorizontal: 2,
    paddingVertical: 20,
  },
});

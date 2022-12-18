import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchScreen = ({navigation}) => {
  const {fontScale, width} = useWindowDimensions();
  const route = useRoute();
  const allProducts = route.params.allProducts;
  const [query, setQuery] = useState('');
  const [allItems, setAllItems] = useState(allProducts);
  const tempArray = [
    {
      id: 1,
    },
  ];

  const TextMessage = ({text}) => {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          paddingVertical: fontScale * 50,
        }}>
        <Text
          style={{
            color: GlobalStyles.colors.color2,
            justifyContent: 'center',
          }}>
          {text}
        </Text>
      </View>
    );
  };

  const renderFiltredItems = item => {
    return (
      <Pressable
        android_ripple={{color: '#ddd'}}
        style={styles.itemView}
        onPress={() => {
          navigation.navigate('ProductDescription', {
            id: item.id,
            Images: item.images,
            title: item.title,
            price: item.price,
            description: item.description,
            brand: item.brand,
            category: item.category,
            thumbnail: item.thumbnail,
            rating: Math.round(item.rating),
          });
        }}>
        <Text style={[styles.flatList, {fontSize: fontScale * 14}]}>
          {item.title.toLowerCase()}
        </Text>
        <Icon
          name="open-outline"
          color={GlobalStyles.colors.color6}
          size={fontScale * 25}
        />
      </Pressable>
    );
    // return hero;
  };

  const updateQuery = input => {
    setQuery(input);
    setAllItems(allProducts);
  };

  const filterNames = item => {
    let search = query.toLowerCase();
    const ItemTitle = item.title.toLowerCase();
    if (search.length > 0) {
      if (ItemTitle.includes(search)) {
        return renderFiltredItems(item);
      } else {
        const filterdArray = allItems.filter(item => {
          return item.title.toLowerCase() !== ItemTitle;
        });
        () => setAllItems(filterdArray);
        return null;
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: GlobalStyles.colors.color4}}>
        <View style={[styles.searchBar, {width: width / 1.5}]}>
          <TextInput
            autoFocus={true}
            inlineImagePadding={15}
            inlineImageLeft={'search'}
            style={styles.searchBarTextBox}
            placeholderTextColor={GlobalStyles.colors.color3}
            placeholder="Search Shopera.com"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={updateQuery}
            value={query}
          />
        </View>
      </View>
      <FlatList
        data={query ? allItems : tempArray}
        keyExtractor={item => item.id}
        extraData={query}
        renderItem={({item}) =>
          query ? (
            filterNames(item)
          ) : (
            <TextMessage text={'Search Some Product...'} />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // flexDirection: 'row',
  },
  searchBar: {
    alignSelf: 'center',
    paddingVertical: 15,
  },
  searchBarTextBox: {
    width: '100%',
    color: GlobalStyles.colors.color1,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 15,
    textAlign: 'center',
    elevation: 6,
  },
  cartAndBack: {
    backgroundColor: 'blue',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  flatList: {
    paddingLeft: 15,
    marginTop: 15,
    paddingBottom: 15,
    color: GlobalStyles.colors.color1,
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    borderBottomWidth: 0.3,
  },
});

export default SearchScreen;

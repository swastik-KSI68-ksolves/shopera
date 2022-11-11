import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {
  Card,
  CategorySlider,
  CustomImageSlider,
  UserAvatar,
} from '../../Exporter';
import Icon from 'react-native-vector-icons/Ionicons';

const Home = ({navigation}) => {
  const {fontScale, width, height} = useWindowDimensions();
  const [productsData, setProductsData] = useState();
  const getProductsData = async () => {
    let response = await fetch('https://dummyjson.com/products', {
      method: 'GET',
    });

    let data = await response.json().then(res => res.products);
    setProductsData(data);
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const imageData = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDIC2m4o5Ff_s_BOIL0-y7uq8m_Kqrn0Yq1Q&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5DJHTvBW2WVKBVGXFfxofBGPgnnfnbIAg4Q&usqp=CAU',
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBERERERERERERERERERERERDxERERERGBQZGRgUGBgcIS4lHB4rHxgYJjgmKy8xNTU1GiQ7QDszPy40NTEBDAwMEA8QGhISHjQkISs0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIALcBEwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAABAgAHAwQGBQj/xAA/EAACAQMBBQUECQIEBwEAAAAAAQIDBBEFBhIhMUEiUWFxgRMykcEHFCNCUmKhsdGCkjNTsvBjdIOTo7PiJP/EABsBAAIDAQEBAAAAAAAAAAAAAAECAAMEBQYH/8QAMBEAAgECAwQJBQEBAQAAAAAAAAECAxEEITEFEkFREyJhcYGhsdHwMkJSkcHhkhT/2gAMAwEAAhEDEQA/AO5QUBBR82Wp2mMh0Ih0aIoQKGQEFF6QrGQRR0WJACRACWIUIQBQ6AEIAjAIQhAkIQgQ2IAgQAIAgWADIADGAxWEUAQFbQwrAxmKxGEVgYWAqaGMbFY7FZmmh0IKxmKyodC4IEJAjoZCIdBjqIxkMhUOjTERhGQqGRdEVhQyAFFiQCBIgliFYSIJB0AgQBGAQJCDAIQhCWIAhCACQDPJvNpLOk3F1ozmudOipVpp9zUE8euDzKm2kM4hbVmujqzo0k/Teb/QthQqzXVi34f3QVzitWdQA5FbYVHytqbX/N8f/WZY7Wy4b9nU/wClWpT/AEluheBxC+x+XuDpIczqGKzxKG1dpJ4nOdB91enKnH+/jH9T2qdSM4qUJRnF8VKMlKL8mjLUhKDtNNd6sWpp6BYrGYrKWMBijMVlbGQrFYzFZTIZCMAWKZnqOKQJABGQ6EQ6GiKxojIAyNERGFDIVBRehWMgoCGRYgBREBDDoVhQQIJYgBIQgwCBIQNgECA4faza2FOO5TlLclKUFKnLFW5qLg4UX92KfCVTpyjx4l1GjOtLdh/i7wSkoq7PX17amjbb0IJVasc7y31ClSaxn2k3wT4rsrL4rhxK31ra+ddtVKsqy/y6KlSto+GPen5yNC/p1a8YzrtJLhRt4dmjRi+ajHq++T4s042UF3vwSOhSVClnHrPm/wCLh69pU1OWuRiqazUfCK3Y9IxSjFei4GB39Z8v2PTpafUl/h0HLxefkb1PZ2+l7tKMf6f5LZ42K1aXeyKg2c8r64XKUjPS1q6h95teKPeeyuofhj/YjVr6Hew9+3Ul4Jp/MRY+D0kv2F0HyZjttqHyqwyvA9nTNQp59pa1pUJ8G1B4jJ/mpvMZepzFWjFcKkJU3+Zdn4mrUtJQalB46ppmnpozW7NZduaK3BrNFu6ZtbhqneRjTzwVxDPsG/zrnT8+K8UdWpJpNNNPimuKa7yjtK2gaxTrrei+GX8+B1+kaxOzw4uVWxl70FmU7dP70O+PVw6dO587F7MVnOh/z7e365FtOtwl+ywWKLRrQnCM4SUoTipQlF5jKL5NMY4LNSFYrHYkimQ4jAwsVmaQ4CEIKEZDRFQyY0RWMhkBBRoiKMMhUMi5CMZBQEFFqAMEVBRYhWMiZAEdACEBBrkCQhqarfRtqFStJZ3I9mGcOc21GEF4yk0vUZJt2QL2Od2116NGE6aclCKj9YcHict//Dtod05dWuMY8eqa4qGnTjOFzcJSr1oL2VKC4UaaeIQgukcZ+GepkqRlXrOpUlvwoTm13VruUl7SeO5PsR7lHgdroumSnP6xWWaksbselOHSKNWJrKhH/wA9PP8AJ83yXYuf9YtKG8+kl4dx5GnbJyqpTuJPL5RXJHQWmy9tT+4n5nuxhgcw7smus/Ytc+RqUbGnD3YxXkkZ1TXcOQihFaIDbZj3F3AlSi+aRkYAOKeRLs8u90WhWTU4RefBZOG1vYmdLeqWr3o83RlxT8u4swWUcghKdN3g7dnD9Byep8+3dllyW64Tj70Je8v5Rm0TVpUJqnPjTbw89PiWltPsxC4TqQW5VjxjJdfMq3U9PlGUozju1Ie9Hv8AzLwOzg8cp5PJ8vmq+Mz1aXFHd7O6qrSrCk5J2lzJezeeFvXlh7vhCbfo/M7wo3RbxSjK1rPsTWIt9OPyLS2P1SVxbuFV5r20vYVm+c8LsVf6o4fnky7WwqVq8NHr38/H17WNh5/az32IwsDODI1iMDCxGZpIchABFCFDxEQyY0WBjoZCoY0REYyCgIYtiKFBFQyLRRkEVBLEAZEQAodCjEBkmRrkGOH291GXtbe1pvtr7ZrPHfbdOlw647cv6EduVipO51e6qc4024Q8HBKnH9XN+ppoTVOTqfim136LzaFlHetHmexoGjxzFY+zpJRjn70lzl8Ts6UElhGrp9soQjFdEbdSpGC3pyjCK5ylJRS9WY6ab60tS2b4Ichjo14TWYThNd8JRkv0HLisgGEjAEUAQCMgGQLFbFYwJHK7WaAq8PaU0lVgm08e8uqZ1LFmslbbi1KOqGXJlBX9q4S3opxkny6xkuh02wmqSV3Byz9rF21Z47O+lvUZt9/CcfU93azZ9OXtYLsyaVRLuz7xxrn9XuKrSxinTuIpcM1KFSMopfFnaoVVi6UqPFp+DWa88zLUh0clPtLnYGCMlJJrk0mvJkZ5hu5usK2KwsVlEtR0QhCChCMKgoKAzIhkImMjRFiMZDITIyZcmKOgoVBTLEKOgioKLEAIwpB0xRgihGQDHc1dyEpfhi5fBZK42Ikp3txnnJSn54qf/R220VVxtqmOqx8SobfWZ2lS5q087/s6tGm/wTmo4l6NZ80i+hSdaNWMdbL1uCUtzdbO52m2ylTqO3s5QUqT3a1dxU1Gf+VBPg2urfLlzOT1fU69xK2lXrOrvRqKK3YwUWp4bxHhlpx44OTp3Lapxy+MsybeW25cW2dVrOiV7WVrUnl0pVJ048fdqbu81jxWP7Wdehg1DNcDPKrfI17TUJ2lzTnCTjicd5J4Uot8U+9F4QmpJSXKSTXk1kpDay33N2a6pMuLRKu/a20/xUKTfnuIy7QpqEoyXEelK6ZvZAQBzC4mQNhABhIxGMxWVtjEYoQFbYUYLykpwlF9YtFUaxbOF3RzHszp3ME2/eSpyb9Mx/ctypyKu2xrf/qpST3VRp3ClwXJU5JvivzG/ZLti4orxGdJnd6BXc7S1m+crehJ+bpxPQZ5WzsXG1toPnGhRi/NU0j1GziS1aNIrFYWApHRCAIQIyCmAgAGRMZGNDlsXcRjpjIxodMvixWMg5FQcliYo6CmKgliYo2QiDIdAGRGDJGxrkPB2rn9hJd7RV2qWcXa300u1BWlb++q4S/0tll7TvNOS8M/qV3fXMY291B86to4etOq5R/1HU2M7yminFLqo4p+5lc8P4lz/SHXjU02jUjj7O9tqnpOnUj8/wBClqcuzjxOu1TXHUsI0ZN5l9VkvOC4t/F/E7i0Zjep6G1E41LaE1jjBZ88Fi7F19/TrSX/AAIx9Ytx+RVNxcb9pFZy1HGfQsX6M6u9plBfglWh/wCST+Zy9qLqQl2+qZooatHXEFyE4hqCAAGKyEZ5+o6zbW2FWrQg3yi8uXnhcTzdqto42kNyGJ3M12I81Bfil8kVHq1epObnUm5Tk25NvLbNmFwMq63nlH1K6lVRyL2trmFWCnTnGcJcpReUzIU7sDrztq+7UnuWtROM3JScFUx2GsLg+meCxnwLgUk0mmmmk008prvTMuKoOhU3W7rg/nIspy3lclR8CptrcTupU19/do/92ot5+kYyLUuKijCUnyUW/giorWr9av6lTnClNtd28+zH4RUvii3Zt41Klb8Y+byXzsBWV0o83/pZumvsR8jdNLT1iK8jcOJLVmsDIQDECAgMkIQYYVMICDJjpmMZDxYrMmRkzGMi6LEYyYyYiGTLUxRkMIhkWJgCECDkdMA4smAE2NcBzu0D6d+V8Vw/XBUm0cnCW73qa9Gi19pc7mVzXFeaKx2tob7hOPKTTXk0zbsuW7U77i4hXicpTfBm3Ge9Taz7qTXxS+ZhtaDlGT7nj1BDqn3S+PM9DvLNGCx6qrtUceHxLM+iSrmxqR/Bc1MeThB/yVLOp2N3C+ZaH0Pyf1a5XdXi/jTX8GDaedDxRdQ+ssZBFTJk4FzWQ5/anaSFlBQglUuqi+zp88dN6fh+5k2q2hp6fQ9pLE6s8xo088Zz73+Vc2/TqVnp9eU5zu7me/Vm3Jyl+yXRdMdDoYLB9O9+X0rzKatTdyWp6FSHsoTurmW/XqNuTl0b6HIXbncOVRQl7OMt1zw93exndz34x8V3nv2dCpq106e/7K2pJTua7WY0qecLHfKXKK+SZuba6pQpUqVtQiqdOnBxt6Kw92LfarTf3pSeXl835NnoVFJWWSMTlnmcIptTS9Mdy7i6fo2uXU06Ck8+yq1aSz+FPeS+EijfaPOevMsPR9p46bpdOnBKd3WlVqxg+MaSk92MqnmopqPN56I5e0qMqsIxgrtv+M0UJqLbeh0X0i7RK3o/VqbzcVljEeLhB8M+b5I5/ZjT/ZqEH7/vVH+d816LC9DxNKt51Kk7q5lKpVk95OTy3J9f98F0O10Cjl7z6nPrKOHoulF34t837JGmnect5+B1drHEUbGTFSWEZGeebNZGK2RitihJkgMkCQdMKYiYyYCDBQqYyZEBjpjJmNMZF0dBbGRMKYiYcliYth8jIRMiZYmKOHIuQodMgwGRAY3AB4WvU8wfkVjqs5RThjKTbj+XmW3qNPeiyvtW01uT4F+DmoSaZKiujjrWahmMl2ZPLeOKfeGVhDeqSbWNybjxx2t3gelcWLj0PLq2zyduM953TsZHGxrws5SZbf0cadKhayclh1arn/Skkn+5WlhTm5xWXzRc2hrFGmu6KMO0q0rRh8yLaEFmz1kzX1G+p21KpXqy3adOLlJ9fBJdW3hJd7M6ZWf0papKVSnaRyoU0q1T8837qfglx/q8DDh6XS1FAect1XOM1vWal7dSr1eDfCFPOY0qafZgv3b6ts1by9k0qcXzNGc3lsEJOPafVrhnEu/K7vPxPVwSjFRjkkc93vmdVHV4Wtp7CMFvb0Zbm/JS9r96pLHZmmuz03cLGcnJXNxOpOU5ycpyeZSfVmOtVlKTlJuTby23ltm3plKk5e0rt+xhxlGDxOq+lOL6Z6vovgPm8he0zWWm/Zu5rNwoJ7sOkq8192HgvvS6cubwben2LqT35pRXNR6RRsVJzuqkZzjGEYRUKNGKxToU1yjBfPq22+LNqUkvs4f1v5GTEVvsh+y6nDiz0LZ78oxj7keC/k7jSKG7FHM6HacmdraU8JHmcdVX0o6NJcWbcAsAGzlMuI2BsLYjZCEyQXJBiDphTETGTAQdMKYqYUwEMmQpmNMZMMWAyJjJmJMZMtUhbGRByImHJYmAfIciZDkdMWw4GwZJka4DHWjlHlV9PUm3g9liOIrQyOO1HSM5wjn6+jvPIsupRT6GnUsYvoXU8ROmBwTOG07ScTTx1LB0+nuwS8DXo2UU+R6FOOELUquo7sKiorIzZK6+kW0pynGqnibiozXfjk/hw9CwpvgV/tnBzZbhpNVo2Yk11WV99RTpynzbbjFd2Ocn+xqztJzblLhy4LkvLu8jcnCcJPdbWefcxJRk12m/iejU5czC4o8eUct491PGe89fTrJvEp8Pwp9PENB0oKOY5cctRxwcu9/76Dyqznw5R7kPOpJqyyBGKvdm1K4S7EPWX8G/pdplo1LG0y1wOt0qyxjgc3EVYwjZGmEbs9fSrbCR79NYNO1p4SN1HnKs96VzYskNkVsDZGykIGwNgbA2GxAkEyANiDpjJmJMZMliGRMdMxJjJgCZEwpmLIyYpDMmRMxqQyYwDImNkxJhTLEwWMqCmYt4ZMdMBkJkx7wcj3BYfIcmPIckuSwQNByAJCYCTIrZCElyOb1uy30+B0bZq3FPeFUnFpolrqxWF7prTfA8ytZssu60+Muh5VfSE88Dp0scrZlMqJX7tOPI3LazbfI6KppOHyNm10/HQ0zxitkIqTua+m2GMcDp7O2whLW1wejTjg49eu5s0RjYyQRkyIiZMbLBmxWwNiuRLEC2K2BsVyGsQOSGPIQ2IFSGUiEJYgykNvEIKQKYykQgCDKQVIhAECmNkhBkQKkHeAQcUfeJvEIOtbEAmHISERAZJvBIQgN4G8QgWQjkK2QgvEhhnHJglSRCCENedBPoLCgkQg13YhsQjgyJkIIwomQORCACK5CuRCDWIByFciEGSAxMhIQawD//2Q==',
    'data:image/jpeg;base64,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',
  ];

  const renderProductsCard = itemData => {
    return (
      <Card
        onPress={() =>
          navigation.navigate('ProductDescription', {
            id: itemData.item.id,
            Images: itemData.item.images,
            title: itemData.item.title,
            price: itemData.item.price,
            description: itemData.item.description,
            brand: itemData.item.brand,
            category: itemData.item.category,
            rating: Math.round(itemData.item.rating),
          })
        }
        howManyStar={Math.round(itemData.item.rating)}
        productName={itemData.item.title}
        productPrice={itemData.item.price}
        image={itemData.item.thumbnail}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.aboveContainer}>
        <View style={styles.logoContainer}>
          <View>
            <Pressable
              style={({pressed}) => (pressed ? styles.pressed : null)}
              onPress={() =>
                setTimeout(() => {
                  navigation.openDrawer();
                }, 200)
              }>
              <Icon name="menu" color="white" size={fontScale * 32} />
            </Pressable>
          </View>
          <View>
            <Text style={[styles.logo, {fontSize: fontScale * 16}]}>
              Shopera
            </Text>
          </View>
          <View>
            <UserAvatar
              fontScale={fontScale}
              isImage={false}
              word="S"
              style={{backgroundColor: GlobalStyles.colors.color1}}
              onPress={() => {
                navigation.navigate('userProfile');
              }}
            />
            {/* <Icon name="person-circle" color="white" size={fontScale * 32} /> */}
          </View>
        </View>
        <View style={styles.middleContainer}>
          <Text style={[styles.best, {fontSize: fontScale * 23}]}>
            Browse categories
          </Text>
          <CategorySlider color={'black'} size={25} />
        </View>
      </View>
      <FlatList
        style={{flex: 1, marginTop: 20}}
        data={productsData}
        renderItem={renderProductsCard}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboveContainer: {
    width: '100%',
    flex: 0.5,
    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  middleContainer: {
    flex: 2,
    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    fontWeight: 'bold',
    color: 'white',
  },
  sliderText: {
    color: 'white',
    padding: 10,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.65,
  },
  best: {
    color: 'white',
    fontWeight: '600',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});

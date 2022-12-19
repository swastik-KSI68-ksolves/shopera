import {Card} from '../Exporter';
import {HandleCartButtonClick} from './CartManagement';

const RenderProductsCard = (itemData, Authctx, navigation, whereNavigate) => {
  const itemDetails = {
    id: itemData.item.id,
    Images: itemData.item.images,
    title: itemData.item.title,
    price: itemData.item.price,
    description: itemData.item.description,
    brand: itemData.item.brand,
    category: itemData.item.category,
    thumbnail: itemData.item.thumbnail,
    howMany: 1,
    rating: Math.round(itemData.item.rating),
  };

  const handleCartButton = itemDetails => {
    const {localId} = JSON.parse(Authctx.userInfo);
    HandleCartButtonClick(itemDetails, localId);
  };

  //   const handleHeartButton = itemDetails => {
  //     const {localId} = JSON.parse(Authctx.userInfo);
  //     HandleHeartButtonClick(itemDetails, localId, setIsInWishLIst);
  //   };

  return (
    <Card
      onPress={() =>
        navigation.navigate(whereNavigate, {
          id: itemData.item.id,
          Images: itemData.item.images,
          title: itemData.item.title,
          price: itemData.item.price,
          description: itemData.item.description,
          brand: itemData.item.brand,
          category: itemData.item.category,
          thumbnail: itemData.item.thumbnail,
          rating: Math.round(itemData.item.rating),
          // TODO: isAlreadyAdded
        })
      }
      howManyStar={Math.round(itemData.item.rating)}
      productName={itemData.item.title}
      productPrice={itemData.item.price}
      image={itemData.item.thumbnail}
      onAddPress={handleCartButton.bind(this, itemDetails)}
    />
  );
};
export default RenderProductsCard;

// export default memo(RenderProductsCard);

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  howMany: 0,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    addToCart: (state, payload) => {
      console.log('called add to cart func');
      if (state.cartItems.length < 1) {
        state.cartItems = [];
        state.cartItems = [...payload.payload];
        return;
      } else if (state.cartItems.length > 1) {
        var filterdItems = payload.payload.filter(obj => {
          return !state.cartItems.some(obj2 => {
            return obj.id == obj2.id;
          });
        });
        // const tempArray = state.cartItems;
        // state.cartItems = [];
        state.cartItems = [...state.cartItems, ...filterdItems];
        return;
      }
      return;
    },

    // addToCart: (state, payload) => {
    //   console.log('called add to cart func');
    //   if (state.cartItems.length < 1) {
    //     state.cartItems = [...payload.payload];
    //     return;
    //   } else {
    //     const filterdItems = payload.payload.filter(
    //       item => !state.cartItems.includes(item),
    //     );
    //     state.cartItems = [...state.cartItems, ...filterdItems];
    //     return;
    //   }
    // },

    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(item => {
        return item.id !== itemId;
      });
    },

    increase: (state, {payload}) => {
      state.cartItems.forEach(item => {
        if (item.id === payload) {
          item.howMany += 1;
          return;
        }
      });
    },

    decrease: (state, {payload}) => {
      state.cartItems.forEach(item => {
        if (item.id === payload) {
          if (item.howMany > 1) {
            item.howMany -= 1;
            return;
          }
        }
      });
    },

    clearCart: state => {
      state.cartItems = [];
    },

    calculateTotal: state => {
      let howMany = 0;
      let total = 0;
      state.cartItems.forEach(item => {
        howMany += item.howMany;
        total += item.howMany * item.price;
      });
      state.howMany = howMany;
      state.total = total;
    },
  },
});

export const {
  addToCart,
  clearCart,
  removeItem,
  increase,
  decrease,
  calculateTotal,
} = cartSlice.actions;
export default cartSlice.reducer;

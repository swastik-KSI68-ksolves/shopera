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
      if (state.cartItems.length < 1) {
        state.cartItems = [...payload.payload];
        return;
      } else {
        var filterdItems = payload.payload.filter(
          item => !state.cartItems.includes(item),
        );

        console.log('filterdItems = ', filterdItems);
        const tempArray = state.cartItems;
        state.cartItems = [];
        state.cartItems = [...tempArray, ...filterdItems];
        return;
      }
    },

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

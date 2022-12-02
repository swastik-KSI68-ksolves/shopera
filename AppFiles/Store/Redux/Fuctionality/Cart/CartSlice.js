import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    addToCart: (state, payload) => {
      console.log('payload = ', payload.payload);
      if (state.cartItems.length < 1) {
        state.cartItems = [...payload.payload];
        return;
      } else {
        const filterdItems = payload.payload.filter(cartItems => {
          return state.cartItems.some(previosCartItems => {
            return previosCartItems.id !== cartItems.id;
          });
        });
        const tempArray = state.cartItems;
        state.cartItems = [];
        state.cartItems = [...tempArray, ...filterdItems];
        return;
      }
    },

    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(item => {
        item.id !== itemId;
      });
    },

    increase: (state, {payload}) => {
      const cartItems = state.cartItems.find(item => item.id === payload.id);
      cartItems.amount = cartItems.amount + 1;
    },

    decrease: (state, {payload}) => {
      const cartItems = state.cartItems.find(item => item.id === payload.id);
      cartItems.amount = cartItems.amount - 1;
    },

    clearCart: state => {
      state.cartItems = [];
    },

    calculateTotal: state => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach(item => {
        amount += item.amount;
        total += item.amount - item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const {addToCart, clearCart, removeItem, calculateTotal} =
  cartSlice.actions;
export default cartSlice.reducer;

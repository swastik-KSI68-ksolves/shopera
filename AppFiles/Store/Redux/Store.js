import {configureStore} from '@reduxjs/toolkit';
import CartReducer from './Fuctionality/Cart/CartSlice';

export const myStore = configureStore({
  reducer: {
    cart: CartReducer,
  },
});

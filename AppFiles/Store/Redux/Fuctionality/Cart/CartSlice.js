import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  // notifications: [],
  cartItems: [],
  howMany: 0,
  total: 0,
  // alreadyAddedFromHome: false,
  // notificationsNumber:0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    addToCart: (state, payload) => {
      if (state.cartItems.length < 1) {
        state.cartItems = [];
        state.cartItems = [...payload.payload];
        return;
      } else {
        var filterdItems = payload.payload.filter(obj => {
          return !state.cartItems.some(obj2 => {
            return obj.id == obj2.id;
          });
        });
        state.cartItems = [...state.cartItems, ...filterdItems];
        return;
      }
    },

    // addNotification: (state, payload) => {
    //   if (state.notifications.length < 1) {
    //     state.notifications = [];
    //     state.notifications = [...payload.payload];
    //     return;
    //   } else if (state.notifications.length > 1) {
    //     var filterdItems = payload.payload.filter(obj => {
    //       return !state.notifications.some(obj2 => {
    //         return obj.id == obj2.id;
    //       });
    //     });
    //     state.cartItems = [...state.cartItems, ...filterdItems];
    //     return;
    //   }
    //   return;
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
      console.log('ct runned');
      let howMany = 0;
      let total = 0;
      state.cartItems.forEach(item => {
        howMany += item.howMany;
        total += item.howMany * item.price;
      });
      state.howMany = howMany;
      state.total = total;
    },

    // setAlreadyAddedFromHome: state => {
    //   state.alreadyAddedFromHome = true;
    // },
  },
});

export const {
  addToCart,
  clearCart,
  removeItem,
  increase,
  decrease,
  calculateTotal,
  // setAlreadyAddedFromHome,
} = cartSlice.actions;
export default cartSlice.reducer;

import {ADD_ITEM, REMOVE_ITEM} from '../Redux/ActionTypes';

export const loadItemsToCart = data => ({
  type: LOAD_DATA,
  payload: data,
});

export const addItemToCart = data => ({
  type: ADD_ITEM,
  payload: data,
});

export const removeItemFromCart = index => ({
  type: REMOVE_ITEM,
  payload: index,
});

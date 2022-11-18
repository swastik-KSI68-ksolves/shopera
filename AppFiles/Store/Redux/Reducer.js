import {ADD_ITEM, LOAD_DATA, REMOVE_ITEM} from '../Redux/ActionTypes';

export const Reducers = (state = [], action) => {
  switch (action.type) {
    case ADD_ITEM:
      return [...state, action.payload];

    case REMOVE_ITEM:
      const deleteArray = state.filter((item, index) => {
        return index !== action.payload;
      });

    case LOAD_DATA:
      return ([state] = [...action.payload]);

    default:
      return state;
  }
};

import {configureStore} from '@reduxjs/toolkit';
import {Reducers} from '../Redux/Reducer';

export const myStore = configureStore({reducer: Reducers});

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';
import { jobsReducer } from './job-redux';
import UserReducer from './user-redux';

const AppReducer = combineReducers({
  UserReducer,
  jobsReducer,
});
const persistConfig = {
  key: 'blueclerk_react',
  storage: AsyncStorage,
};

const PersistedReducer = persistReducer(persistConfig, AppReducer);
const store = createStore(PersistedReducer, applyMiddleware(thunk));

export default store;

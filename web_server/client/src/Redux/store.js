import { createStore } from 'redux'
import reducer from './reducer'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

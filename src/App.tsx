import React from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import store from './redux/store';
import AppContainer from './navigation';
import 'react-native-gesture-handler';

const persistor = persistStore(store);
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <AppContainer />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

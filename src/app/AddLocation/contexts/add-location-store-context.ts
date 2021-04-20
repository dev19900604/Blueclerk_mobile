import { createContext } from 'react';
import LocationDetailStore from '../stores/location-detail-store';

type Context = {
  store: LocationDetailStore;
};

const AddLocationtStoreContext = createContext<Context>({
  store: new LocationDetailStore(''),
});

export default AddLocationtStoreContext;

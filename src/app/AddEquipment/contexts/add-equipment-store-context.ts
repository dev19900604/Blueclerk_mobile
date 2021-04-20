import { createContext } from 'react';
import EquipmentDetailStore from '../stores/equipment-detail-store';

type Context = {
  store: EquipmentDetailStore;
};

const AddEquipmentStoreContext = createContext<Context>({
  store: new EquipmentDetailStore(''),
});

export default AddEquipmentStoreContext;

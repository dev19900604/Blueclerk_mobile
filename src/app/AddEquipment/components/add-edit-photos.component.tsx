import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  FlatList,
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from 'mobx-react';
import ImagePicker from '@fancydevpro/react-native-image-picker';
import { Center } from '../../../styles/shared-styles';
import Tag from '../../../common/tag.component';
import { blue, turquoise } from '../../../styles/colors';
import AddPhotosStore from '../stores/add-photos-store';
import AddEquipmentStoreContext from '../contexts/add-equipment-store-context';
import { getViewForTaskStatus, TaskType } from '../../../utils/util-methods';

type Props = {
  style?: StyleProp<ViewStyle>;
};

function AddEditPhotos({ style }: Props) {
  const storeRef = useRef(new AddPhotosStore());
  const { store: addEquipmentStore } = useContext(AddEquipmentStoreContext);

  useEffect(() => {
    addEquipmentStore.photosStore = storeRef.current;
  }, []);

  const openPicker = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        mediaType: 'photo',
        noData: true,
        maxHeight: 400,
        maxWidth: 400,
        storageOptions: { skipBackup: true },
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        storeRef.current.addImage(response.uri);
      },
    );
  }, []);

  if (storeRef.current.localUris.length > 0) {
    return (
      <View>
        <FlatList
          style={style}
          data={storeRef.current.localUris}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
        <TouchableOpacity style={styles.addPhotosBtn} onPress={() => openPicker()}>
          <Tag>Add photos</Tag>
        </TouchableOpacity>
        {getViewForTaskStatus(storeRef.current.addImage as TaskType)}
      </View>
    );
  }

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={() => openPicker()}>
      <Tag>Add photos</Tag>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="plus" color={turquoise} size={50} />
      </View>
    </TouchableOpacity>
  );
}

export default observer(AddEditPhotos);

const styles = StyleSheet.create({
  container: {
    ...Center,
    height: 88,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: blue,
    borderStyle: 'dashed',
  },
  iconContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    ...Center,
  },
  image: {
    width: 80,
    height: 80,
  },
  addPhotosBtn: {
    alignSelf: 'center',
    marginTop: 15,
  },
});

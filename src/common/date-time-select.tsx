import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextField from './text-field';

import styles from '../styles/styles';

export default ({
  style,
  value,
  onConfirm,
  ...rest
}: any) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = (datetime) => {
    if (onConfirm) {
      onConfirm(datetime);
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <TextField
          {...rest}
          pointerEvents="none"
          style={style}
          value={value}
          editable={false}
        />
        <MaterialIcons name="arrow-drop-down" size={24} style={styles.arrowDropdown} />
      </TouchableOpacity>
      <DateTimePickerModal
        date={new Date()}
        mode="datetime"
        isVisible={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

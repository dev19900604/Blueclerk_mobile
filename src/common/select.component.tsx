import React, { useRef, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  View,
  TextInput,
  Text,
} from 'react-native';
import ActionSheet, {
  addHasReachedTopListener,
  removeHasReachedTopListener,
} from 'react-native-actions-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'react-native-paper';
import TextField, { TextFieldProps } from './text-field';
import { destructiveRed } from '../styles/colors';
import styles from '../styles/styles';

type Props = TextFieldProps & {
  options: string[];
  onSelect?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  value?: string;
  addNew?: (txt: string) => void;
  newPlaceholder?: string;
  topTitle?: string;
};

function Select({
  topTitle,
  value,
  style,
  options,
  newPlaceholder,
  onSelect,
  addNew,
  containerStyle,
  ...rest
}: Props) {
  const actionSheetRef = useRef();
  const [addnewText, setaddnewText] = useState('');
  const [nestedScrollEnabled, setNestedScrollEnabled] = useState(false);
  const _onHasReachedTop = (hasReachedTop) => {
    setNestedScrollEnabled(hasReachedTop);
  };

  useEffect(() => {
    addHasReachedTopListener(_onHasReachedTop);
    return () => {
      removeHasReachedTopListener(_onHasReachedTop);
      if (actionSheetRef.current) {
        actionSheetRef.current.setModalVisible(false);
      }
    };
  }, []);

  return (
    <View>
      <TouchableOpacity
        style={[containerStyle]}
        onPress={() => {
          actionSheetRef.current.setModalVisible();
        }}
      >
        <TextField
          {...rest}
          pointerEvents="none"
          value={value}
          style={style}
          editable={false}
        />
        <MaterialIcons name="arrow-drop-down" size={24} style={styles.arrowDropdown} />
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        extraScroll={30}
        gestureEnabled
        keyboardShouldPersistTaps="handled"
      >
        <ScrollView
          contentContainerStyle={{ marginHorizontal: 20 }}
          nestedScrollEnabled
          scrollEnabled={nestedScrollEnabled}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 15, color: '#AAAAAA' }}>
              {topTitle ? topTitle : ''}
            </Text>
            <TouchableOpacity
              onPress={() => {
                actionSheetRef.current.setModalVisible(false);
                setaddnewText('');
              }}
            >
              <Text style={{ fontSize: 15, color: destructiveRed }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {options.map((option, index) => (
            <TouchableOpacity
              onPress={() => {
                onSelect?.(index);
                actionSheetRef.current.setModalVisible(false);
              }}
            >
              <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
          {addNew && (
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                style={{
                  flex: 1,
                  minHeight: 50,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#f0f0f0',
                  marginBottom: 15,
                  paddingHorizontal: 10,
                  marginRight: 10,
                }}
                value={addnewText}
                onChangeText={(text) => setaddnewText(text)}
                placeholder={newPlaceholder}
              />
              <View>
                <Button
                  mode="contained"
                  style={{ backgroundColor: '#1fb2e2' }}
                  disabled={addnewText ? false : true}
                  onPress={() => {
                    addNew?.(addnewText);
                    setaddnewText('');
                    actionSheetRef.current.setModalVisible(false);
                  }}
                >
                  Add new
                </Button>
              </View>
            </View>
          )}
        </ScrollView>
      </ActionSheet>
    </View>
  );
}

export default Select;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

function EmptyView(props: any) {
  return (
    <View style={styles.container}>
      <View style={styles.radius}>
        <Icon fontSize={30} name={props.icon} />
      </View>
      <View style={styles.emptyView} {...props}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.message}>{props.message}</Text>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyView: {},
  title: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  message: {
    fontFamily: 'SlateForOnePlus-Regular',
  },
  radius: {
    marginVertical: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
});

export default EmptyView;

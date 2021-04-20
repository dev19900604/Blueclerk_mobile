import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import colors from '../styles/colors';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={24} color={colors.dark_grey} />
      </View>
    );
  }
}

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import ToSContent from '../../common/tos-content';
import { Header } from '../../common/common-header';

export default class ToS extends React.Component<any, any> {
  static navigationOptions = {
    headerShown: false,
  };

  _handleback = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          title="Terms of Service"
          leftIcon="goback"
          _goBack={() => this._handleback()}
        />
        <ToSContent />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
});

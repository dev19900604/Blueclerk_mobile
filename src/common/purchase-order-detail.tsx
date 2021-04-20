import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { turquoise } from '../styles/colors';

import { Header } from './common-header';

export default ({ route, navigation }: any) => {
  const { order } = route.params;
  const date = moment(order.createdAt);
  const isToday = date.isSame(new Date(), 'day');
  const txtStyle = isToday ? {} : { color: '#999' };
  const createdAt = isToday
    ? `Today ${date.format('h:mm A')}`
    : date.format('MMMM DD, h:mm A');
  const client = _.get(order.customer, 'profile.displayName', ' --- ');

  const renderStatus = (status: any) => {
    switch (status) {
      case 0:
        return (
          <MaterialIcons
            name="location-on"
            size={30}
            color={turquoise}
            onPress={openJobLocationInMaps}
          />
        );
      case 1:
        break;
    }

    const statusInfo = {
      1: { text: 'STARTED', icon: 'play-arrow', color: '#32CD32' },
      2: { text: 'COMPLETED', icon: 'check-circle', color: '#F19162' },
      3: { text: 'CANCELLED', icon: 'not-interested', color: '#f00' },
    };
    const { text, icon, color } = statusInfo[status];

    return (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={styles.value}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Purchase Order" leftIcon="goback" _goBack={() => navigation.pop()} />
      <ScrollView style={styles.viewContainer}>
        <View style={styles.heading}>
          <Text style={styles.workTitle}>{order.purchaseOrderId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          {renderStatus(order.status)}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Created</Text>
          <Text style={[styles.dateLabel, txtStyle]}>{createdAt}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Client</Text>
          <Text style={styles.value}>{client}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Invoice Created</Text>
          <Text style={styles.value}>{order.invoiceCreated ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Note</Text>
          <Text style={styles.value}>{order.note}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Items</Text>
          {order.items.map((item) => (
            <Text style={styles.value}>{item}</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    padding: 16,
  },
  heading: {
    marginTop: 15,
    marginBottom: 25,
  },
  workTitle: {
    fontFamily: 'SlateForOnePlus-Regular',
    fontSize: 16,
    color: '#686767',
  },
  subTitle: {
    fontFamily: 'SlateForOnePlus-Regular',
    color: '#ACABAE',
  },
  row: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: 'lightgray',
    borderTopWidth: 0.5,
  },
  column: {
    paddingVertical: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderTopColor: 'lightgray',
    borderTopWidth: 0.5,
  },
  label: {
    fontFamily: 'SlateForOnePlus-Regular',
    fontSize: 13,
    color: '#686767',
    fontWeight: '100',
  },
  value: {
    fontFamily: 'SlateForOnePlus-Regular',
    fontWeight: '200',
    color: '#7987DA',
  },
  note: {
    fontFamily: 'SlateForOnePlus-Regular',
    marginTop: 5,
    fontSize: 12,
    color: '#7987DA',
  },
  btnWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 25,
  },
  notelbl: {
    paddingVertical: 12,
    borderTopColor: 'lightgray',
    borderTopWidth: 0.5,
  },
  nlabel: {
    fontFamily: 'SlateForOnePlus-Regular',
    fontSize: 13,
    color: '#686767',
    fontWeight: '100',
  },
  emptyInfo: {
    borderTopColor: 'lightgray',
    borderTopWidth: 0.5,
    paddingVertical: 25,
    alignItems: 'center',
  },
  emptyText: {
    color: 'gray',
    fontFamily: 'SlateForOnePlus-Regular',
  },
  unitTitle: {
    marginTop: 10,
    paddingBottom: 12,
  },
  unitText: {
    fontSize: 15,
    fontFamily: 'SlateForOnePlus-Regular',
    color: '#686767',
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});

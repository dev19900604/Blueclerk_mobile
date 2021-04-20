import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Label from './label';
import colors, { turquoise, white } from '../styles/colors';
import { Row } from '../styles/shared-styles';

const _ = require('lodash');

const SCREEN_WIDTH = Dimensions.get('window').width;

export default ({ navigation, order }: any) => {
  const date = moment(order.createdAt);
  const isToday = date.isSame(new Date(), 'day');
  const txtStyle = isToday ? {} : { color: '#999' };
  const title = isToday
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
            onPress={this.openJobLocationInMaps}
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
        <MaterialIcons
          name={icon}
          size={18}
          color={color}
          style={[
            styles.completedMark,
            { borderColor: color },
            text == 'COMPLETED' && { borderWidth: 1 },
          ]}
        />
        <Text style={{ color }}>{text}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.push('ViewPurchaseOrder', { order })}
    >
      <View style={{ flex: 1 }}>
        <Label style={{ color: turquoise }}>PurChase Order</Label>
        <Text style={[styles.dateLabel, txtStyle]}>{title}</Text>
        <View style={styles.detailRow}>
          <Label style={styles.keyLabel}>Client</Label>
          <Text style={[styles.valueLabel, txtStyle]}>{client}</Text>
        </View>
        <View style={styles.detailRow}>
          <Label style={styles.keyLabel}>Note</Label>
          <Text style={[styles.valueLabel, txtStyle]}>{order.note}</Text>
        </View>
      </View>
      <View style={styles.jobIdContainer} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SCREEN_WIDTH * 0.01,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOpacity: 1,
    elevation: 3,
    ...Row,
    backgroundColor: white,
    borderRadius: 4,
    borderColor: turquoise,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  detailRow: {
    ...Row,
    marginTop: 5,
  },
  keyLabel: {
    color: '#999',
    width: 50,
  },
  valueLabel: {
    marginStart: 10,
    fontSize: 16,
  },
  jobIdContainer: {
    alignItems: 'flex-end',
  },
  jobIdText: {
    fontSize: 14,
    marginEnd: 5,
    color: colors.colorBlue,
    fontWeight: '600',
  },
  completedMark: {
    borderRadius: 100,
    borderColor: '#f00',
    paddingLeft: 2,
    marginRight: 4,
  },
});

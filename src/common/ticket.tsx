import React from 'react';
import { Dimensions, Text, StyleSheet, View } from 'react-native';
import moment from 'moment';
import _ from 'lodash';

import Label from './label';
import colors, { white } from '../styles/colors';
import { Row } from '../styles/shared-styles';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default ({ ticket, keyword }: any) => {
  const date = moment(ticket.createdAt);
  const isToday = date.isSame(new Date(), 'day');
  const txtStyle = isToday ? {} : { color: '#999' };
  const title = isToday
    ? `Today ${date.format('h:mm A')}`
    : date.format('MMMM DD, h:mm A');
  const client = _.get(ticket.customer, 'profile.displayName', ' --- ');

  if (keyword) {
    if (
      !title.includes(keyword) &&
      !client.includes(keyword) &&
      !ticket.ticketId.includes(keyword)
    ) {
      return null;
    }
  }

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.dateLabel, txtStyle]}>{title}</Text>
        <View style={styles.detailRow}>
          <Label style={styles.keyLabel}>Client</Label>
          <Text style={[styles.valueLabel, txtStyle]}>{client}</Text>
        </View>
      </View>
      <View style={styles.jobIdContainer}>
        <Label style={[styles.jobIdText]}>#{ticket.ticketId}</Label>
      </View>
    </View>
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
    justifyContent: 'flex-end',
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

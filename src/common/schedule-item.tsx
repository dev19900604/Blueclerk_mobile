import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import moment from 'moment';

export default function ScheduleItem({ route, navigation, job }: any) {
  const {
    dateTime,
    type,
    customer,
    status,
  } = job;

  const getStatusColor = (jobStatus: number) => {
    switch (jobStatus) {
      case 0:
        return { color: 'red' };
      case 1:
        return { color: '#00bfff' };
      case 2:
        return { color: '#29CB41' };
      default:
        return { color: '#00bfff' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.event}>
        <Text style={styles.etime}>{moment(dateTime).format('LT')}</Text>
        <View style={styles.ename}>
          <View style={styles.statusContainer}>
            <Text style={[styles.dot, getStatusColor(status)]}>{'\u2B24'}</Text>
            <Text style={styles.name}>
              {type && type.title ? type.title : 'Title not found'}
            </Text>
          </View>
          <Text style={styles.desc}>
            {customer && customer.profile ? customer.profile.displayName : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  event: {
    padding: 10,
    flexDirection: 'row',
  },
  etime: {
    fontFamily: 'SlateForOnePlus-Regular',
    flex: 3,
    color: '#353535',
    paddingVertical: 2,
  },
  desc: {
    paddingLeft: 15,
    fontFamily: 'SlateForOnePlus-Regular',
    paddingVertical: 2,
    color: '#A1A1A1',
  },
  name: {
    fontFamily: 'SlateForOnePlus-Regular',
    fontSize: 16,
    color: '#353535',
    paddingVertical: 2,
  },
  ename: {
    paddingBottom: 10,
    flex: 7,
    borderBottomColor: '#ADADAD',
    borderBottomWidth: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    paddingRight: 8,
    color: '#29CB41',
    fontSize: 8,
  },
});

import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

function GroupItem(props: any) {
  return (
    <TouchableOpacity
      style={styles.container}
      key={props.Itemkey}
      onPress={() => props.onClick()}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{props.name}</Text>
          <Text style={styles.members}>{`${props.members} members`}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

export default GroupItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'gray',
    shadowOpacity: 1,
    elevation: 3,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 16,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  members: {
    fontSize: 12,
    color: 'gray',
    fontFamily: 'SlateForOnePlus-Regular',
  },
});

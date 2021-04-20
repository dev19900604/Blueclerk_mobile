import React, { useEffect, useState } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { Header } from './common-header';
import styles from '../styles/styles';
import { Service } from '../config/services';
import Ticket from './ticket';
import TextField from './text-field';

export default ({ navigation }: any) => {
  const [tickets, setTickets] = useState<any>([]);
  const [keyword, setKeyword] = useState('');
  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Service.getServiceTickets().then((ticketsData) => {
      setTickets(ticketsData);
    });
  }, []);

  const handleTicket = (serviceTicket) => {
    navigation.push('GenerateJobFromTicket', { serviceTicket });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    Service.getServiceTickets().then((ticketsData) => {
      setRefreshing(false);
      setTickets(ticketsData);
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Generate Job"
        leftIcon="back"
        elevation="0"
        rightIcon="Cancel"
        _goBack={() => navigation.goBack()}
      />
      <View style={{ margin: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, margin: 5 }}>
          Service Tickets
        </Text>
        <FlatList
          data={tickets}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{ marginBottom: 10, flexGrow: 1 }}
          ListHeaderComponent={(
            <View style={{ marginBottom: 20 }}>
              <TextField
                title="search keyword"
                placeholder="keyword"
                style={styles.textInput}
                onChangeText={(txt) => setKeyword(txt)}
              />
            </View>
          )}
          renderItem={({ item, index }) => (
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleTicket(item)}>
              <Ticket keyword={keyword} ticket={item} />
            </TouchableOpacity>
          )}
          refreshControl={(
            <RefreshControl
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
            />
        )}
        />
      </View>
    </View>
  );
};

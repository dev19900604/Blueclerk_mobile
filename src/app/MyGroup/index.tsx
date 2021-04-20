import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  Keyboard,
  FlatList,
} from 'react-native';
import { DrawerActions } from '@react-navigation/compat';
import styles from './styles';
import { Service } from '../../config/services';
import Loading from '../../common/loading';
import EmptyView from '../../common/empty-view';
import GroupItem from '../../common/group-item';
import { getStorageItem } from '../../helpers';
import Header from '../../common/common-header';

const { getGroups } = Service;

export default function MyGroups({ navigation }: any) {
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);
  const [user, setUser] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);

  const getUser = async () => {
    let user = await getStorageItem('user');

    user = JSON.parse(user);
    return user;
  };

  useEffect(() => {
    const user = getUser();
    setUser(user);
    getCompanyGroups();
  }, []);

  const getCompanyGroups = async () => {
    try {
      const response = await getGroups();
      const { status, groups } = response.data;
      if (status == 1) {
        if (user.permissions.role != 1) {
          setisLoading(false);
          setData(groups);
          setisRefreshing(false);
          if (data.length === 0) {
            setIsEmpty(true);
          } else {
            setIsEmpty(false);
          }
        } else {
          filterGroups(groups);
        }
      } else {
        setisLoading(false);
        setisRefreshing(false);
        setIsEmpty(true);
        Alert.alert('Error', 'Something is went wrong');
      }
    } catch (err) {
      setisLoading(false);
      setisRefreshing(false);
      setIsEmpty(true);
      Alert.alert('Error', 'Something is went wrong');
    }
  };

  const filterGroups = (groups: any) => {
    const f = groups.filter((group) => {
      const res = group.members.find((member) => member._id == user._id);
      if (res) {
        return true;
      }
    });

    setisLoading(false);
    setData(f);
    setisRefreshing(false);

    if (data.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  };

  const _openMenu = () => {
    Keyboard.dismiss();
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const _navigateToMembers = (item: any) => {
    navigation.navigate('GroupMembers', {
      members: item.members,
      title: item.title,
    });
  };

  const _renderItem = ({ item }: any) => (
    <GroupItem
      Itemkey={item._id}
      onClick={() => _navigateToMembers(item)}
      name={item.title}
      members={item.members.length}
    />
  );

  const _listEmptyComponent = () => (
    <EmptyView
      icon="ios-people"
      title="No Groups"
      message="Company Groups will appear here"
    />
  );

  const _handleRefresh = () => {
    setisRefreshing(true);
    getCompanyGroups();
  };

  return (
    <View style={styles.container}>
      <Header title="My Group" leftIcon="menu" _openMenu={() => _openMenu()} />
      {isLoading && <Loading />}
      <View style={{ flex: 1 }}>
        {!isEmpty ? (
          <FlatList
            refreshing={isRefreshing}
            onRefresh={_handleRefresh}
            data={data}
            extraData={isRefreshing}
            renderItem={_renderItem}
            keyExtractor={(item) => item._id}
          />
        ) : (
          _listEmptyComponent()
        )}
      </View>
    </View>
  );
}

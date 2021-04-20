/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { View, Keyboard, Alert, Text } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Icon } from 'native-base';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { StackNavigationOptions } from '@react-navigation/stack';
import styles from './styles';
import { logEvent } from '../../helpers';
import { Service } from '../../config/services';
import { Header } from '../../common/common-header';
import ScheduleItem from '../../common/schedule-item';
import EmptyView from '../../common/empty-view';

const { getJobs } = Service;

export default function Schedule({ navigation }: any) {
  const options: StackNavigationOptions = {
    headerLeft: ({ tintColor }: any) => (
      <Icon name="ios-time" style={{ fontSize: 24, color: tintColor }} />
    ),
  };

  const [isLoading, setisLoading] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [eventDate, setEventDEate] = useState(moment(new Date()).format('dddd MMMM DD'));
  const [current, setCurrent] = useState(new Date());

  useEffect(() => {
    logEvent('schedule_screen');
  }, []);

  useEffect(() => {
    _getAllJobs();
  }, []);

  const _getAllJobs = async () => {
    _getJobs('');
  };

  const _sortJobList = (jobs) =>
    jobs.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  const _getJobs = async (token: any) => {
    const data = {
      includeActive: 'true',
      includeNonActive: 'true',
    };

    try {
      const response = await getJobs(data);
      const { status, jobs } = response.data;
      if (status == 1) {
        setisLoading(false);
        setData(_sortJobList(jobs));
        setAllJobs(_sortJobList(jobs));
        const filter_jobs = _sortJobList(jobs).filter(
          (job) =>
            moment(current).format('YYYY-MM-DD') ==
            moment(job.scheduleDate).format('YYYY-MM-DD')
        );

        if (filter_jobs.length != 0) {
          setFilterData(filter_jobs);
        }

        setisRefreshing(false);

        // eslint-disable-next-line no-unused-expressions
        () => {
          // eslint-disable-next-line no-unused-expressions
          allJobs.length == 0 ? setIsEmpty(true) : setIsEmpty(false);
        };
      } else {
        setisLoading(false);
        setisRefreshing(false);
        setIsEmpty(true);
        () => {
          Alert.alert('Error', 'Something is went wrong');
        };
      }
    } catch (err) {
      setisLoading(false);
      setisRefreshing(false);
      setIsEmpty(true);
      () => {
        Alert.alert('Error', 'Something is went wrong');
      };
    }
  };

  const retrieveData = async (name: any) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (error) {}
  };

  const _openMenu = () => {
    Keyboard.dismiss();
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const getJobOnDate = (searchDate: any) => {
    const d = {};
    d[searchDate.dateString] = { selected: true };
    setMarkedDates(d);
    setCurrent(searchDate.dateString);
    filterJobs(searchDate.dateString);
  };

  const filterJobs = (date: any) => {
    const jobs = allJobs.filter(
      (job) =>
        moment(date).format('YYYY-MM-DD') == moment(job.scheduleDate).format('YYYY-MM-DD')
    );
    setData(jobs);
    setFilterData(jobs);
    setEventDEate(moment(date).format('dddd MMMM DD'));
  };

  const _renderItem = ({ item }: any) => <ScheduleItem job={item} />;

  const renderEmptyView = () => (
    <EmptyView
      title="No Jobs"
      message="Scheduled jobs will appear here"
      icon="ios-hammer"
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Schedule" leftIcon="menu" _openMenu={() => _openMenu()} />
      <ScrollView>
        <Calendar
          current={current}
          markedDates={markedDates}
          firstDay={1}
          onDayPress={(day) => getJobOnDate(day)}
          horizontal
          onMonthChange={() => {}}
          pagingEnabled
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#ffffff',
            todayBackgroundColor: '#7C4DFF',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: 'orange',
            monthTextColor: '#00adf5',
            indicatorColor: '#00adf5',
            textDayFontWeight: '300',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
            textDayFontFamily: 'SlateForOnePlus-Regular',
            textMonthFontFamily: 'SlateForOnePlus-Regular',
          }}
        />
        <FlatList
          style={styles.FlatList}
          ListHeaderComponent={() => <Text style={styles.heading}>{eventDate}</Text>}
          renderItem={_renderItem}
          keyExtractor={(item, key) => item._id}
          data={current == new Date() ? data : filterData}
          ListEmptyComponent={renderEmptyView}
        />
      </ScrollView>
    </View>
  );
}

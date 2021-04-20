import React, { useState, useEffect, useRef } from 'react';
import { Alert, FlatList, ScrollView } from 'react-native';

import { Tab, Tabs } from 'native-base';
import ActionSheetCustom from 'react-native-actionsheet';
import { MenuProvider } from 'react-native-popup-menu';
import { DrawerActions } from '@react-navigation/compat';
import Loading from '../../common/loading';
import EmptyView from '../../common/empty-view';
import Footer from '../../common/footer';
import { Service } from '../../config/services';
import Job from '../../common/job';
import { Header } from '../../common/common-header';
import { styles } from './styles';
import { logEvent } from '../../helpers';

const { getJobs, startJob } = Service;
const tabs = ['All', 'Open', 'Closed'];
const START_JOB = 'Start Job';
const DELEGATE_JOB = 'Transfer Job';
const FINISH_JOB = 'Finish Job';
const PAUSE_JOB = 'Pause/Stop Job';
const SEE_DETAILS = 'See Details';
const SCAN_EQUIPMENT = 'Scan Equipment';
const VIEW_HISTORY = 'View Job History';
const CANCEL = 'Cancel';

export function MySchedule({ navigation }: any) {
  const ActionSheet = useRef();
  const [isLoading, setisLoading] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [actionOptions, setActionOptions] = useState([]);
  const [selectedJob2, setselectedJob2] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);
  const [cancelIndex, setCancelIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    logEvent('schedule_screen');
    _getAllJobs();
  }, []);

  const _getAllJobs = async () => {
    await _getJobs();
  };

  const _presentActionSheet = (selectedJob: any) => {
    const actionOptions = getActions(selectedJob);
    setActionOptions(actionOptions);
    setselectedJob2(selectedJob);
    ActionSheet.current.show();
  };

  const _handleOptionsClick = (index) => {
    if (actionOptions[index] == START_JOB) {
      if (data.some((item) => item.status == '1')) {
        Alert.alert(
          'Error',
          'Job already in progress. To start this job, you must pause the current job'
        );
      } else {
        _startJob();
      }
    } else if (actionOptions[index] == VIEW_HISTORY) {
      navigation.navigate('ViewHistory');
    } else if (actionOptions[index] == PAUSE_JOB) {
      updateJob(0);
    } else if (actionOptions[index] == FINISH_JOB) {
      updateJob(2);
    } else if (actionOptions[index] == SEE_DETAILS) {
      navigation.navigate('Report', { job: selectedJob2 });
    } else if (actionOptions[index] == SCAN_EQUIPMENT) {
      _handleJob(selectedJob2, 'AssignEquipments');
    } else if (actionOptions[index] == DELEGATE_JOB) {
      _handleJob(selectedJob2, 'DelegateJob');
    }
  };

  const _startJob = async () => {
    const param = {
      jobId: selectedJob2._id,
    };

    try {
      const response = await startJob(param);
      const { status, message } = response.data;
      if (status == '1') {
        Alert.alert('Success', message);
        _getAllJobs();
      } else {
        Alert.alert('Error', message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something has gone wrong');
    }
  };

  const updateJob = async (status: any) => {
    const data = {
      jobId: selectedJob2._id,
      status,
      comment: selectedJob2.comment,
    };

    try {
      const response = await updateJob(data);

      const { status, message } = response.data;
      if (status == 1) {
        Alert.alert('Success', message);
        _getAllJobs();
      } else {
        Alert.alert('Error', message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something has gone wrong');
    }
  };

  const getActions = (job: any) => {
    const options: string[] = [];
    if (job.status == 0) {
      options.unshift(CANCEL);
      options.unshift(VIEW_HISTORY);
      options.unshift(DELEGATE_JOB);
      options.unshift(SEE_DETAILS);
      options.unshift(START_JOB);
      setCancelIndex(4);
    } else if (job.status == 1) {
      options.unshift(CANCEL);
      options.unshift(VIEW_HISTORY);
      options.unshift(FINISH_JOB);
      options.unshift(SEE_DETAILS);
      options.unshift(SCAN_EQUIPMENT);
      options.unshift(PAUSE_JOB);
      setCancelIndex(5);
    } else if (job.status == 2) {
      options.unshift(CANCEL);
      options.unshift(SEE_DETAILS);
      setCancelIndex(1);
    } else if (job.status == 3) {
      options.unshift(CANCEL);
      options.unshift(SEE_DETAILS);
      setCancelIndex(1);
    }
    return options;
  };

  const _getJobs = async () => {
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
        setisRefreshing(false);

        if (allJobs.length === 0) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
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

  const _sortJobList = (jobs) =>
    jobs.sort(
      (a, b) =>
        Math.abs(Date.now() - new Date(a.dateTime)) -
        Math.abs(Date.now() - new Date(b.dateTime))
    );

  const _handleJob = (item: any, route: any) => {
    navigation.push(route, { item });
  };

  const _getTypeIcon = (title: any) => {
    if (title.trim() === 'Repair') return 'ios-hammer';
    if (title.trim() === 'Diagnosis') return 'md-bug';
    if (title.trim() === 'Maintenance') return 'ios-build';
    if (title.trim() === 'Installation') return 'ios-download';
    return 'ios-hammer';
  };

  const getJobStatus = (item: any) => {
    let status = 'Not Started';
    if (item.status == '0') status = 'Not Started';
    else if (item.status == '1') status = 'Started';
    else if (item.status == '2') status = 'Completed';
    else if (item.status == '3') status = 'Cancelled';

    return status;
  };

  const _renderItem = ({ item }) => {
    const status = getJobStatus(item);
    const type = _getTypeIcon(item.type.title);

    if (currentTab === 1) {
      if (item.status === 0) {
        return (
          <Job
            item={item}
            type={type}
            status={status}
            onClick={() => _presentActionSheet(item)}
          />
        );
      }
    } else if (currentTab === 2) {
      if (item.status === 2 || item.status === 3) {
        return (
          <Job
            item={item}
            type={type}
            status={status}
            onClick={() => _presentActionSheet(item)}
          />
        );
      }
    } else {
      return (
        <Job
          item={item}
          type={type}
          status={status}
          onClick={() => _presentActionSheet(item)}
        />
      );
    }
  };

  const _listEmptyComponent = () => (
    <EmptyView
      title="No Jobs"
      icon="ios-hammer"
      message="Assigned Jobs will appear here"
    />
  );

  const _handleRefresh = () => {
    setisRefreshing(true);
    _getAllJobs();
  };

  return (
    <MenuProvider style={styles.container}>
      <Header title="My Schedule" _goBack={() => navigation.goBack()} elevation="0" />
      <Tabs
        tabBarUnderlineStyle={{ width: 0 }}
        tabContainerStyle={styles.tabContainerStyle}
        onChangeTab={(tab) => setCurrentTab(tab.i)}
      >
        {tabs.map((tab) => (
          <Tab
            heading={tab}
            activeTabStyle={{ backgroundColor: '#fff', borderRadius: 5 }}
            activeTextStyle={{ color: '#505560', fontWeight: 'bold' }}
            tabStyle={{ backgroundColor: '#505560' }}
            textStyle={{ color: '#fff' }}
          >
            {isLoading && <Loading />}
            <ScrollView style={styles.listWrapper}>
              {!isEmpty ? (
                <FlatList
                  key={0}
                  refreshing={isRefreshing}
                  onRefresh={_handleRefresh}
                  data={data}
                  renderItem={_renderItem}
                  keyExtractor={(item) => item._id}
                />
              ) : (
                _listEmptyComponent()
              )}
              <ActionSheetCustom
                ref={ActionSheet}
                title="Choose action"
                tintColor="#00bfff"
                options={actionOptions}
                cancelButtonIndex={cancelIndex}
                onPress={(index) => _handleOptionsClick(index)}
              />
            </ScrollView>
          </Tab>
        ))}
      </Tabs>
      <Footer
        onOpen={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
      />
    </MenuProvider>
  );
}

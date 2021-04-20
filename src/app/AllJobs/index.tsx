import React, { useState, useRef, useEffect } from 'react';

import {
  View,
  Text,
  Alert,
  FlatList,
  Keyboard,
  Platform,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import moment from 'moment';
import { Icon } from 'native-base';
import { useDispatch } from 'react-redux';
import { Checkbox } from 'react-native-paper';
import { Service } from '../../config/services';
import { Calendar } from 'react-native-calendars';
import { MenuProvider } from 'react-native-popup-menu';
import AwesomeAlert from 'react-native-awesome-alerts';
import { DrawerActions } from '@react-navigation/compat';
import ActionSheetCustom from 'react-native-actionsheet';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import { StackNavigationOptions } from '@react-navigation/stack';
import Dialog, { DialogContent, SlideAnimation, DialogFooter, DialogButton } from 'react-native-popup-dialog';

import Job from '../../common/job';
import { logEvent } from '../../helpers';
import colors from '../../styles/colors';
import Loading from '../../common/loading';
import { setJobs } from '../../redux/job-redux';
import EmptyView from '../../common/empty-view';
import DateTimeSelect from '../../common/date-time-select';
import { Header } from '../../common/common-header';

import styles from './styles';
import { PropTypes } from 'mobx-react';

const START_JOB = 'Start Job';
const DELEGATE_JOB = 'Transfer Job';
const FINISH_JOB = 'Finish Job';
const PAUSE_JOB = 'Pause/Stop Job';
const SEE_DETAILS = 'See Details';
const SCAN_EQUIPMENT = 'Scan Equipment';
const VIEW_HISTORY = 'View Job History';
const COMMENT = 'Add Comment';
const CANCEL = 'Cancel';
let selectedJob2 = {};
const { getJobs, startJob, updateJob } = Service;

export default function AllJobs({ navigation }: any) {
  const options: StackNavigationOptions = {
    headerRight: ({ tintColor }: any) => (
      <Icon name="copy" style={{ fontSize: 24, color: tintColor }} />
    ),
  };

  const ActionSheet = useRef();
  const [actionOptions, setActionOptions] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStatus, setShowStatus] = useState(0);
  const [cancelIndex, setCancelIndex] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const { jobs, allJobs, openJobs, closedJobs } = useSelector((state) => state.jobsReducer);
  const dispatch = useDispatch();
  const [listHeader, setListHeader] = useState('Upcoming Jobs');
  const [showFilterDlg, setShowFliterDlg] = useState(false);
  const [isSelectedCheckbox, setIsSelectedCheckbox] = useState(0);
  const [scheduleDate, setScheduleDate] = useState(
    moment(new Date()).format('MM/DD/YYYY')
  );
  const [selectedDates, setSelectedDates] = useState([]);
  const [marks, setMarks] = useState({})
  const [marksForDate, setMarksForDate] = useState({})
  const [segmentTitle, setSegmentTitle] = useState('All')

  let mark = {};
  let markForDate = {}

  useEffect(() => {
    logEvent('jobs_screen');
    getAllJobs();
    return setShowWarning(false);
  }, []);

  useEffect(() => {
    selectedDates.forEach(day => {
      mark[day] = { selected: true, marked: true };
    });
    setMarks(mark)
  }, [selectedDates])

  useEffect(() => {
    markForDate[scheduleDate] = { selected: true };
    setMarksForDate(markForDate)
  }, [scheduleDate])

  const getAllJobs = async () => {
    await _getJobs();
  }

  const presentActionSheet = (selectedJob: any) => {
    const jobActionOptions = getActions(selectedJob);
    setActionOptions(jobActionOptions);
    selectedJob2 = selectedJob;
    setTimeout(
      () => {
        ActionSheet.current.show();
      },
      Platform.OS === 'ios' ? 0 : 100,
    );
  };

  const getActions = (job: any) => {
    const jobActions: any[] = [];
    if (job.status == 0) {
      jobActions.push(SEE_DETAILS);
      jobActions.push(COMMENT);
      jobActions.push(DELEGATE_JOB);
    } else if (job.status == 1) {
      jobActions.push(PAUSE_JOB);
      jobActions.push(COMMENT);
      jobActions.push(SEE_DETAILS);
      jobActions.push(FINISH_JOB);
    } else if (job.status == 2) {
      jobActions.push(SEE_DETAILS);
      jobActions.push(COMMENT);
    } else if (job.status == 3) {
      jobActions.push(SEE_DETAILS);
      jobActions.push(COMMENT);
    }
    jobActions.push(CANCEL);
    return jobActions;
  };

  const finishJob = () => {
    Alert.alert('', 'Are you sure you want to finish this job?', [
      {
        text: 'Yes',
        onPress: () => finishJob2(),
      },
      {
        text: 'No',
      },
    ]);
  };

  const _openMenu = () => {
    Keyboard.dismiss();
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const finishJob2 = () => {
    if (selectedJob2.equipment_scanned) {
      _updateJob(2);
      return;
    }
    Alert.alert(
      '',
      'No scans have been added to this job.  Click yes to confirm you would like to finish this job without scanning/adding equipment.',
      [
        {
          text: 'Yes',
          onPress: () => _updateJob(2),
        },
        {
          text: 'No',
        },
      ],
    );
  };

  const _startJob = async () => {
    if (selectedJob2 && selectedJob2._id) {
      const param = {
        jobId: selectedJob2._id,
      };

      try {
        const response = await startJob(param);
        const { status, message } = response.data;
        if (status == '1') {
          Alert.alert('Success', message);
          getAllJobs();
        } else {
          Alert.alert('Error', message);
        }
      } catch (err) {
        Alert.alert('Error', 'Something has gone wrong');
      }
    } else {
      Alert.alert('Error', 'Job Id not found');
    }
  };

  const _updateJob = async (para) => {
    try {
      const response = await updateJob({
        jobId: selectedJob2._id,
        status: para,
        comment: selectedJob2.comment,
      });

      const { status, message } = response.data;
      if (status == 1) {
        Alert.alert('Success', message);
        getAllJobs();
      } else {
        Alert.alert('Error', message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something has gone wrong');
    }
  };

  const _getJobs = async () => {
    try {
      if (!isRefreshing) {
        setisLoading(true);
      }
      const response = await getJobs('alljobs');
      const { status, jobs } = response.data;

      if (status == 1) {
        dispatch(setJobs(jobs));
        setisLoading(false);
        setIsRefreshing(false);
      } else {
        setisLoading(false);
        setIsRefreshing(false);
        Alert.alert('Error', 'Something has gone wrong');
      }
    } catch (err) {
      setisLoading(false);
      setIsRefreshing(false);
      Alert.alert('Error', err.message);
    }
  };

  const _handleOptionsClick = (index: any) => {
    if (actionOptions[index] === START_JOB) {
      if (jobs.some((item: any) => item.status == '1')) {
        setShowWarning(true);
      } else {
        _startJob();
      }
    } else if (actionOptions[index] == VIEW_HISTORY) {
      navigation.navigate('ViewHistory');
    } else if (actionOptions[index] == PAUSE_JOB) {
      _updateJob(0);
    } else if (actionOptions[index] == FINISH_JOB) {
      finishJob();
    } else if (actionOptions[index] == COMMENT) {
      navigation.navigate('Comment', { job: selectedJob2 });
    } else if (actionOptions[index] == SEE_DETAILS) {
      navigation.navigate('Report', { job: selectedJob2 });
    } else if (actionOptions[index] == SCAN_EQUIPMENT) {
      _handleJob(selectedJob2, 'AssignEquipments');
    } else if (actionOptions[index] == DELEGATE_JOB) {
      _handleJob(selectedJob2, 'DelegateJob');
    }
  };

  const _handleJob = (item: any, route: any) => {
    navigation.push(route, { item });
  };

  const _getTypeIcon = (title: string) => {
    if (title.trim() == 'Repair') return 'ios-hammer';
    if (title.trim() == 'Diagnosis') return 'md-bug';
    if (title.trim() == 'Maintenance') return 'ios-build';
    if (title.trim() == 'Installation') return 'ios-download';
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

  const _renderItem = ({ item }: any) => {
    const status = getJobStatus(item);
    const type = _getTypeIcon(item.type?.title ?? '');
    return (
      <Job
        item={item}
        type={type}
        status={status}
        onClick={() => presentActionSheet(item)}
      />
    );
  };

  const _listEmptyComponent = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <EmptyView title="No jobs scheduled today" icon="ios-hammer" />
    </View>
  );

  const _handleRefresh = async () => {
    setIsRefreshing(true);
    await getAllJobs();
  };

  const onSelectSeg = (type: any) => {
    setShowStatus(type);
  };

  const renderSegment = () => {
    const segments = ['open', 'closed', segmentTitle];
    return (
      <View style={styles.segment}>
        {segments.map((txt, index) => (
          <TouchableOpacity
            style={[
              styles.segmentsButton,
              showStatus == index ? styles.segmentsButtonActive : {},
            ]}
            onPress={onSelectSeg.bind(this, index)}
          >
            <Text
              style={[
                styles.segmentsText,
                showStatus == index ? styles.segmentsTextActive : {},
              ]}
            >
              {txt.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderHeader = () => jobs.length > 0 && <View style={styles.listHeader} />;

  const isEmpty = isLoading ? false : jobs.length == 0;

  const filteredJobs: any[] = [];
  jobs.map((item: any) => {
    if (showStatus == 2) {
      if (isSelectedCheckbox == 0 && item.status <= 2) filteredJobs.push(item);
      if (isSelectedCheckbox == 1 && item.status == 0) filteredJobs.push(item);
      if (isSelectedCheckbox == 2 && item.status == 2) filteredJobs.push(item);
      if (isSelectedCheckbox == 3 && item.status == 1) filteredJobs.push(item);
      if (isSelectedCheckbox == 4 && item.scheduleDate && moment(item.scheduleDate).isSame(scheduleDate, 'day')) filteredJobs.push(item);
      if (isSelectedCheckbox == 5 && item.scheduleDate) {
        if (Object.keys(marks).length == 7) {
          if (marks[moment(item.scheduleDate).format('YYYY-MM-DD')])
            filteredJobs.push(item)
        }
      }
    }
    else if (showStatus == 0 && item.status <= 1) filteredJobs.push(item);
    else if (showStatus == 1 && item.status == 3) filteredJobs.push(item);
  });

  const handleConfirm = (day: any) => {
    const { dateString } = day;
    setScheduleDate(dateString);
  };

  const addSelectedDate = (day: Object) => {
    const { dateString } = day;
    setSelectedDates([])
    for (let i = 0; i < 7; i++) {
      const featureDate = moment(dateString, 'YYYY-MM-DD').add(i, 'days').format('YYYY-MM-DD')
      setSelectedDates((prevDates) => [...prevDates, featureDate])
    }
  }

  const _onCancelShowDlg = () => {
    setShowFliterDlg(false)
  }

  const _filter = () => {
    setShowFliterDlg(false)
    switch (isSelectedCheckbox) {
      case 1:
        setSegmentTitle('Not Started')
        setShowStatus(0)
        break;
      case 2:
        setSegmentTitle('Completed')
        setShowStatus(0)
        break;
      case 3:
        setSegmentTitle('Started')
        setShowStatus(0)
        break;
      case 4:
        setSegmentTitle('Date')
        setShowStatus(0)
        break;
      case 5:
        setSegmentTitle('Range')
        setShowStatus(0)
        break;
      default:
        setShowFliterDlg(false)
    }
  }

  const _onReset = () => {
    setSegmentTitle('All')
    setSelectedDates([]);
    setIsSelectedCheckbox(0)
    setScheduleDate('')
    setShowFliterDlg(false)
  }

  return (
    <MenuProvider style={styles.container}>
      <Header
        title="All Jobs"
        leftIcon="goback"
        rightIcon="filter"
        showFilterDlg={() => {
          setShowFliterDlg(true)
        }}
        _goBack={() => {
          navigation.goBack();
        }}
      />
      {renderSegment()}
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView
          style={{ flex: 1, paddingVertical: 15 }}
          refreshControl={(
            <RefreshControl
              onRefresh={_handleRefresh}
              refreshing={isRefreshing}
            />
          )}
        >
          {!isEmpty ? (
            <FlatList
              key={0}
              data={filteredJobs}
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
            cancelButtonIndex={actionOptions.length - 1}
            onPress={(index) => _handleOptionsClick(index)}
          />
        </ScrollView>
      )}
      <AwesomeAlert
        show={showWarning}
        title="warning"
        message="Job already in progress. To start this job, you must pause the current job. Would you go check all jobs?"
        showConfirmButton
        showCancelButton
        confirmText="Yes, Go All jobs"
        cancelText="Close"
        confirmButtonColor={colors.assertColor}
        onCancelPressed={() => setShowWarning(false)}
        onConfirmPressed={() => {
          setShowWarning(false);
          navigation.navigate('AllJobs');
        }}
      />
      <Dialog
        visible={showFilterDlg}
        dialogAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
        footer={
          <DialogFooter style={styles.dialogFooter}>
            <DialogButton
              text="Reset"
              onPress={() => _onReset()}
            />
            <DialogButton
              text="Filter"
              onPress={() => {
                _filter()
              }}
            />
          </DialogFooter>
        }
        width='80%'
        height='70%'
      >
        <DialogContent style={styles.dialogContent}>
          <ScrollView>
            <Text style={styles.filterBy}>Filter By:</Text>
            <View style={styles.filterItem}>
              <Checkbox.Android
                uncheckedColor='black'
                color="#1fb2e2"
                status={isSelectedCheckbox == 1 ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSelectedCheckbox(1)
                }}
              />
              <Text style={styles.checkboxLabel}>Not Started</Text>
            </View>
            <View style={styles.filterItem}>
              <Checkbox.Android
                uncheckedColor='black'
                color="#1fb2e2"
                status={isSelectedCheckbox == 2 ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSelectedCheckbox(2)
                }}
              />
              <Text style={styles.checkboxLabel}>Completed</Text>
            </View>
            <View style={styles.filterItem}>
              <Checkbox.Android
                uncheckedColor='black'
                color="#1fb2e2"
                status={isSelectedCheckbox == 3 ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSelectedCheckbox(3)
                }}
              />
              <Text style={styles.checkboxLabel}>Started</Text>
            </View>
            <View style={styles.filterItem}>
              <Checkbox.Android
                uncheckedColor='black'
                color="#1fb2e2"
                status={isSelectedCheckbox == 4 ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSelectedCheckbox(4)
                }}
              />
              <Text style={styles.checkboxLabel}>Date</Text>
            </View>
            {isSelectedCheckbox == 4 &&
              <Calendar
                current={moment(new Date()).format('YYYY-MM-DD')}
                firstDay={1}
                markedDates={Object.keys(markForDate).length === 0 ? marksForDate : markForDate}
                onDayPress={(day) => handleConfirm(day)}
                horizontal
                pagingEnabled
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#b6c1cd',
                  selectedDayBackgroundColor: '#00adf5',
                  selectedDayTextColor: '#ffffff',
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
            }
            <View style={styles.filterItem}>
              <Checkbox.Android
                uncheckedColor='black'
                color="#1fb2e2"
                status={isSelectedCheckbox == 5 ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSelectedCheckbox(5)
                }}
              />
              <Text style={styles.checkboxLabel}>Weekly Range</Text>
            </View>
            {isSelectedCheckbox == 5 &&
              <Calendar
                current={moment(new Date()).format('YYYY-MM-DD')}
                markedDates={Object.keys(mark).length === 0 ? marks : mark}
                firstDay={1}
                onDayPress={(day) => addSelectedDate(day)}
                horizontal
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
            }
          </ScrollView>
        </DialogContent>
      </Dialog>
    </MenuProvider>
  );
}

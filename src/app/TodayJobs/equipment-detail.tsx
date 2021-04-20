import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Image,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import AwesomeAlert from 'react-native-awesome-alerts';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Tab, Tabs, Icon } from 'native-base';
import { Button, Divider } from 'react-native-paper';
import Carousel from 'react-native-looped-carousel';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerActions, NavigationEvents } from '@react-navigation/compat';
import { logEvent } from '../../helpers';
import { Header } from '../../common/common-header';
import Footer from '../../common/footer';
import colors, { destructiveRed } from '../../styles/colors';
import { Service } from '../../config/services';
import { retrieveData } from '../../common/token';
import Job from '../../common/job';
import PurchaseOrder from '../../common/purchase-order';
import { formatAddress } from '../../utils/util-methods';

const { width, height } = Dimensions.get('window');
const deviceHeight = height;

type JobType = {
  _id?: string,
  comment?: string,
  equipment: {
    _id: string,
    brand: any,
    customer: any
    images: Array<any>,
    nfcTag: string,
    serialNumber: string,
  },
  job: any,
  timeOfScan: string,
  user: any,
  type?: string
}

// Leon added
class DetailsTab extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      size: { width, height: 200 },
      isCollapsedArr: [],
    };
  }

  _renderCarouselView = () => {
    const { size } = this.state;
    const { equipmentDetails } = this.props;
    if (
      equipmentDetails
      && equipmentDetails.equipment
      && equipmentDetails.equipment.images
      && equipmentDetails.equipment.images.length > 0
    ) {
      return (
        <Carousel style={size} autoplay={false} bullets onAnimateNextPage={() => {}}>
          {equipmentDetails.equipment.images.map((item) => (
            <View style={{ width: width * 1 }}>
              <View style={{ margin: 8 }}>
                <Image
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="stretch"
                  source={{ uri: item }}
                />
              </View>
            </View>
          ))}
        </Carousel>
      );
    }
  };

  render() {
    const { isCollapsedArr } = this.state;
    const { equipmentDetails } = this.props;
    let type;
    let brand;
    let info;
    let customer;
    let jobLocation;
    let jobSite;

    if (equipmentDetails) {
      type = equipmentDetails && equipmentDetails.equipment && equipmentDetails.equipment.type
        ? equipmentDetails.equipment.type
        : '';
      brand = equipmentDetails && equipmentDetails.equipment && equipmentDetails.equipment.brand
        ? equipmentDetails.equipment.brand
        : '';
      info = equipmentDetails && equipmentDetails.equipment && equipmentDetails.equipment.info
        ? equipmentDetails.equipment.info
        : '';
      customer = equipmentDetails
        && equipmentDetails.equipment
        && equipmentDetails.equipment.customer
        ? equipmentDetails.equipment.customer
        : '';
      jobLocation = equipmentDetails
      && equipmentDetails?.equipment
      && equipmentDetails?.equipment?.jobLocation;
      jobSite = equipmentDetails
      && equipmentDetails?.equipment
      && equipmentDetails?.equipment?.jobSite;
    }

    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ height: 5 }} />
        <View>
          {/* equipment info */}
          <Collapse
            style={styles.collapse}
            isCollapsed={isCollapsedArr[0]}
            onToggle={(isCollapsed) => {
              const isCollapsedArrCopy = isCollapsedArr.slice(0);
              isCollapsedArrCopy[0] = isCollapsed;
              this.setState({
                isCollapsedArr: isCollapsedArrCopy,
              });
            }}
          >
            <CollapseHeader style={styles.collapseHeader}>
              <View style={{ width: '95%' }}>
                <Text style={styles.collapseHeaderTitle}>Equipment Information</Text>
              </View>
              <Icon
                name={!isCollapsedArr[0] ? 'ios-arrow-down' : 'ios-arrow-up'}
                style={{ fontSize: 14, color: 'black' }}
              />
            </CollapseHeader>
            <CollapseBody
              style={{
                padding: 10,
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.collapseItemTitle}>TYPE</Text>
                  <Text style={styles.collapseItemContent}>{type && type.title}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.collapseItemTitle}>MODEL</Text>
                  <Text style={styles.collapseItemContent}>{info && info.model}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                <View style={{ flex: 1, marginTop: 10 }}>
                  <Text style={styles.collapseItemTitle}>BRAND</Text>
                  <Text style={styles.collapseItemContent}>{brand && brand.title}</Text>
                </View>

                <View style={{ flex: 1, marginTop: 10 }}>
                  <Text style={styles.collapseItemTitle}>SERIAL</Text>
                  <Text style={styles.collapseItemContent}>{info && info.serialNumber}</Text>
                </View>
              </View>
            </CollapseBody>
          </Collapse>
        </View>
        {/* Customer */}
        <Collapse
          style={styles.collapse}
          isCollapsed={isCollapsedArr[1]}
          onToggle={(isCollapsed) => {
            const isCollapsedArrCopy = isCollapsedArr.slice(0);
            isCollapsedArrCopy[1] = isCollapsed;
            this.setState({
              isCollapsedArr: isCollapsedArrCopy,
            });
          }}
        >
          <CollapseHeader style={styles.collapseHeader}>
            <View style={{ width: '95%' }}>
              <Text style={styles.collapseHeaderTitle}>Customer</Text>
            </View>
            <Icon
              name={!isCollapsedArr[1] ? 'ios-arrow-down' : 'ios-arrow-up'}
              style={{ fontSize: 14, color: 'black' }}
            />
          </CollapseHeader>
          <CollapseBody
            style={{
              padding: 10,
              justifyContent: 'center',
              backgroundColor: 'white',
              marginHorizontal: 10,
            }}
          >
            <View style={styles.collapseItemContainer}>
              <Text style={styles.collapseItemTitle}>NAME</Text>
              <Text style={styles.collapseItemContent}>
                {customer && customer.profile.displayName}
              </Text>
            </View>
            <View style={styles.collapseItemContainer}>
              <Text style={styles.collapseItemTitle}>ADDRESS</Text>
              <Text style={styles.collapseItemContent}>
                {customer && formatAddress(customer.address)}
              </Text>
            </View>
          </CollapseBody>
        </Collapse>
        {/* job location */}
        {
          jobLocation && (
            <Collapse
              style={styles.collapse}
              isCollapsed={isCollapsedArr[2]}
              onToggle={(isCollapsed) => {
                const isCollapsedArrCopy = isCollapsedArr.slice(0);
                isCollapsedArrCopy[2] = isCollapsed;
                this.setState({
                  isCollapsedArr: isCollapsedArrCopy,
                });
              }}
            >
              <CollapseHeader style={styles.collapseHeader}>
                <View style={{ width: '95%' }}>
                  <Text style={styles.collapseHeaderTitle}>Job Location</Text>
                </View>
                <Icon
                  name={!isCollapsedArr[2] ? 'ios-arrow-down' : 'ios-arrow-up'}
                  style={{ fontSize: 14, color: 'black' }}
                />
              </CollapseHeader>
              <CollapseBody
                style={{
                  padding: 10,
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}
              >
                <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.collapseItemTitle}>LATITUDE</Text>
                    <Text style={styles.collapseItemContent}>
                      {jobLocation?.location?.coordinates[1]}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.collapseItemTitle}>LONGITUDE</Text>
                    <Text style={styles.collapseItemContent}>
                      {jobLocation?.location?.coordinates[0]}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1, marginTop: 10, marginHorizontal: 10 }}>
                  <Text style={styles.collapseItemTitle}>LOCATION NAME</Text>
                  <Text style={styles.collapseItemContent}>{jobLocation?.name}</Text>
                </View>
              </CollapseBody>
            </Collapse>
          )
        }

        {/* job site */}
        {
          jobSite && (
            <Collapse
              style={styles.collapse}
              isCollapsed={isCollapsedArr[3]}
              onToggle={(isCollapsed) => {
                const isCollapsedArrCopy = isCollapsedArr.slice(0);
                isCollapsedArrCopy[3] = isCollapsed;
                this.setState({
                  isCollapsedArr: isCollapsedArrCopy,
                });
              }}
            >
              <CollapseHeader style={styles.collapseHeader}>
                <View style={{ width: '95%' }}>
                  <Text style={styles.collapseHeaderTitle}>Job Site</Text>
                </View>
                <Icon
                  name={!isCollapsedArr[3] ? 'ios-arrow-down' : 'ios-arrow-up'}
                  style={{ fontSize: 14, color: 'black' }}
                />
              </CollapseHeader>
              <CollapseBody
                style={{
                  padding: 10,
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}
              >
                <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.collapseItemTitle}>LATITUDE</Text>
                    <Text style={styles.collapseItemContent}>
                      {jobSite?.location?.coordinates[1]}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.collapseItemTitle}>LONGITUDE</Text>
                    <Text style={styles.collapseItemContent}>
                      {jobSite?.location?.coordinates[0]}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1, marginTop: 10, marginHorizontal: 10 }}>
                  <Text style={styles.collapseItemTitle}>SITE NAME</Text>
                  <Text style={styles.collapseItemContent}>{jobSite?.name}</Text>
                </View>
              </CollapseBody>
            </Collapse>
          )
        }
        <View style={{ marginVertical: 20 }}>{this._renderCarouselView()}</View>
      </ScrollView>
    );
  }
}

const {
  getEquipmentDetails,
  scanJobEquipment,
  getCustomerEquipmentJobs,
  getJobs,
  getEquipmentPurchaseOrder,
} = Service;

type JobStackParamList = {
  jobs: undefined;
  ScanTagScreen: undefined;
  EquipmentDetail:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
  GuideScreen: undefined;
  AllJobs: undefined;
  Report:
    | {
        job: object | string | undefined;
        from: boolean | undefined;
      }
    | undefined;
};

type NavigationProps = StackScreenProps<JobStackParamList, 'EquipmentDetail'>;
type EquipmentDetailProps = {
  jobs: any[]
} & NavigationProps

class EquipmentDetail extends Component<EquipmentDetailProps, any> {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="ios-construct" style={{ fontSize: 24, color: tintColor }} />
    ),
  };

  nfcTag: string | null = null;

  actionSheetRef: any = null;

  startedJob: any = null;

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      equipment: '',
      selectJob: '',
      equipmentJobs: [],
      equipmentPurchaseOrders: [],
      isCollapsedArr: [false, false, false, false],
      showWarning: false,
      successComment: false,
      warningComment: false,
      remarks: '',
      comment: '',
      job_drop_down: [],
      job_number: '',
      all_job: [],
      upload: false,
      equipmentDetails: null,
    };
  }

  async componentDidMount() {
    this.nfcTag = this.props?.route?.params?.nfcTag ? this.props.route.params.nfcTag : null;

    await Promise.all([
      this._getEquipmentDetailsApi(),
      this._getEquipmentJobs(),
      this._getJobs(),
    ]);
  }

  componentWillUnmount = () => {
    this.setState({ showWarning: false });
    this.setState({ successComment: false });
    this.setState({ warningComment: false });
  };

  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  chooseOption = (index: number) => {
    if (index == 0) {
      this.props.navigation.navigate('CodeCompanyTag');
    } else if (index == 1) {
      this.props.navigation.navigate('QRCodeScannerScreen');
    }
  };

  retrieveData = async (name: string) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (error) {
      console.log('retrieve-data-error', error);
    }
  };

  _getTechnicianJobsToday = async () => {
    for (const job of this.props.jobs) {
      if (moment(job.dateTime).isSame(Date(), 'day') && job.status == 1) {
        this.startedJob = job;
        break;
      }
    }

    if (this.startedJob === null) {
      this.setState({ showWarning: true });
    } else {
      this.actionSheetRef?.open();
    }
  };

  _getJobs = async () => {
    try {
      const response = await getJobs('alljobs');
      const { jobs } = response.data;
      const current_job = [];

      this.setState({ all_job: jobs.reverse() });
      jobs.map((item: any) => {
        if (item.status == 1) {
          current_job.push({ value: item.jobId });
          this.setState({ selectJob: item._id, job_number: item.jobId });
        }
      });
      this.setState({ job_drop_down: current_job });
    } catch (error) {
      console.log('get-jobs-error', error);
    }
  };

  _getEquipmentJobs = async () => {
    const response = await getCustomerEquipmentJobs({ nfcTag: this.nfcTag });

    const { jobs } = response.data;
    if (jobs.length > 0) {
      this.setState({
        equipmentJobs: jobs.reverse(),
      });
    }
  };

  _getEquipmentPurchaseOrder = async (_id: string) => {
    const response = await getEquipmentPurchaseOrder({ equipmentId: _id });

    const { purchaseOrders } = response.data;
    if (purchaseOrders.length > 0) {
      this.setState({
        equipmentPurchaseOrders: purchaseOrders.reverse(),
      });
    }
  };

  _getTypeIcon = (title: string) => {
    if (title.trim() == 'Repair') return 'ios-hammer';
    if (title.trim() == 'Diagnosis') return 'md-bug';
    if (title.trim() == 'Maintenance') return 'ios-build';
    if (title.trim() == 'Installation') return 'ios-download';
    return 'ios-hammer';
  };

  getJobStatus = (item: any) => {
    let status = 'Not Started';
    if (item.status == '0') status = 'Not Started';
    else if (item.status == '1') status = 'Started';
    else if (item.status == '2') status = 'Completed';
    else if (item.status == '3') status = 'Cancelled';

    return status;
  };

  _getEquipmentDetailsApi = async () => {
    try {
      const response = await getEquipmentDetails({ nfcTag: this.nfcTag });

      this.setState({
        equipmentDetails: response.data,
      });
      // gets the equipment purchase current orders and order history
      await this._getEquipmentPurchaseOrder(response.data.equipment._id);
    } catch (err) {
      this.setState(
        {
          isLoading: false,
          isRefreshing: false,
          isEmpty: true,
        },
        () => {
          Alert.alert('Error', 'Something has gone wrong');
        },
      );
    }
  };

  handleAddJob = async () => {
    this.setState({ upload: true });

    const res = await scanJobEquipment({
      nfcTag: this.nfcTag,
      jobId: this.state.selectJob,
      comment: this.state.comment,
    });

    console.warn('new ->', res.data);

    if (res.data.status == 1) {
      this.setState({ successComment: true });
      await this._getEquipmentJobs();
    } else {
      this.setState({
        remarks: res.data.message,
        warningComment: true,
        upload: false,
      });
    }
  }

  updateSearch(event = '') {
    const value = event;
    this.setState({
      search: value.substr(0, 20),
      equipment: value.substr(0, 20),
    });
  }

  render() {
    const {
      equipmentDetails,
      equipmentJobs,
      equipmentPurchaseOrders,
    } = this.state;

    const jobOrders = [...equipmentJobs]
      .map((job: JobType) => {
        const modifiedJob: JobType = { ...job };
        if (modifiedJob?.type) {
          modifiedJob.type = 'job';
        }
        if (modifiedJob?.job?.customer) {
          modifiedJob.job.customer = equipmentDetails?.equipment?.customer;
        }
        return modifiedJob;
      });
      // .concat(
      //   equipmentPurchaseOrders.map((order: any) => {
      //     order.type = 'order';
      //     return order;
      //   }),
      // );

    jobOrders.sort((a: any, b: any) => {
      const aMoment = moment(a.createAt);
      const bMoment = moment(b.createAt);
      return aMoment > bMoment ? -1 : 1;
    });

    return (
      <View style={{ flex: 1 }}>
        <Header
          title="Equipment Details"
          leftIcon="back"
          _openMenu={() => this._openMenu()}
          elevation="0"
          _goBack={() => this.props.navigation.goBack()}
        />
        <NavigationEvents
          onWillFocus={() => {
            if (this.state.equipmentDetails) {
              this._getEquipmentPurchaseOrder(this.state.equipmentDetails.equipment._id);
            }
          }}
        />
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Tabs
            tabBarUnderlineStyle={{ width: 0 }}
            tabContainerStyle={styles.tabContainerStyle}
            locked={Platform.OS === 'android'}
          >
            <Tab
              heading="Details"
              tabStyle={styles.tabStyle}
              activeTabStyle={styles.activeTabStyle}
              textStyle={styles.textStyle}
              activeTextStyle={styles.activeTextStyle}
            >
              <DetailsTab equipmentDetails={equipmentDetails} />
            </Tab>

            <Tab
              active
              heading="Work Orders"
              tabStyle={styles.tabStyle}
              activeTabStyle={styles.activeTabStyle}
              textStyle={styles.textStyle}
              activeTextStyle={styles.activeTextStyle}
            >
              <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.ItemContainer1}>
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        backgroundColor: '#EAF7FF',
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                        borderColor: '#149CE6',
                      }}
                      onPress={() => {
                        this._getTechnicianJobsToday();
                      }}
                    >
                      <Text style={styles.addNewBtnText}>ADD NEW</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Divider style={{ marginVertical: 10 }} />
                <ScrollView>
                  {jobOrders
                    && jobOrders.map((item: any) => {
                      const status = item?.job && item?.job?.status
                      && this.getJobStatus(item.job.status || '');
                      const type = item.type && item.type.title
                       && this._getTypeIcon(item.type.title || '');
                      return (
                        <Job
                          item={item?.job || item}
                          type={type}
                          status={status}
                          onClick={() => {
                            this.props.navigation.navigate('WorkOrderPage', {
                              job: item,
                            });
                          }}
                        />
                      );
                      // return (
                      //   <PurchaseOrder order={item} navigation={this.props.navigation} />
                      // );
                    })}
                </ScrollView>
              </View>
            </Tab>
            <Tab
              heading="Parts"
              tabStyle={styles.tabStyle}
              activeTabStyle={styles.activeTabStyle}
              textStyle={styles.textStyle}
              activeTextStyle={styles.activeTextStyle}
            >
              <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View
                  style={{
                    height: '30%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.noItemText}>No parts have been added.</Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.push('CreatePurchaseOrder', {
                      equipmentDetails,
                    });
                  }}
                  style={styles.partsBtn}
                >
                  <Text style={styles.partsBtnText}>CREATE PURCHASE ORDER</Text>
                </TouchableOpacity>
              </View>
            </Tab>
          </Tabs>
        </View>

        <Footer
          onScan={() => {
            this.props.navigation.navigate('ScanBlueTag');
          }}
          onOpen={() => {
            this.props.navigation.dispatch(DrawerActions.toggleDrawer());
          }}
        />
        <AwesomeAlert
          show={this.state.showWarning}
          title="Warning"
          message="No jobs currently started. Please go to jobs screen and start a job."
          showConfirmButton
          showCancelButton
          onCancelPressed={() => this.setState({ showWarning: false })}
          onConfirmPressed={() => {
            this.setState({ showWarning: false });
            this.props.navigation.navigate('jobs');
          }}
          confirmText="Go To Jobs"
          cancelText="Close"
          confirmButtonColor={colors.assertColor}
        />

        <RBSheet
          ref={(ref) => (this.actionSheetRef = ref)}
          height={Dimensions.get('screen').height * 0.5}
        >
          <ScrollView contentContainerStyle={{ margin: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                  }}
                >
                  {`Job Id: ${this.state.job_number}`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.actionSheetRef.close();
                    this.setState({ comment: '' });
                  }}
                >
                  <Text style={{ fontSize: 15, color: destructiveRed }}>Cancel</Text>
                </TouchableOpacity>
              </>
            </View>

            <View style={{ flexDirection: 'column' }}>
              <TextInput
                style={{
                  width: '100%',
                  borderRadius: 5,
                  borderWidth: 1,
                  height: Dimensions.get('window').height * 0.2,
                  borderColor: '#f0f0f0',
                  marginBottom: 15,
                  paddingHorizontal: 10,
                  marginRight: 10,
                  padding: 10,
                  fontSize: 18,
                }}
                multiline
                value={this.state.comment}
                onChangeText={(comment) => this.setState({ comment })}
                placeholder="Write comment!"
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Button
                mode="outlined"
                color={colors.assertColor}
                onPress={() => {
                  this.setState({ comment: '' });
                  this.actionSheetRef.close();
                }}
              >
                Comment later
              </Button>
              <Button
                mode="contained"
                style={{ backgroundColor: colors.assertColor }}
                disabled={!this.state.comment}
                loading={this.state.upload}
                onPress={this.handleAddJob}
              >
                Comment now
              </Button>
            </View>
          </ScrollView>
          <AwesomeAlert
            show={this.state.successComment}
            title="Success"
            message="Comment Successfully added"
            showConfirmButton
            showCancelButton
            onCancelPressed={() => this.setState({ successComment: false })}
            onConfirmPressed={() => {
              this.setState({ upload: false, comment: '', successComment: false });
              this.actionSheetRef.close();
            }}
            confirmText="Ok"
            cancelText="Close"
            confirmButtonColor={colors.assertColor}
          />
          <AwesomeAlert
            show={this.state.warningComment}
            title="Warning"
            message={this.state.remarks}
            showConfirmButton
            showCancelButton
            onCancelPressed={() => this.setState({ warningComment: false })}
            onConfirmPressed={() => {
              this.setState({ upload: false, comment: '', warningComment: false });
              this.actionSheetRef.close();
            }}
            confirmText="Ok"
            cancelText="Close"
            confirmButtonColor={colors.assertColor}
          />
        </RBSheet>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alignLabel: {
    alignSelf: 'auto',
  },
  input: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginHorizontal: 8,
  },
  inputBrand: {
    fontSize: 16,
    height: 50,
    paddingLeft: 6,
    backgroundColor: 'white',
    minHeight: 0,
    paddingVertical: 0,
  },
  inputMachine: {
    fontSize: 16,
    height: 50,
    paddingLeft: 6,
    backgroundColor: 'white',
    minHeight: 0,
    paddingVertical: 0,
  },
  textcontainer: {
    textAlign: 'center',
    marginTop: 20,
    marginLeft: 20,
  },
  txtSize: {
    padding: 5,
  },
  actbtn: {
    textAlign: 'center',
    margin: 15,
    backgroundColor: '#1fb2e2',
  },
  search: {
    marginLeft: 10,
    marginRight: 10,
    height: 60,
    paddingLeft: 6,
    backgroundColor: 'white',
    minHeight: 0,
    paddingVertical: 0,
    borderColor: '#9E9E9E',
  },
  listView: {
    width: 400,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: 'white',
    minHeight: 0,
    paddingVertical: 0,
    textAlign: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  eqName: {
    marginLeft: 15,
    marginRight: 15,
    fontSize: 16,
    paddingVertical: 10,
    textAlign: 'center',
    alignSelf: 'center',
    borderBottomColor: '#eee',
    width: 400,
    borderBottomWidth: 1,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  card: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginHorizontal: 30,
    marginTop: 20,
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
  headerContainer: {
    borderBottomWidth: 0,
    width: '100%',
    backgroundColor: 'white',
  },
  headerTitle: {
    color: '#747D8C',
  },
  headerIcons: {
    color: '#2F3542',
  },

  FooterContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#EEE',
  },
  tabContainerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#505560',
    elevation: 0,
  },
  tabBarUnderlineStyle: {
    backgroundColor: '#00B9AA',
    alignContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    height: 0,
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'white',
  },

  tabStyle: {
    backgroundColor: '#505560',
  },
  activeTabStyle: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  textStyle: {
    color: '#fff',
  },
  activeTextStyle: {
    color: '#505560',
    fontWeight: 'bold',
  },
  collapse: {
    backgroundColor: '#F4F4F4',
    marginBottom: 5,
  },
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F4F4F4',
  },
  collapseItemContainer: {
    marginBottom: 15,
  },
  collapseHeaderTitle: {
    fontSize: 17,
  },

  collapseItemTitle: {
    fontSize: 11,
  },
  collapseItemContent: {
    fontWeight: '700',
    fontSize: 16,
  },
  addNewBtnText: {
    color: colors.btnTextColor,
  },
  ItemContainer1: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    marginHorizontal: 10,
    borderStyle: 'dotted',
    borderColor: colors.btnTextColor,
    marginTop: 20,
    borderRadius: 5,
    height: deviceHeight * 0.1,
    ...Platform.select({
      ios: {},
      android: {
        borderStyle: 'dotted',
        borderWidth: 2,
      },
    }),
  },
  ItemContainer2: {
    justifyContent: 'center',

    marginTop: 10,
    marginBottom: 1,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 1,
      height: 2,
    },

    ...Platform.select({
      ios: {
        height: deviceHeight * 0.1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardItemTitle: {
    fontSize: 11,
  },
  cardItemContent: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },

  noItemText: {
    fontSize: 18,
    fontWeight: '500',
  },
  partsBtn: {
    backgroundColor: colors.btnPrimary,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
    height: '10%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partsBtnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  partsBtnTextBlue: {
    textAlign: 'center',
    color: colors.btnTextPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  seeOnWebBtn: {
    backgroundColor: colors.btnPrimary,
    margin: 10,
    borderRadius: 5,
    height: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => ({
  jobs: state.JobReducer,
});

export default connect(mapStateToProps, {})(EquipmentDetail);

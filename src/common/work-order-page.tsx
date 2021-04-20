import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Dimensions,
  Text,
  ScrollView,
  Keyboard,
  Image,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import Carousel from 'react-native-looped-carousel';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import moment from 'moment';
import {
  Tab, Tabs, ScrollableTab, Icon,
} from 'native-base';
import { StackNavigationOptions } from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/compat';
import { Service } from '../config/services';
import colors from '../styles/colors';
import Footer from './footer';
import { Header } from './common-header';
import PurchaseOrder from './purchase-order';

// const { getCompanyEquipment } = Service;

const { width, height } = Dimensions.get('window');
const deviceWidth = width;
const deviceHeight = height;
// Leon added
export function WorkOrderPage({ route, navigation }: any) {
  // const { _id, info } = route.params.job.equipment;

  const options: StackNavigationOptions = {
    headerLeft: ({ tintColor }: any) => (
      <Icon name="ios-construct" style={{ fontSize: 24, color: tintColor }} />
    ),
  };

  // const [search, setSearch] = useState('');
  // const [equipment, setEquipment] = useState('');
  // const [equipments, setEquipments] = useState<any>([]);
  const [customerEq, setCustomerEq] = useState<any>({});
  const [size, setSize] = useState({ width, height: 200 });
  const [purchaseorder, setpurchaseorder] = useState<any>([]);
  // const [isCollapsedArr, setisCollapsedArr] = useState([false, false, false, false]);
  const [selectedJob, setSelectedJob] = useState(route?.params?.job?.job);
  const [equipmentDetails, setEquipmentDetail] = useState<any>(null);

  // const {
  //   description,
  //   scheduledStartTime,
  //   scheduleDate,
  //   type,
  //   technician,
  //   jobId,
  //   jobLocation,
  //   jobSite,
  // } = selectedJob;

  // const {
  //   customer,
  //   info: { nfcTag },
  // } = route?.params?.job?.equipment;

  // console.log('work-order-job-detailoo', route.params.job.job);

  // const ActionSheet = useRef();

  // const updateSearch = (event: any = {}) => {
  //   const value = event;
  //   setSearch(value.substr(0, 20));
  //   setEquipment(value.substr(0, 20));
  // };

  const openMenu = () => {
    Keyboard.dismiss();
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  // const showActionSheet = () => {
  //   ActionSheet?.current?.show();
  // };

  // const chooseOption = (index) => {
  //   if (index == 0) {
  //     navigation.navigate('CodeCompanyTag');
  //   } else if (index == 1) {
  //     navigation.navigate('QRCodeScannerScreen');
  //   }
  // };

  useEffect(() => {
    Promise.all([
      getJobDetails(),
      getCustomerDetail(),
      getEquipmentDetails(),
      // getPurchseOrder(),
    ]);
  }, []);

  const getCustomerDetail = async () => {
    const customerId = route?.params?.job?.equipment?.customer
    ?? route?.params?.job?.job?.customer?._id;

    try {
      const response = await Service.getCustomerDetail({ customerId });
      setCustomerEq(response.data.customer);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const getJobDetails = async () => {
    try {
      const response = await Service.getJobDetails({
        jobId: route?.params?.job?.job?._id,
      });
      setSelectedJob(response.data.job);
      // console.log('passed-jobbbbb', response.data);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const getEquipmentDetails = async () => {
    const nfcTag = route?.params?.job?.equipment?.info?.nfcTag;

    try {
      const response = await Service.getEquipmentDetails({ nfcTag });
      setEquipmentDetail(response.data);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // const getPurchseOrder = async () => {
  //   const equipmentId = route?.params?.job?.equipment?._id;

  //   try {
  //     const response = await Service.getEquipmentPurchaseOrder({ equipmentId });
  //     const { status, purchaseOrders } = response.data;
  //     if (status == 1) {
  //       setpurchaseorder(purchaseOrders.reverse());
  //     } else {
  //       Alert.alert('Error', 'Something has gone wrong');
  //     }
  //   } catch (err) {
  //     Alert.alert('Error', err.message);
  //   }
  // };

  // const getDirections = () => {
  //   const address = customerEq && customerEq.address ? customerEq.address : null;
  //   if (address) {
  //     const { street, city, state } = address;
  //     const dest = `${street}, ${city}, ${state}`;
  //     if (Platform.OS == 'android') {
  //       Linking.openURL(`google.navigation:q=${dest}`);
  //     } else {
  //       Linking.openURL(`maps://app?daddr=${dest}`);
  //     }
  //   } else {
  //     Alert.alert('No information. Please add information or contact your admin');
  //   }
  // };

  // const handleCall = () => {
  //   const phone = customerEq && customerEq?.contact ? customerEq.contact?.phone : null;
  //   if (phone) {
  //     Linking.openURL(`tel:${phone}`);
  //   } else {
  //     Alert.alert('No information. Please add information or contact your admin');
  //   }
  // };

  const renderCarouselView = () => (
    <Carousel style={size} autoplay={false} bullets>
      <View style={size}>
        <Image
          style={{ width: '100%', height: '100%' }}
          source={{
            uri:
              'https://static.adweek.com/adweek.com-prod/wp-content/uploads/2019/12/amazon-advertising-2020-CONTENT-2019.png',
          }}
        />
      </View>
      <View style={size}>
        <Image
          style={{ width: '100%', height: '100%' }}
          source={{
            uri:
              'https://static.adweek.com/adweek.com-prod/wp-content/uploads/2019/12/prediction-dtc-change-CONTENT-2019.png',
          }}
        />
      </View>
      <View style={size}>
        <Image
          style={{ width: '100%', height: '100%' }}
          source={{
            uri:
              'https://static.adweek.com/adweek.com-prod/wp-content/uploads/2019/11/brandweek-recession-thoughts-CONTENT-2019.jpg',
          }}
        />
      </View>
    </Carousel>
  );

  const TextItemCard = (title: string, descriptn: string) => (
    <View style={styles.collapseItemContainer}>
      <Text style={styles.collapseItemTitle}>{title}</Text>
      <Text style={styles.collapseItemContent}>{descriptn}</Text>
    </View>
  );

  const renderFormattedCustomerAddress = () => `${customerEq?.address?.street || ''} ${customerEq?.address?.city || ''}, ${customerEq?.address?.state || ''
  } ${customerEq?.address?.zipCode || ''}`;

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Work Order"
        leftIcon="back"
        _goBack={() => navigation.goBack()}
        _openMenu={openMenu}
      />
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Tabs
          initialPage={0}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={() => <ScrollableTab style={{ backgroundColor: '#505560' }} />}
        >
          <Tab
            heading="Details"
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.activeTabStyle}
            textStyle={styles.textStyle}
            activeTextStyle={styles.activeTextStyle}
          >
            <ScrollView
              style={{ flex: 1, backgroundColor: 'white', marginHorizontal: 10 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ marginTop: 20 }}>
                {selectedJob && TextItemCard('WORK ORDER #', `${selectedJob?.jobId}`)}
                <View style={styles.collapseItemContainer}>
                  <Text style={styles.collapseItemTitle}>SCHEDULE DATE</Text>
                  {selectedJob?.scheduleDate && (
                    <Text style={styles.collapseItemContent}>
                      {moment(selectedJob?.scheduleDate).format('MMMM DD YYYY')}
                    </Text>
                  )}
                </View>
                {selectedJob?.scheduledStartTime && (
                  <View style={[styles.collapseItemContainer, { marginEnd: 4 }]}>
                    <Text style={styles.collapseItemTitle}>SCHEDULE TIME</Text>
                    <Text style={styles.collapseItemContent}>
                      {selectedJob?.scheduledStartTime
                        && moment.utc(selectedJob?.scheduledStartTime).format('LT')}
                    </Text>
                  </View>
                )}
                {TextItemCard(
                  'CLIENT',
                  customerEq && customerEq?.profile
                    ? `${customerEq.profile?.firstName} ${customerEq.profile?.lastName}`
                    : '',
                )}
                {TextItemCard('CLIENT ADDRESS', renderFormattedCustomerAddress())}
                {selectedJob?.type
                  && selectedJob.type?.title
                  && TextItemCard('JOB TYPE', selectedJob.type.title)}
                {selectedJob?.description
                  && TextItemCard('JOB DESCRIPTION', selectedJob.description)}
                {selectedJob?.jobLocation
                  && selectedJob.jobLocation?.name
                  && TextItemCard('JOB LOCATION', selectedJob.jobLocation.name)}
                {selectedJob?.jobSite
                  && selectedJob.jobSite?.name
                  && TextItemCard('JOB SITE', selectedJob.jobSite.name)}
                {selectedJob?.technician
                  && selectedJob?.technician?.profile
                  && TextItemCard('TECHNICIAN', selectedJob.technician.profile?.displayName)}
              </View>
              {equipmentDetails?.equipment && (
                <View>
                  <Collapse
                    style={styles.collapse}
                    isCollapsed
                  >
                    <CollapseHeader style={styles.collapseHeader}>
                      <View style={{ width: '95%' }}>
                        <Text style={styles.collapseHeaderTitle}>
                          Equipment
                        </Text>
                      </View>
                      <Icon
                        name="ios-arrow-down"
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
                          <Text style={styles.collapseItemContent}>
                            {equipmentDetails.equipment?.type?.title}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.collapseItemTitle}>MODEL</Text>
                          <Text style={styles.collapseItemContent}>
                            {equipmentDetails.equipment?.info?.model}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                        <View style={{ flex: 1, marginTop: 10 }}>
                          <Text style={styles.collapseItemTitle}>BRAND</Text>
                          <Text style={styles.collapseItemContent}>
                            {equipmentDetails?.equipment?.brand?.title}
                          </Text>
                        </View>

                        <View style={{ flex: 1, marginTop: 10 }}>
                          <Text style={styles.collapseItemTitle}>SERIAL</Text>
                          <Text style={styles.collapseItemContent}>
                            {equipmentDetails.equipment?.info?.serialNumber}
                          </Text>
                        </View>
                      </View>
                      {equipmentDetails.equipment?.images.length > 0 && (
                        <View style={styles.ImageCardContainer}>
                          {renderCarouselView()}
                        </View>
                      )}
                    </CollapseBody>
                  </Collapse>
                </View>
              )}
            </ScrollView>
          </Tab>

          <Tab
            active
            heading="Purchase Orders"
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.activeTabStyle}
            textStyle={styles.textStyle}
            activeTextStyle={[styles.activeTextStyle, { fontWeight: '600', padding: 2 }]}
          >
            <View style={{ flex: 1, backgroundColor: 'white', marginTop: 10 }}>
              <ScrollView>
                {purchaseorder
                  && purchaseorder.map((item) => (
                    <PurchaseOrder order={item} navigation={navigation} />
                  ))}
              </ScrollView>
            </View>
          </Tab>
        </Tabs>
      </View>

      <Footer
        onScan={() => {
          navigation.navigate('ScanBlueTag');
        }}
        onOpen={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}
      />
    </View>
  );
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
    borderWidth: 0,
    borderRadius: 4,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: 'white',
    width: deviceWidth * 0.45,
    marginVertical: 5,
  },
  activeTabStyle: {
    backgroundColor: 'white',
    borderRadius: 4,
    marginVertical: 7,
    width: deviceWidth * 0.45,
  },
  textStyle: {
    color: 'white',
    fontWeight: '600',
  },
  activeTextStyle: {
    color: 'black',
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
    marginBottom: 25,
  },
  collapseHeaderTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
  },

  collapseItemTitle: {
    fontSize: 12,
    marginBottom: 5,
  },
  collapseItemContent: {
    fontSize: 16,
    ...Platform.select({
      ios: {
        fontWeight: '500',
      },
      android: {
        fontWeight: '700',
        fontSize: 15,
      },
    }),
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
    height: '15%',
  },
  ItemContainer2: {
    justifyContent: 'center',
    height: '15%',
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
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },

  ImageCardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    marginBottom: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOpacity: 0.5,
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 0,
      },
      android: {
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
    }),
  },

  ImageCardText: {
    flex: 2,
    backgroundColor: 'white',
    fontSize: 18,
    color: 'black',
    ...Platform.select({
      ios: {
        fontWeight: '500',
      },
      android: {
        fontWeight: '700',
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
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.btnPrimary,
    marginBottom: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        height: 60,
      },
      android: {
        height: 60,
      },
    }),
  },

  signOffBtn: {
    flexDirection: 'row',
    backgroundColor: colors.btnPrimaryLight,
    flex: 1,
    marginBottom: 20,
    borderRadius: 5,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },

  partsBtnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  callBtnTextWhite: {
    marginLeft: 5,
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  callBtnTextBlue: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: '700',
    color: colors.btnTextPrimary,
  },
  style1: {
    width: 100,
    ...Platform.select({
      ios: {
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
  equipmentText: {
    ...Platform.select({
      ios: {
        fontWeight: '500',
        fontSize: 18,
      },
      android: {
        fontWeight: '700',
        fontSize: 15,
      },
    }),
    color: 'black',
    margin: 2,
  },
});

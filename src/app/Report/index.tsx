import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Linking,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Image } from 'react-native-elements';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import moment from 'moment';
import { StackScreenProps } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import openMap from 'react-native-open-maps';
import styles from './styles';
import { turquoise } from '../../styles/colors';
import { Header } from '../../common/common-header';
import { Service } from '../../config/services';
import Loading from '../../common/loading';

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

type Props = StackScreenProps<JobStackParamList, 'Report'>;

function Report({ navigation, route }: Props) {
  const [job, setJob] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [id, setId] = useState('');
  const [from, setFrom] = useState(false);

  const _goBack = () => {
    navigation.goBack();
  };

  const handleEmailCompose = (email) => {
    Linking.canOpenURL(`mailto:${email}`)
      .then(supported => {
        if (supported) {
          Linking.openURL(`mailto:${email}`);
        }
        else {
          Alert.alert('Email address is not available')
        }
      })
      .catch(err => {
        console.log('====', err)
      })
  };

  const _handleCall = (phone) => {

    if (phone) {
      Linking.canOpenURL(`tel:${phone}`)
        .then(supported => {
          if (supported) {
            Linking.openURL(`tel:${phone}`)
          }
          else {
            Alert.alert('Phone number is not available')
          }
        })
        .catch(err => {
          console.log('====', err)
        })
    }
  };

  const _handleSMS = (phone) => {

    if (phone) {
      Linking.canOpenURL(`sms:${phone}`)
        .then(supported => {
          if (supported) {
            Linking.openURL(`sms:${phone}`)
          }
          else {
            Alert.alert('Phone number is not available')
          }
        })
        .catch(err => {
          console.log('====', err)
        })
    }
  };

  const getJob = async () => {
    const body = {
      jobId: id,
    };

    let response: any;

    try {
      response = await Service.getJobDetails(body);
      const { status, job } = response.data;

      console.log(job)

      if (status == 1) {
        setJob(job);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Something has gone wrong');
    }
  };

  useEffect(() => {
    setId(route?.params?.job && route.params.job?._id ? route.params.job._id : null);
    setFrom(route?.params?.from ? route.params.from : false);
  }, []);

  useEffect(() => {
    getJob();
  }, [id]);

  function openJobLocationInMaps(location, p) {
    if (p) {
      const coordinatesList = {
        latitude:
          (job.jobSite && job.jobSite?.location.coordinates[1])
          || (job.jobLocation && job.jobLocation?.location.coordinates[1])
          || '',
        longitude:
          (job.jobSite && job.jobSite?.location.coordinates[0])
          || (job.jobLocation && job.jobLocation?.location.coordinates[0])
          || '',
      };

      return openMap({ ...coordinatesList, zoom: 18 });
    }
    else {
      const street = location.street ? location.street : '';
      const state = location.state ? location.state : '';
      const city = location.city ? location.city : '';
      const zipcode = location.zipcode ? location.zipCode : '';

      console.log(`https://www.google.com/maps/place/${street},+${city},+${state}+${zipcode}`)

      Linking.openURL(`https://www.google.com/maps/place/${street},+${city},+${state}+${zipcode}`)
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Job Details" leftIcon="goback" _goBack={() => _goBack()} />
      {!isLoading && (
        <ScrollView
          style={styles.viewContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ ...styles.row, borderTopColor: 'transparent' }}>
            <Text style={styles.label}>Job Number</Text>
            <Text style={styles.value}>{`# ${job && job?.jobId ? job.jobId : ''}`}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Job Type</Text>
            <Text style={styles.value}>{job && job.type?.title ? job.type.title : 'Repair'}</Text>
          </View>

          {!from && (
            <View style={styles.row}>
              <Text style={styles.label}>Customer</Text>
              <Text style={styles.value}>
                {(job && job?.customer && job.customer?.profile)
                  ? job.customer.profile?.displayName
                  : ''}
              </Text>
            </View>
          )}

          {job && job?.ticket?.customerPO && (
            <View style={styles.row}>
              <Text style={styles.label}>Customer PO</Text>
              <Text style={styles.value}>{job.ticket?.customerPO}</Text>
            </View>
          )}

          <View>
            <Collapse>
              <CollapseHeader>
                {job &&
                  <View style={styles.row}>
                    <Text style={styles.label}>Customer Contact</Text>
                    <Text style={styles.value}>
                      {(job.ticket.customerContactId && job.ticket.customerContactId.name) ? job.ticket.customerContactId.name : job.customer.profile?.displayName}
                    </Text>
                  </View>
                }
              </CollapseHeader>
              <CollapseBody
                style={{
                  padding: 10,
                  justifyContent: 'center',
                }}
              >
                {(job && job.ticket?.customerContactId && job.ticket?.customerContactId.email)
                  ?
                  <TouchableOpacity onPress={() => handleEmailCompose(job.ticket?.customerContactId.email)}>
                    <View style={{ ...styles.row, borderBottomColor: 'transparent' }}>
                      <Text style={{ ...styles.label, borderTopWidth: 0 }}>Email</Text>
                      <View style={styles.rows}>
                        <MaterialIcons name="email" size={20} color={turquoise} style={{ paddingRight: 5 }} />
                        <Text style={styles.value}>
                          {job.ticket?.customerContactId.email}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  :
                  (job && job.customer.info?.email)
                    ?
                    <TouchableOpacity onPress={() => handleEmailCompose(job.customer.info?.email)}>
                      <View style={{ ...styles.row, borderBottomColor: 'transparent' }}>
                        <Text style={{ ...styles.label, borderTopWidth: 0 }}>Email</Text>
                        <View style={styles.rows}>
                          <MaterialIcons name="email" size={20} color={turquoise} style={{ paddingRight: 5 }} />
                          <Text style={styles.value}>
                            {job.customer.info?.email}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    :
                    null
                }
                {job && job.ticket?.customerContactId && job.ticket?.customerContactId.phone
                  ?
                  <Collapse>
                    <CollapseHeader>
                      <View style={styles.row}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.rows}>
                          <MaterialIcons name="phone-forwarded" size={20} color={turquoise} style={{ paddingRight: 5 }} />
                          <Text style={styles.value}>
                            {job.ticket?.customerContactId.phone}
                          </Text>
                        </View>
                      </View>
                    </CollapseHeader>
                    <CollapseBody
                      style={{
                        padding: 10,
                        justifyContent: 'center',
                      }}
                    >
                      <View style={styles.phoneAction}>
                        <TouchableOpacity onPress={() => _handleCall(job.ticket?.customerContactId.phone)}>
                          <View style={{ ...styles.row, borderBottomColor: 'transparent' }}>
                            <View style={styles.rows}>
                              <MaterialIcons name="phone-forwarded" size={20} color={turquoise} style={{ paddingRight: 5 }} />
                            </View>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => _handleSMS(job.ticket?.customerContactId.phone)}>
                          <View style={{ ...styles.row, borderBottomColor: 'transparent' }}>
                            <View style={styles.rows}>
                              <MaterialIcons name="textsms" size={20} color={turquoise} style={{ paddingRight: 5 }} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </CollapseBody>
                  </Collapse>
                  :
                  (job && job.customer.contact?.phone)
                    ?
                    <Collapse>
                      <CollapseHeader>
                        <View style={styles.row}>
                          <Text style={styles.label}>Phone Number</Text>
                          <View style={styles.rows}>
                            <MaterialIcons name="phone-forwarded" size={20} color={turquoise} style={{ paddingRight: 5 }} />
                            <Text style={styles.value}>
                              {job.customer.contact?.phone}
                            </Text>
                          </View>
                        </View>
                      </CollapseHeader>
                      <CollapseBody
                        style={{
                          padding: 10,
                          justifyContent: 'center',
                        }}
                      >
                        <View style={styles.phoneAction}>
                          <TouchableOpacity onPress={() => _handleCall(job.customer.contact?.phone)}>
                            <View style={{ ...styles.row, borderBottomColor: 'transparent' }}>
                              <View style={styles.rows}>
                                <MaterialIcons name="phone-forwarded" size={20} color={turquoise} style={{ paddingRight: 5 }} />
                              </View>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => _handleSMS(job.customer.contact?.phone)}>
                            <View style={{ ...styles.row, borderBottomColor: 'transparent' }}>
                              <View style={styles.rows}>
                                <MaterialIcons name="textsms" size={20} color={turquoise} style={{ paddingRight: 5 }} />
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </CollapseBody>
                    </Collapse>
                    :
                    null
                }
              </CollapseBody>
            </Collapse>

          </View>

          {!from && (
            <View style={styles.row}>
              <Text style={styles.label}>Technician</Text>
              <Text style={styles.value}>
                {job && job?.technician ? job.technician?.profile?.displayName : ''}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Job Type</Text>
            <Text style={styles.value}>{job && job?.type ? job.type?.title : ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Scheduled</Text>
            <Text style={styles.value}>
              {job && job?.scheduleDate
                ? job?.scheduledStartTime
                  ? job?.scheduledEndTime
                    ? moment(job.scheduleDate).utc().format('MM/DD/YYYY') + "  " + moment(job.scheduledStartTime).utc().format('h:mm A') + " - " + moment(job.scheduledEndTime).utc().format('h:mm A')
                    : moment(job.scheduleDate).utc().format('MM/DD/YYYY') + "  " + moment(job.scheduledStartTime).utc().format('h:mm A') + " - ?"
                  : job?.scheduledEndTime
                    ? moment(job.scheduleDate).utc().format('MM/DD/YYYY') + "  " + "? - " + moment(job.scheduledEndTime).utc().format('h:mm A')
                    : moment(job.scheduleDate).utc().format('MM/DD/YYYY')
                : ''
              }
            </Text>
          </View>

          {!from && (
            <View style={styles.row}>
              <Text style={styles.label}>Completed (Y/N)</Text>
              <Text style={styles.value}>{job && job?.status == '2' ? 'Y' : 'N'}</Text>
            </View>
          )}
          {(job && job?.jobLocation)
            ?
            <TouchableOpacity onPress={() => openJobLocationInMaps(job?.jobLocation, true)}>
              <View style={styles.row}>
                <Text style={styles.label}>Job Location</Text>
                <View style={styles.rows}>
                  <MaterialIcons name="location-on" size={20} color={turquoise} />
                  <Text style={styles.value}>{job.jobLocation.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
            : (job && job?.customer.address && (job?.customer.address.city || job?.customer.address.state || job?.customer.address.street || job?.customer.address.zipCode) )
              ?
              <TouchableOpacity onPress={() => openJobLocationInMaps(job?.customer.address, false)}>
                <View style={styles.row}>
                  <Text style={styles.label}>Job Location</Text>
                  <View style={styles.rows}>
                    <MaterialIcons name="location-on" size={20} color={turquoise} />
                    <Text style={styles.value}>{job?.customer.jobLocations.city}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              : null
          }
          {job && job?.jobSite && (
            <TouchableOpacity onPress={openJobLocationInMaps}>
              <View style={styles.row}>
                <Text style={styles.label}>Job Site</Text>
                <View style={styles.rows}>
                  <MaterialIcons name="location-on" size={20} color={turquoise} />
                  <Text style={styles.value}>{job.jobSite.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {job && job?.description && (
            <View style={styles.notelbl}>
              <Text style={styles.nlabel}>Job Description</Text>
              <Text style={styles.note}>
                {job.description}
              </Text>
            </View>
          )}

          {job && job?.ticket?.note && (
            <View style={styles.notelbl}>
              <Text style={styles.nlabel}>Ticket Note</Text>
              <Text style={styles.note}>
                {job && job.ticket ? job.ticket.note : 'No notes found'}
              </Text>
            </View>
          )}

          {!from && job && job?.equipmentId && (
            <View>
              <View style={styles.unitTitle}>
                <Text style={styles.unitText}>Unit Info</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Serial Number</Text>
                <Text style={styles.value}>
                  {job.equipmentId.info.serialNumber || ''}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Model</Text>
                <Text style={styles.value}>{job.equipmentId.info.model || ''}</Text>
              </View>
            </View>
          )}
          {
            job && job?.ticket?.image && (
              <View style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 5, paddingTop: 5,
              }}
              >
                <Image
                  source={{ uri: `${job.ticket.image}` }}
                  style={{
                    width: '100%', height: undefined, aspectRatio: 1, resizeMode: 'contain',
                  }}
                  PlaceholderContent={<ActivityIndicator />}
                />
              </View>
            )
          }
          {
            job && job?.comment && (
              <View style={styles.notelbl}>
                <Text style={styles.nlabel}>Comment</Text>
                <Text style={styles.note}>
                  {job?.comment}
                </Text>
              </View>
            )
          }
        </ScrollView>
      )}
      {isLoading && (
        <View style={{ flex: 1 }}>
          <Loading />
        </View>
      )}
    </View>
  );
}

export default Report;

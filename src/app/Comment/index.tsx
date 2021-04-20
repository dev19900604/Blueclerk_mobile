import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

import Toast from 'react-native-simple-toast';

import { StackScreenProps } from '@react-navigation/stack';

import { Service } from '../../config/services';
import { Header } from '../../common/common-header';
import Loading from '../../common/loading';

import styles from './styles';

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

function Comment({ navigation, route }: Props) {
  const [isLoading, setLoading] = useState(true);
  const [id, setId] = useState('');
  const [status, setStatus] = useState(-1);
  const [comment, setComment] = useState('');

  const _goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setId(route?.params?.job && route.params.job?._id ? route.params.job._id : null);
    getJob(route.params.job._id);
    setStatus(route.params.job?.status);
  }, []);

  const getJob = async (id) => {
    const body = {
      jobId: id,
    };
    let response: any;
    try {
      response = await Service.getJobDetails(body);
      const { status, job } = response.data;
      setComment(job.comment?job.comment : '')
      setLoading(false)
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Something has gone wrong');
    }
  };

  const submitComment = async () => {
    if (id && status !== null && status !== -1 && comment.length > 0) {
      setLoading(true)
      const response = await Service.updateJob({
        jobId: id,
        status: status,
        comment: comment,
      }).then(() => {
        setLoading(false)
        setTimeout(() => {
          Toast.show('Comment added successfully.');
          navigation.goBack()
        }, 300);
      })
        .catch(err => {
          setLoading(false)
          console.log(err)
        })
    }
    else {
      Alert.alert('Warning', 'Somgthing went wrong')
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Comment" leftIcon="goback" _goBack={() => _goBack()} />
      {!isLoading && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.newcomment}>
            <TextInput
              placeholder="Type in comment"
              style={styles.input}
              multiline={true}
              numberOfLines={10}
              textAlignVertical="top"
              value={comment}
              onChangeText={(event) => setComment(event)}
            />
            <TouchableOpacity onPress={() => submitComment()}>
              <View style={styles.submitButton}>
                <Text style={styles.submitButtonLabel}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      )}
      {isLoading && (
        <View style={{ flex: 1 }}>
          <Loading />
        </View>
      )}
    </View>
  );
}

export default Comment;

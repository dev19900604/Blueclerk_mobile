import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Service } from '../../config/services';
import { Header } from '../../common/common-header';
import Job from '../../common/job';
import Loading from '../../common/loading';
import colors, { destructiveRed } from '../../styles/colors';

const { getTechnicianJobsToday, scanJobEquipment } = Service;

export default ({ navigation }: any) => {
  const [jobs, setjobs] = useState(null);
  const actionSheetRef = useRef(null);
  const [comment, setcomment] = useState('');
  const seletedJob = useRef(null);
  const [upload, setupload] = useState(false);

  useEffect(() => {
    getTechnicianJobsToday().then((response) => {
      const { jobs } = response.data;
      setjobs(jobs);
    });

    return () => {
      if (actionSheetRef.current) {
        setcomment('');
        actionSheetRef?.current?.close();
      }
    };
  }, []);

  const handleJob = (job) => {
    seletedJob.current = job;
    actionSheetRef?.current?.open();
  };

  const renderJob = (job: any) => (
    <Job item={job.item} onClick={() => handleJob(job.item)} />
  );

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Add comment to job"
        leftIcon="back"
        elevation="0"
        _goBack={() => navigation.goBack()}
      />
      {jobs == null ? (
        <Loading />
      ) : jobs.length > 0 ? (
        <FlatList data={jobs} renderItem={renderJob} keyExtractor={(item) => item._id} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No Current Jobs</Text>
        </View>
      )}
      <RBSheet ref={actionSheetRef} height={160}>
        <View style={{ margin: 10 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}
          >
            <TouchableOpacity
              onPress={() => {
                actionSheetRef?.current?.close();
                setcomment('');
              }}
            >
              <Text style={{ fontSize: 15, color: destructiveRed }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <TextInput
              style={{
                width: '100%',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#f0f0f0',
                marginBottom: 15,
                paddingHorizontal: 10,
                marginRight: 10,
              }}
              value={comment}
              onChangeText={(text) => setcomment(text)}
              placeholder="Write comment!"
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button
              mode="outlined"
              color={colors.assertColor}
              onPress={() => {
                setcomment('');
                actionSheetRef.current.close();
              }}
            >
              Comment later
            </Button>
            <Button
              mode="contained"
              style={{ backgroundColor: colors.assertColor }}
              disabled={!comment}
              loading={upload}
              onPress={() => {
                const nfcTag = navigation.getParam('nfcTag');
                setupload(true);
                scanJobEquipment({ nfcTag, jobId: seletedJob.current._id, comment })
                  .then((response) => {
                    setupload(false);
                    actionSheetRef.current.close();
                    setcomment('');
                  })
                  .catch(() => {
                    setupload(false);
                  });
              }}
            >
              Comment now
            </Button>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

import { Task } from 'mobx-task';
import React from 'react';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../common/loader';

export type TaskType = Task<any, any>;

export function getViewForTaskStatus(task: Task<any, any>) {
  return task.match({
    pending: () => <Loader loading />,
    rejected: (error: any) => (
      <Snackbar
        visible
        action={{
          label: 'Okay',
          onPress: () => {
            task.setState({ state: 'resolved' });
          },
        }}
        onDismiss={() => task.setState({ state: 'resolved' })}
      >
        {error.message}
      </Snackbar>
    ),
    resolved: () => {
      task.setState({ state: 'resolved' });
    },
  });
}

export async function storeData(name: string, value: string) {
  await AsyncStorage.setItem(name, value);
}

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode?: string;
};

export function formatAddress(address?: Address) {
  if (address === undefined) {
    return '';
  }

  return `${address.street ?? ''} ${address.city ?? ''}, ${address.state ?? ''}, ${address.zipCode ?? ''}`.trim();
}

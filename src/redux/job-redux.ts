export const LOGOUT = 'logout';
export const SETJOBS = 'setJobs';
export const logout = () => ({
  type: LOGOUT,
});

export const setJobs = (jobs) => ({
  type: SETJOBS,
  payload: jobs,
});

type JobsState = {
  jobs: any[],
}

const initialState: JobsState = {
  jobs: [],
};

const compare = (a: any, b: any) => {
  if (new Date(a.scheduleDate) > new Date(b.scheduleDate)) {
    return -1;
  }
  if (new Date(a.scheduleDate) < new Date(b.scheduleDate)) {
    return 1;
  }
  return 0;
};

export const jobsReducer = (state: JobsState, action: any) => {
  switch (action.type) {
    case SETJOBS: {
      const retrievedJobs: any[] = action.payload;
      retrievedJobs.sort(compare);
      return {
        ...state, jobs: retrievedJobs,
      };
    }
    case LOGOUT:
      return [];
    default:
      return initialState;
  }
};

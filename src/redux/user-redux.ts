import AsyncStorage from '@react-native-community/async-storage';

export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const SETSKIPGUIDE = 'setSkipGuide';
export const SETADMIN = 'setAdmin';

export const login = (profile: any, token: any) => ({
  type: LOGIN,
  payload: { profile, token },
});

export const logout = () => ({
  type: LOGOUT,
});

export const setSkipGuide = () => ({
  type: SETSKIPGUIDE,
});

export const setIsAdmin = (data: any) => ({
  type: SETADMIN,
  payload: data,
});

const initUser = {
  profile: {},
  token: '',
  skipGuide: false,
  isAdmin: false,
};

AsyncStorage.getItem('skipGuide', (error, result) => {
  if (!error) {
    if (result) {
      Object.assign(initUser, { skipGuide: result == '1' });
    }
  }
});

export default (state = initUser, action: any) => {
  switch (action.type) {
    case LOGIN: {
      const { skipGuide } = state;
      const { profile, token } = action.payload;
      return {
        profile,
        token,
        skipGuide,
      };
    }
    case LOGOUT:
      return initUser;
    case SETSKIPGUIDE: {
      return {
        ...state,
        skipGuide: true,
      };
    }
    case SETADMIN: {
      return {
        ...state,
        isAdmin: action.payload,
      };
    }
    default:
      return state;
  }
};

import { action, observable } from 'mobx';
import { LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import { task } from 'mobx-task';
import { IUser } from '../../../interfaces/i-user';
import {
  checkAndGetSocialLogin,
  socialSignUp,
  SocialSignupParams,
} from '../api/user-auth';

export enum SocialLoginType {
  facebook = 0,
  google = 1,
}

class UserStore {
  @observable public loggedIn = false;

  @observable public current?: IUser;

  @observable public token?: string;

  @action.bound
  public logout() {
    this.loggedIn = false;
    this.current = undefined;
    this.token = undefined;
    GoogleSignin.signOut();
    LoginManager.logOut();
  }

  @task.resolved
  public async attemptSocialLogin(socialId: string, type: SocialLoginType) {
    const { data } = await checkAndGetSocialLogin(socialId, type);
    if (data.user) {
      this.current = data.user;
      this.token = data.token;
      this.loggedIn = true;
    }
    return data.user !== undefined;
  }

  @task.resolved
  public async socialSignUp(userInfo: SocialSignupParams) {
    const { data } = await socialSignUp(userInfo);
    this.current = data.user;
    this.token = data.token;
    this.loggedIn = true;
    return data;
  }

  @action.bound
  public saveLoginInfo(user: IUser, token: string) {
    this.current = user;
    this.token = token;
    this.loggedIn = true;
  }
}

const userStoreSingleton = new UserStore();

export default userStoreSingleton;

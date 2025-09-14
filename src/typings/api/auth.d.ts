declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      isLogin: boolean;
      tokenValue: string;
      tokenName: string;
      refreshToken: string;
      loginId: number;
    }

    interface UserInfo {
      userId: string;
      userName: string;
      name: string;
      account: string;
      roles: string[];
      buttons: string[];
    }
  }
}

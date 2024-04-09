interface AuthInfo {
  token: string;
  setToken: (token: string) => void;
  loginUserName: string;
  setLoginUserName: (username: string) => void;
}

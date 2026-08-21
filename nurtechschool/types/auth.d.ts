declare type TAuth = {
  token?: string;
  token_otp?: string;
  name?: string;
  email?: string;
  avatar?: string;
};

declare interface IBSendOTP {
  email: string;
}
declare interface IBSignUp extends IBSendOTP {
  name: string;
  password: string;
}
declare interface IBVerifyOTP {
  token: string;
  otp: string;
}

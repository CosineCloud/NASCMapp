import { format } from 'date-fns';

// Simulated database using in-memory object
const user = {
  user: 'nascm.talha',
  pass: 'f29T101987!',
  user_type: 'admin',
  OTP: '291086',
  telegramID: '12345678',
  last_login_time: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
};

export const verifyCredentials = (username: string, password: string) => {
  if (username === user.user && password === user.pass) {
    return user;
  }
  return null;
};

export const verifyOTP = (username: string, otp: string) => {
  if (username === user.user && otp === user.OTP) {
    return user;
  }
  return null;
};

export const updateLastLoginTime = (username: string) => {
  if (username === user.user) {
    user.last_login_time = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    return user.last_login_time;
  }
  return null;
};

export const getLastLoginTime = (username: string) => {
  if (username === user.user) {
    return user.last_login_time;
  }
  return null;
};
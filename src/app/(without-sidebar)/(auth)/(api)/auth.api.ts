import { BaseResponse } from '@/types';
import api from '@store/api';

type LoginRequest = {
  username: string;
  password: string;
};

type LoginResponse = BaseResponse<{
  designation: string;
  email: string;
  id: string;
  mPinSetup: boolean;
  name: string;
  phoneNo: string;
  profile: string;
  roles: string[];
  sessionId: string;
  userStatus: string;
  access_token: string;
  refresh_token: string;
}>;

type UserDetailsResponse = BaseResponse<{
  userId: string;
  sessionId: string;
  phoneNo: string;
  designation: string;
  profile: string;
  email: string;
  roles: string[];
  id: string;
  accessType: number;
  userIp: string;
  sessionInfo: {
    deviceInfo: string;
    lastActive: string;
    ip: string;
    sessionId: string;
  };
  name: string;
  dateOfBirth: string;
  referral: string;
  isEligible: boolean;
  gender: string;
  userName: string;
  userStatus: string;
  mPinSetup: boolean;
}>;

enum AUTH_API_ENDPOINTS {
  GET_USER_DETAILS = '/auth/me',
  LOGIN = '/auth/login',
}

const loginApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: AUTH_API_ENDPOINTS.LOGIN,
        method: 'POST',
        body,
      }),
    }),
    getUserDetails: builder.query<UserDetailsResponse, void>({
      query: () => ({
        url: AUTH_API_ENDPOINTS.GET_USER_DETAILS,
      }),
    }),
  }),
});

export const { useLoginMutation, useGetUserDetailsQuery } = loginApi;

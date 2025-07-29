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

enum AUTH_API_ENDPOINTS {
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
  }),
});

export const { useLoginMutation } = loginApi;

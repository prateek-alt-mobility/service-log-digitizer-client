import { BaseResponse } from '@/types';
import api from '@store/api';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = BaseResponse<{
  token: string;
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

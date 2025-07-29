import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const api = createApi({
  baseQuery,
  endpoints: () => ({}),
});

export default api;

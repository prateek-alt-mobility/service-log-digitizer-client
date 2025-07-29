import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE,
});

const api = createApi({
  baseQuery,
  endpoints: () => ({}),
});

export default api;

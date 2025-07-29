import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/auth';
import uiReducer from './slices/ui';
import api from './api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (gdm) => gdm().concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

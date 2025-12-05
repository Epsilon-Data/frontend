import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { notificationController } from '@app/controllers/notificationController';

/**
 * Log a warning and show a toast!
 */
export const errorLoggingMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload;

    let title: React.ReactNode;

    if (typeof payload === 'string') {
      title = payload;
    } else if (payload && typeof payload === 'object' && 'message' in payload) {
      title = String((payload as { message: unknown }).message);
    } else {
      title = 'An unexpected error occurred';
    }

    notificationController.error({ title });
  }

  return next(action);
};

import uuidv4 from 'uuid/v4';

import NotificationScheduler from './NotificationScheduler';
import { NotificationTriggerInput as NativeNotificationTriggerInput } from './NotificationScheduler.types';
import { NotificationRequestInput, NotificationTriggerInput } from './Notifications.types';

export default async function scheduleNotificationAsync(
  request: NotificationRequestInput
): Promise<string> {
  return await NotificationScheduler.scheduleNotificationAsync(
    request.identifier ?? uuidv4(),
    request.content,
    parseTrigger(request.trigger)
  );
}

function parseTrigger(userFacingTrigger: NotificationTriggerInput): NativeNotificationTriggerInput {
  if (userFacingTrigger === null) {
    return null;
  }

  if (userFacingTrigger === undefined) {
    throw new TypeError(
      'Encountered an `undefined` notification trigger. If you want to trigger the notification immediately, pass in an explicit `null` value.'
    );
  }

  if (userFacingTrigger instanceof Date) {
    return { type: 'date', timestamp: userFacingTrigger.getTime() };
  } else if (typeof userFacingTrigger === 'number') {
    return { type: 'date', timestamp: userFacingTrigger };
  } else if (
    Object.keys(userFacingTrigger).length === 2 &&
    'hour' in userFacingTrigger &&
    'minute' in userFacingTrigger
  ) {
    const hour = userFacingTrigger.hour;
    const minute = userFacingTrigger.minute;
    if (hour === undefined || minute === undefined) {
      throw new TypeError('Both hour and minute need to have valid values. Found undefined');
    }
    if (hour < 0 || hour > 23) {
      throw new RangeError(`The hour parameter needs to be between 0 and 23. Found: ${hour}`);
    }
    if (minute < 0 || minute > 59) {
      throw new RangeError(`The minute parameter needs to be between 0 and 59. Found: ${minute}`);
    }
    return {
      type: 'daily',
      hour,
      minute,
    };
  } else if (
    (Object.keys(userFacingTrigger).length === 1 && 'seconds' in userFacingTrigger) ||
    (Object.keys(userFacingTrigger).length === 2 &&
      'seconds' in userFacingTrigger &&
      'repeats' in userFacingTrigger)
  ) {
    return {
      type: 'timeInterval',
      seconds: userFacingTrigger.seconds,
      repeats: userFacingTrigger.repeats ?? false,
    };
  } else {
    // @ts-ignore
    const { repeats, ...calendarTrigger } = userFacingTrigger;
    // @ts-ignore
    return { type: 'calendar', value: calendarTrigger, repeats };
  }
}

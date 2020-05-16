import uuidv4 from 'uuid/v4';
import NotificationScheduler from './NotificationScheduler';
export default async function scheduleNotificationAsync(request) {
    return await NotificationScheduler.scheduleNotificationAsync(request.identifier ?? uuidv4(), request.content, parseTrigger(request.trigger));
}
function parseTrigger(userFacingTrigger) {
    if (userFacingTrigger === null) {
        return null;
    }
    if (userFacingTrigger === undefined) {
        throw new TypeError('Encountered an `undefined` notification trigger. If you want to trigger the notification immediately, pass in an explicit `null` value.');
    }
    if (userFacingTrigger instanceof Date) {
        return { type: 'date', timestamp: userFacingTrigger.getTime() };
    }
    else if (typeof userFacingTrigger === 'number') {
        return { type: 'date', timestamp: userFacingTrigger };
    }
    else if (Object.keys(userFacingTrigger).length === 2 &&
        'hourOfDay' in userFacingTrigger &&
        'minute' in userFacingTrigger) {
        const hourOfDay = userFacingTrigger.hourOfDay;
        const minute = userFacingTrigger.minute;
        if (hourOfDay === undefined || minute === undefined) {
            throw new TypeError('Both hourOfDay and minute need to have valid values. Found undefined');
        }
        if (hourOfDay < 0 || hourOfDay > 23) {
            throw new RangeError(`The hourOfDay parameter needs to be between 0 and 23. Found: ${hourOfDay}`);
        }
        if (minute < 0 || minute > 59) {
            throw new RangeError(`The minute parameter needs to be between 0 and 59. Found: ${minute}`);
        }
        return {
            type: 'daily',
            hourOfDay,
            minute,
        };
    }
    else if ('seconds' in userFacingTrigger) {
        return {
            type: 'timeInterval',
            seconds: userFacingTrigger.seconds,
            repeats: userFacingTrigger.repeats ?? false,
        };
    }
    else {
        // @ts-ignore
        const { repeats, ...calendarTrigger } = userFacingTrigger;
        return { type: 'calendar', value: calendarTrigger, repeats };
    }
}
//# sourceMappingURL=scheduleNotificationAsync.js.map
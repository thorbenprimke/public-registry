package expo.modules.notifications.notifications.triggers;

import android.os.Parcel;

import java.util.Calendar;
import java.util.Date;

import androidx.annotation.Nullable;
import expo.modules.notifications.notifications.interfaces.SchedulableNotificationTrigger;

/**
 * A schedulable trigger representing a notification to be scheduled once per day.
 */
public class DailyTrigger implements SchedulableNotificationTrigger {
  private int mHourOfDay;
  private int mMinute;

  public DailyTrigger(int hourOfDay, int minute) {
    mHourOfDay = hourOfDay;
    mMinute = minute;
  }

  private DailyTrigger(Parcel in) {
    mHourOfDay = in.readInt();
    mMinute = in.readInt();
  }

  public int getHourOfDay() {
    return mHourOfDay;
  }

  public int getMinute() {
    return mMinute;
  }

  @Nullable
  @Override
  public Date nextTriggerDate() {
    Calendar nextTriggerDate = Calendar.getInstance();
    nextTriggerDate.set(Calendar.HOUR_OF_DAY, mHourOfDay);
    nextTriggerDate.set(Calendar.MINUTE, mMinute);
    nextTriggerDate.set(Calendar.SECOND, 0);
    nextTriggerDate.set(Calendar.MILLISECOND, 0);
    Calendar rightNow = Calendar.getInstance();
    if (nextTriggerDate.before(rightNow)) {
      nextTriggerDate.add(Calendar.DATE, 1);
    }
    return nextTriggerDate.getTime();
  }

  @Override
  public int describeContents() {
    return 0;
  }

  @Override
  public void writeToParcel(Parcel dest, int flags) {
    dest.writeInt(mHourOfDay);
    dest.writeInt(mMinute);
  }

  public static final Creator<DailyTrigger> CREATOR = new Creator<DailyTrigger>() {
    @Override
    public DailyTrigger createFromParcel(Parcel in) {
      return new DailyTrigger(in);
    }

    @Override
    public DailyTrigger[] newArray(int size) {
      return new DailyTrigger[size];
    }
  };
}

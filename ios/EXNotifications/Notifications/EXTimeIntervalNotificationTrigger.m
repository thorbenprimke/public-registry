//
//  EXTimeIntervalNotificationTrigger.m
//  EXNotifications
//
//  Created by Thorben Primke on 5/6/20.
//

#import "EXTimeIntervalNotificationTrigger.h"

@interface EXTimeIntervalNotificationTrigger ()

@property (NS_NONATOMIC_IOSONLY) BOOL isFirstInterval;
@property (NS_NONATOMIC_IOSONLY, readwrite) NSTimeInterval repeatTimeInterval;

@end

@implementation EXTimeIntervalNotificationTrigger

+ (instancetype)triggerWithTimeIntervalAndRepeatOptions:(NSTimeInterval)timeInterval repeats:(BOOL)repeats repeatTimeInterval:(NSTimeInterval)repeatTimeInterval
{
  EXTimeIntervalNotificationTrigger *trigger = [super triggerWithTimeInterval:timeInterval repeats:repeats];
  trigger.repeatTimeInterval = repeatTimeInterval;
  return trigger;
}

- (NSDate *)nextTriggerDate {
  if (self.isFirstInterval == NO || self.repeatTimeInterval == 0) {
    self.isFirstInterval = YES;
    return [NSDate dateWithTimeIntervalSinceNow:self.timeInterval];
  } else {
    return [NSDate dateWithTimeIntervalSinceNow:self.repeatTimeInterval];
  }
}

@end

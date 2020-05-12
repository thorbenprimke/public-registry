//
//  EXTimeIntervalNotificationTrigger.h
//  EXNotifications
//
//  Created by Thorben Primke on 5/6/20.
//

#import <UserNotifications/UserNotifications.h>

NS_ASSUME_NONNULL_BEGIN

@interface EXTimeIntervalNotificationTrigger : UNTimeIntervalNotificationTrigger

@property (NS_NONATOMIC_IOSONLY, readonly) NSTimeInterval repeatTimeInterval;

+ (instancetype)triggerWithTimeIntervalAndRepeatOptions:(NSTimeInterval)timeInterval repeats:(BOOL)repeats repeatTimeInterval:(NSTimeInterval)repeatTimeInterval;

@end

NS_ASSUME_NONNULL_END

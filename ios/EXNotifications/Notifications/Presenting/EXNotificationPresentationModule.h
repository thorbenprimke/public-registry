// Copyright 2018-present 650 Industries. All rights reserved.

#import <UMCore/UMExportedModule.h>
#import <UMCore/UMModuleRegistryConsumer.h>
#import <EXNotifications/EXNotificationsDelegate.h>

@interface EXNotificationPresentationModule : UMExportedModule <UMModuleRegistryConsumer, EXNotificationsDelegate>
@end

//
//  RTCTrainingModule.m
//  Cookbook
//
//  Created by Łukasz Andrzejewski on 07/06/2023.
//

#import "RTCTrainingModule.h"
#import <React/RCTLog.h>

@implementation RTCTrainingModule

RCT_EXPORT_MODULE(TrainingModule);

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDate:(NSString *) format) {
  NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
  [formatter setDateFormat:format];
  NSDate *currentDate = [NSDate date];
  NSString *dateString = [formatter stringFromDate:currentDate];
  return dateString;
}

@end

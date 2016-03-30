//
//  TouchViewController.h
//  TouchTracker
//
//  Created by Shane on 22/01/12.
//  Copyright (c) 2012 BlinkMobile Interactive. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "BGTouchDrawView.h"

#define LINE_WIDTH (3.0f)

@protocol SaveDrawingProtocol <NSObject>

- (void)saveDrawing:(UIImage *)drawing;
- (void)cancelDrawing;

@end

@interface BGTouchDrawViewController : UIViewController <UIPickerViewDelegate>{}

@property (strong, nonatomic) id delegate;

// The layer we draw to
@property (strong, nonatomic) CALayer *canvasLayer;

// The layer we use to display the cached image
@property (strong, nonatomic) CALayer *backgroundLayer;

// The layer we use to display the cached image
@property (strong, nonatomic) UIImage *cacheImage;
@property (strong, nonatomic) BGTouchDrawView *tdv;


@property (assign, nonatomic) BOOL touching;
@property (assign, nonatomic) BOOL moved;

// The path that represents the currently drawn line
@property (strong, nonatomic) UIBezierPath *path;

// The current location of a touch event
@property (assign, nonatomic) CGPoint pathPoint;

@property (assign, nonatomic) BOOL clearCanvasLayer;
@property (assign, nonatomic) BOOL clearBackgroundLayer;
@property (assign, nonatomic) CGSize contentSize;
@property (nonatomic, strong) UIImageView *backgroundView;

@property (nonatomic, strong) UIImage *backgroundImage;

@property (nonatomic, assign) BOOL clearCacheImage;

@property (assign, nonatomic) BOOL saved;

@property (assign, nonatomic) BOOL hasDrawing;

@property(nonatomic, strong) UIButton *redButton;

@property(nonatomic, strong) UIButton *blueButton;

@property(nonatomic, strong) UIButton *greenButton;

@property(nonatomic, strong) UIButton *blackButton;

@property(nonatomic, strong) UIColor *colour;

@property(nonatomic, strong) UIBarButtonItem *btColour;

@property (assign, nonatomic) BOOL shouldResizeContentOnRotate;

@property (assign, nonatomic) BOOL shouldCenterDrawing;

- (void)saveAll;
- (void)clearAll;
- (void)cancelAll;


@end


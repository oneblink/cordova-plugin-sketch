#import <QuartzCore/QuartzCore.h>
#import "BGTouchDrawView.h"

@implementation BGTouchDrawView

@synthesize backgroundLayer, canvasLayer;

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        // Only one finger/stylus for signing/drawing
        [self setMultipleTouchEnabled:NO];
    }

    return self;
}

@end

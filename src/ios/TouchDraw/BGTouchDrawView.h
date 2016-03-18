#import <UIKit/UIKit.h>


@interface BGTouchDrawView : UIView
{

}

// The layer we draw to
@property (strong, nonatomic) CALayer *canvasLayer;

// The layer we use to display the cached image
@property (strong, nonatomic) CALayer *backgroundLayer;


@property (nonatomic, strong) UIImageView *backgroundView;

@property (nonatomic, strong) UIImage *backgroundImage;

@end

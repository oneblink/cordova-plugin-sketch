#import "UIImage+ImageWithColor.h"

@implementation UIImage (ImageWithColor)
+ (UIImage *)imageWithColor:(UIColor *)color andSize:(CGRect)size {
    UIGraphicsBeginImageContext(size.size);
    CGContextRef context = UIGraphicsGetCurrentContext();

    CGContextSetFillColorWithColor(context, [color CGColor]);
    CGContextFillRect(context, size);

    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    return image;
}
@end

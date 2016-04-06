package au.com.blinkmobile.cordova.sketch;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

/**
 * Created by jt on 29/03/16.
 */
public class Sketch extends CordovaPlugin {
    private static final String TAG = Sketch.class.getSimpleName();

    private static final int SKETCH_REQUEST_CODE = 0x0010;
    private static final int ANNOTATION_REQUEST_CODE = 0x0100;

    private DestinationType destinationType;
    private EncodingType encodingType;
    private InputType inputType;
    private String inputData;
    private CallbackContext callbackContext;

    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        if (!action.equals("getSketch")) {
            callbackContext.sendPluginResult(
                    new PluginResult(Status.INVALID_ACTION, "Unsupported action: " + action));
            return false;
        }

        try {
            JSONObject options = args.getJSONObject(0);

            int opt = options.getInt("destinationType");
            if (opt >= 0 && opt < DestinationType.values().length) {
                this.destinationType = DestinationType.values()[opt];
            } else {
                callbackContext.error("Invalid destinationType");
                return false;
            }

            opt = options.getInt("encodingType");
            if (opt >= 0 && opt < EncodingType.values().length) {
                this.encodingType = EncodingType.values()[opt];
            } else {
                callbackContext.error("Invalid encodingType");
                return false;
            }

            opt = options.getInt("inputType");
            if (opt >= 0 && opt < InputType.values().length) {
                this.inputType = InputType.values()[opt];
            } else {
                callbackContext.error("Invalid inputType");
                return false;
            }

            if (this.inputType != InputType.NO_INPUT) {
                String inputData = options.getString("inputData");

                if (inputData == null || inputData.isEmpty()) {
                    callbackContext.error("input data not given");
                    return false;
                }
                this.inputData = inputData;
            } else {
                this.inputData = null;
            }

            if (this.cordova != null) {
                if (this.inputData != null && !this.inputData.isEmpty()) {
                    doAnnotation();
                } else {
                    doSketch();
                }
            }

            this.callbackContext = callbackContext;
            return true;
        } catch (JSONException e) {
            callbackContext.sendPluginResult(new PluginResult(Status.JSON_EXCEPTION, e.getMessage()));
            return false;
        }
    }

    private void doSketch() {
        this.cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                final Intent touchDrawIntent = new Intent(Sketch.this.cordova.getActivity(), TouchDrawActivity.class);

                touchDrawIntent.putExtra(TouchDrawActivity.BACKGROUND_IMAGE_TYPE,
                        TouchDrawActivity.BackgroundImageType.COLOUR.ordinal());
                touchDrawIntent.putExtra(TouchDrawActivity.BACKGROUND_COLOUR, "#FFFFFF");

                if (Sketch.this.encodingType == EncodingType.PNG) {
                    touchDrawIntent.putExtra(TouchDrawActivity.DRAWING_RESULT_ENCODING_TYPE,
                            Bitmap.CompressFormat.PNG.ordinal());
                } else if (Sketch.this.encodingType == EncodingType.JPEG) {
                    touchDrawIntent.putExtra(TouchDrawActivity.DRAWING_RESULT_ENCODING_TYPE,
                            Bitmap.CompressFormat.JPEG.ordinal());
                }

                Sketch.this.cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Sketch.this.cordova.startActivityForResult(Sketch.this, touchDrawIntent, SKETCH_REQUEST_CODE);
                    }
                });
            }
        });
    }

    private void doAnnotation() {
        this.cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                final Intent touchDrawIntent = new Intent(Sketch.this.cordova.getActivity(), TouchDrawActivity.class);

                if (Sketch.this.inputType == InputType.DATA_URL) {
                    touchDrawIntent.putExtra(TouchDrawActivity.BACKGROUND_IMAGE_TYPE,
                            TouchDrawActivity.BackgroundImageType.DATA_URL.ordinal());
                } else if (Sketch.this.inputType == InputType.FILE_URI) {
                    Uri inputUri = Uri.parse(inputData);

                    if (inputUri.getScheme().equals(ContentResolver.SCHEME_CONTENT)) {
                        // Workaround for CB-9548 (https://issues.apache.org/jira/browse/CB-9548)
                        //  The Cordova camera plugin can sometimes return a content URI instead of a file URI
                        //  when the image is selected from the photo gallery.
                        //
                        //  However, the TouchDrawActivity can only accept a file URI or a data URI for the
                        //  background image. So, we need to read the background image data and pass it in a
                        //  format which can be handled by the TouchDrawActivity.

                        InputStream inStream = null;
                        try {
                            // Write background image to a temporary file and pass it as a file URL because
                            // there is no reliable way to get a file path from a content URI
                            // (http://stackoverflow.com/a/19985374)
                            ContentResolver contentResolver = Sketch.this.cordova.getActivity().getContentResolver();
                            inStream = contentResolver.openInputStream(inputUri);

                            if (inStream != null) {
                                File file = new File(Sketch.this.cordova.getActivity().getCacheDir(), UUID.randomUUID().toString());
                                FileOutputStream outStream = new FileOutputStream(file);
                                byte[] data = new byte[1024];
                                int bytesRead;

                                while ((bytesRead = inStream.read(data, 0, data.length)) != -1) {
                                    outStream.write(data, 0, bytesRead);
                                }
                                outStream.flush();
                                outStream.close();

                                Sketch.this.inputData = "file://" + file.getAbsolutePath();
                                touchDrawIntent.putExtra(TouchDrawActivity.BACKGROUND_IMAGE_TYPE,
                                        TouchDrawActivity.BackgroundImageType.FILE_URL.ordinal());
                            }
                        } catch (IOException e) {
                            String message = "Failed to read image data from " + inputUri;
                            LOG.e(TAG, message);
                            e.printStackTrace();

                            Sketch.this.callbackContext.error(message + ": " + e.getLocalizedMessage());
                            return;
                        } finally {
                            if (inStream != null) {
                                try {
                                    inStream.close();
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            }
                        }

                    } else if (inputUri.getScheme().equals(ContentResolver.SCHEME_FILE)) {
                        touchDrawIntent.putExtra(TouchDrawActivity.BACKGROUND_IMAGE_TYPE,
                                TouchDrawActivity.BackgroundImageType.FILE_URL.ordinal());
                    }
                }

                if (Sketch.this.encodingType == EncodingType.PNG) {
                    touchDrawIntent.putExtra(TouchDrawActivity.DRAWING_RESULT_ENCODING_TYPE,
                            Bitmap.CompressFormat.PNG.ordinal());
                } else if (Sketch.this.encodingType == EncodingType.JPEG) {
                    touchDrawIntent.putExtra(TouchDrawActivity.DRAWING_RESULT_ENCODING_TYPE,
                            Bitmap.CompressFormat.JPEG.ordinal());
                }

                touchDrawIntent.putExtra(TouchDrawActivity.BACKGROUND_IMAGE_URL, inputData);
                Sketch.this.cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Sketch.this.cordova.startActivityForResult(Sketch.this, touchDrawIntent, ANNOTATION_REQUEST_CODE);
                    }
                });
            }
        });
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, final Intent intent) {
        if (resultCode == Activity.RESULT_CANCELED) {
            this.callbackContext.success("");
            return;
        }

        if (resultCode == Activity.RESULT_OK && this.cordova != null) {
            this.cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    saveDrawing(intent);
                }
            });
            return;
        }

        if (resultCode == TouchDrawActivity.RESULT_TOUCHDRAW_ERROR) {
            Bundle extras = intent.getExtras();
            String errorMessage = "Failed to generate sketch.";

            if (extras != null) {
                errorMessage += " " + extras.getString(TouchDrawActivity.DRAWING_RESULT_ERROR);
            }

            this.callbackContext.error(errorMessage);
        }
    }

    private void saveDrawing(Intent intent) {
        Bundle extras = intent.getExtras();
        byte[] drawingData = null;
        String output = null;

        if (extras != null &&
                extras.containsKey(TouchDrawActivity.DRAWING_RESULT_PARCELABLE)) {
            drawingData = extras.getByteArray(TouchDrawActivity.DRAWING_RESULT_PARCELABLE);
        }

        if (drawingData == null || drawingData.length == 0) {
            LOG.e(TAG, "Failed to read sketch result from activity");
            this.callbackContext.error("Failed to read sketch result from activity");
            return;
        }

        try {
            String ext = "";

            if (encodingType == EncodingType.JPEG) {
                ext = "jpeg";
            } else if (encodingType == EncodingType.PNG) {
                ext = "png";
            }

            if (destinationType == DestinationType.DATA_URL) {
                output = "data:image/" + ext + ";base64," + Base64.encodeToString(drawingData, Base64.DEFAULT);
            } else if (destinationType == DestinationType.FILE_URI) {
                String fileName = String.format("sketch-%s.%s", UUID.randomUUID(), ext);
                File filePath = new File(this.cordova.getActivity().getCacheDir(), fileName);
                FileOutputStream fos = new FileOutputStream(filePath);

                fos.write(drawingData);
                fos.close();
                output = "file://" + filePath.getAbsolutePath();

                LOG.d(TAG, "Drawing saved to: " + output);
            }
        } catch(Exception e) {
            LOG.e(TAG, "Error generating output from drawing: " + e.getMessage());

            this.callbackContext.error("Failed to generate output from drawing: "
                    + e.getMessage());
            return;
        }

        this.callbackContext.success(output);
    }

    enum DestinationType {
        DATA_URL,
        FILE_URI
    }

    enum EncodingType {
        JPEG,
        PNG
    }

    enum InputType {
        NO_INPUT,
        DATA_URL,
        FILE_URI
    }
}

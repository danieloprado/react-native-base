package br.com.icbsorocaba.app;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.microsoft.codepush.react.ReactInstanceHolder;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage; 

abstract class CodePushReactNativeHost extends ReactNativeHost implements ReactInstanceHolder {
  protected CodePushReactNativeHost(Application application) {
    super(application);
  }
}

public class MainApplication extends Application implements ReactApplication {
  private final CodePushReactNativeHost mReactNativeHost = new CodePushReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
          new ReactNativeOneSignalPackage(),
          new RNGoogleSigninPackage(),
          new RNDeviceInfo(),
          new FBSDKPackage(mCallbackManager),
          new SplashScreenReactPackage() 
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
    CodePush.setReactInstanceHolder(mReactNativeHost);
  }

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
}

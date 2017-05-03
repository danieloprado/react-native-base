Church React Native
===================

Workspace General
-----------------

```bash
npm install -g yarn react-native-cli
yarn
```

Workspace Android
-----------------

* Install ORACLE JAVA SDK
* Set JAVA_HOME enviroment:
```bash
# ~/.bashrc
export JAVA_HOME=$(update-alternatives --query javac | sed -n -e 's/Best: *\(.*\)\/bin\/javac/\1/p')
```

* Download Android Tools SDK Standalone
* Set ANDROID_HOME enviroment:
```bash
# ~/.bashrc
export ANDROID_HOME=/path/to/android/sdk
```

* Open Android Installer: `[sudo] $ANDROID_HOME/tools/android`
* Check and install:
  * Android SDK Tools
  * Android SDK Platform-Tools
  * Android SDK Build-Tools: **v25.0.2**, **v23.0.3** e **v23.0.1**
  * Android SDK (API 23)
    * SDK Platform 23
    * Google APIs 23
  * Android Support Repository
  * Google Play services
  * Google Repository

* Copy **./android/keystores/debug.keystore** to **$ANDROID_HOME**

Dev Android
-------------

```bash
yarn dev-android # Build apk and start the packager
yarn start # Just start packager

# If lost adb connection:
adb reverse tcp:8081 tcp:8081
```

Release Android
---------------

```bash
yarn release-android
# ICBSorocaba-signed.apk will be generated at the project folder
```
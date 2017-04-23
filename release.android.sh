(cd android && ./gradlew assembleRelease)
mv android/app/build/outputs/apk/app-release-unsigned.apk ICBSorocaba.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android/app/release.keystore ICBSorocaba.apk churchapp
$ANDROID_HOME/build-tools/25.0.2/zipalign -v 4 ICBSorocaba.apk ICBSorocaba-signed.apk

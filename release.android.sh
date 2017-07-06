VERSION=2.2.1
echo "version $VERSION"

rm ICBSorocaba.apk
rm ICBSorocaba-signed.apk
(cd android && ./gradlew assembleRelease)
mv android/app/build/outputs/apk/app-release.apk ICBSorocaba.apk

echo "Bundle source map"
react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.android.js \
  --bundle-output /tmp/icbsorocaba.bundle \
  --sourcemap-output /tmp/icbsorocaba.sourcemap

bugsnag-sourcemaps upload \
     --api-key 7f394ec621690879be85bc0bef530ac9 \
     --source-map /tmp/icbsorocaba.sourcemap \
     --app-version $VERSION \
     --strip-project-root \
     --minified-file /tmp/icbsorocaba.bundle \
     --minified-url main.jsbundle \
     --upload-sources

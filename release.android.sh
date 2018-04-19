VERSION=$(node -p "require('./package.json').version") 
echo "version $VERSION"

BUGSNAG_KEY = '%BUGSNAG_KEY%';

rm ReactApp.apk
(cd android && ./gradlew assembleRelease)
mv android/app/build/outputs/apk/app-release.apk ReactApp.apk

echo "Bundle source map ANDROID"
yarn react-native bundle -- \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output /tmp/fitfood.android.bundle \
  --sourcemap-output /tmp/fitfood.android.sourcemap

yarn bugsnag-sourcemaps upload -- \
     --api-key $BUGSNAG_KEY \
     --app-version $VERSION \
     --minified-file /tmp/fitfood.android.bundle \
     --source-map /tmp/fitfood.android.sourcemap \
     --minified-url index.android.bundle \
     --upload-sources \
     --overwrite

echo "Bundle source map IOS"
yarn react-native bundle -- \
  --platform ios \
  --dev false \
  --entry-file index.ios.js \
  --bundle-output /tmp/fitfood.ios.bundle \
  --sourcemap-output /tmp/fitfood.ios.sourcemap

yarn bugsnag-sourcemaps upload -- \
     --api-key $BUGSNAG_KEY \
     --app-version $VERSION \
     --minified-file /tmp/fitfood.ios.bundle \
     --source-map /tmp/fitfood.ios.sourcemap \
     --minified-url index.ios.bundle \
     --upload-sources \
     --overwrite
cp android/app/google-services.json ./backup/google-services.json
cp android/local.properties ./backup/local.properties

npx expo prebuild --clean

cp ./backup/google-services.json android/app/google-services.json
cp ./backup/local.properties android/local.properties

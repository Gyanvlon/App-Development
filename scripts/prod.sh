sh scripts/setup.sh
echo "Building application for deployment.."
ng build --prod --aot --output-hashing all --sourcemaps false --named-chunks false --build-optimizer --vendor-chunk

echo "Zipping application.."
cd dist && zip -r -D distribution-point.zip .
echo "Build success"
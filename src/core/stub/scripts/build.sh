#!/bin/sh


echo "********************************"
echo "***       Build start        ***"
echo "********************************"


cd "$(dirname "$0")/../../../.."


projectName="$(basename $PWD)"


echo "{\"version\":\""  "$(git rev-parse HEAD)"  "\", \"date\":\"" "$(date "+%Y.%m.%d-%H.%M.%S")" "\"}" > version.json

echo "********************************"
echo "***       Copy build        ***"
echo "********************************"
rm -Rf "./../build_tmp"
rsync -av  "./../${projectName}" "./../build_tmp" --exclude "build" --exclude "dist"  --exclude "node_modules"  --exclude "src/stub" --exclude "src/assets/sounds/*.mp3"  --exclude ".git" --exclude ".idea" --exclude ".gitignore"


echo "********************************"
echo "***   Creating zip file     ***"
echo "********************************"

mkdir "build"
cd ./../build_tmp/

filename="../${projectName}/build/${projectName}_"$(date "+%Y.%m.%d-%H.%M.%S")."zip"
zip -r $filename *

cd ..
rm -Rf build_tmp




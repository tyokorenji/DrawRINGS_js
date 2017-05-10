
#!/bin/bash

rm -r ./dist/*
touch ./dist/.gitkeep
cp -r ./bower_components/bootstrap/dist ./dist/bootstrap
cp -r ./bower_components/jquery-ui/themes/smoothness ./dist/jquery-ui
cp ./bower_components/jquery/dist/jquery.min.js ./dist/

cp ./index.html ./dist/
cp ./style.css ./dist/


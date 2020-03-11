#!/usr/bin/env bash

git submodule init
git submodule update

cd src/app/core/modules
#Update menu submodule
echo "Updating menu submodule.."
cd menu
git checkout master
git pull origin master
cd ..

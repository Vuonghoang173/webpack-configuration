#!/bin/sh
DEV_PACKAGES=`cat package.json | jq '.devDependencies' | jq  -r 'keys | .[]'`
npm i $DEV_PACKAGES -D
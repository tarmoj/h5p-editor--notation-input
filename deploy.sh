#!/bin/bash
npm run build
scp -P 38307 dist/*  v2404@uuu.ee:/home/v2404/public_html/tarmojohannes/drupal7/sites/default/files/h5p/development/H5PEditor.NotationInput/dist/
scp -P 38307 library.json  v2404@uuu.ee:/home/v2404/public_html/tarmojohannes/drupal7/sites/default/files/h5p/development/H5PEditor.NotationInput/
scp -P 38307 language/*  v2404@uuu.ee:/home/v2404/public_html/tarmojohannes/drupal7/sites/default/files/h5p/development/H5PEditor.NotationInput/language

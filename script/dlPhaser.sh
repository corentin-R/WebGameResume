#!/bin/bash

#download phaser "compilé" v2.2
wget https://github.com/photonstorm/phaser/releases/download/v2.2.2/phaser.min.js

#mv to lib dir
mv phaser.min.js ../src/lib/

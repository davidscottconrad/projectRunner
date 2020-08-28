#!/usr/bin/env node

const chokidar = require('chokidar');
const fs = require('fs');
const debounce = require('lodash.debounce');
const prog = require('caporal');
const {spawn} = require('child_process');

prog
    .version('1.0.0')
    .argument('[filename]', 'Name of a File to execute')
    .action(
        async ({filename}) => {

            const name = filename || 'index.js';

            try {
                await fs.promises.access(name);
            } catch (err){
                throw new Error('File Not Found: ' + name);
            }

            const start = debounce(() => {
                spawn('node', [name], {stdio: 'inherit'});
            }, 100);
            
            chokidar
                .watch('.')
                .on('add', start)
                .on('change', start)
                .on('unlink', start);
        });

prog.parse(process.argv);

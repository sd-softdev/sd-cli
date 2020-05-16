#!/usr/bin/env node
const commander = require('commander');
const program = new commander.Command();
const fs = require('fs');
const path = require('path');
const ansiEscapes = require('ansi-escapes');
const os = require('os');
const eol = require('os').EOL;

let featureSrc = '';
const srcRoot = 'src';
var lCnt = 0;
let feature = '';
const logPathFolder = path.join(os.homedir(), '.sd-nest-cli');
const logPath = path.join(logPathFolder, 'Log-SD-NEST-CLI' + Date.now() + '.log');

program.version('0.1.0');
program.option('-a, --add [featureName]', 'add new feature');
// program.option('-v, --verbose', 'get more output');

program.parse(process.argv);

if (!fs.existsSync(logPathFolder)) { fs.mkdirSync(logPathFolder, {recursive: true}) };

if (program.add) {
    feature = program.add;
    featureSrc = srcRoot;

    writeLog('Start to create new feature:' + feature);

    if (feature.includes('/')) {
        const splittedPath = feature.split('/');

        const folder = splittedPath.slice(0, splittedPath.length - 1);

        folder.forEach(p => {
            featureSrc = path.join(featureSrc, p);
        });

        feature = splittedPath[splittedPath.length - 1];
    }

    featureSrc = path.join(featureSrc, feature);

    writeLine('⏳\tStart to create new feature:' + feature);

    checkPreconditionForAdd();

    createNewFolder(featureSrc);
    createEntity(featureSrc, feature);
    createService(featureSrc, feature);
    createController(featureSrc, feature);
    createModule(featureSrc, feature);

    reWriteLine(lCnt, '✔️\tStart to create new feature:', feature);
}

writeLine('⚠\tLog file: ' + logPath);

function createNewFolder(folder) {
    writeLine('⏳\tCreate new folder \'' + folder + '\'');
    try {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder.toLowerCase(), { recursive: true })
            reWriteLine(1, '✔️\tCreate new folder \'' + folder + '\'');
        }
        reWriteLine(1, '❌\tCreate new folder \'' + folder + '\'');
        errorHandle({ message: 'Folder \'' + folder + '\' already exist!' })
    } catch (error) {
        reWriteLine(1, '❌\tCreate new folder \'' + folder + '\'');
    }
}

function createCore(folder, name, type) {
    let p = '';
    try {
        const src = path.join(__dirname, 'templates/' + type + '.tmplt');
        // const dst = './' + name.toLowerCase() + '/' + name.toLowerCase() + '.' + type + '.ts';
        const dst = path.join(folder, name.toLowerCase() + '.' + type + '.ts');
        p = path.join(process.cwd(), dst);
        writeLine('⏳\tCreate ' + type + ' in ' + p);

        const oldContent = fs.readFileSync(src, 'ascii');
        // upper case replace
        const upperReg = /(\[<Feature>\])/g;
        let tmp = oldContent.replace(upperReg, toCamelCase(name))

        //featureFileName
        const featureFileNameReg = /(\[<featureFileName>\])/g;
        tmp = tmp.replace(featureFileNameReg, name.toLowerCase());

        // lower case replace heavy_check_mark
        const lowerReg = /(\[<feature>\])/g;
        const newContent = tmp.replace(lowerReg, toCamelCase(name).toLowerCase());

        if (fs.existsSync(dst)) {
            reWriteLine(1, '❌\tCreate ' + type + ' in ' + p);
            errorHandle({ message: 'File \'' + dst + '\' already exist!' })
        } else {
            fs.writeFileSync(dst, newContent, 'ascii');
            reWriteLine(1, '✔️\tCreate ' + type + ' in ' + p);
        }

    } catch (error) {
        reWriteLine(1, '❌\tCreate ' + type + ' in ' + p);
    }


}

function createEntity(folder, name) {
    createCore(folder, name, 'entity')
}

function createService(folder, name) {
    createCore(folder, name, 'service')
}

function createController(folder, name) {
    createCore(folder, name, 'controller')
}

function createModule(folder, name) {
    createCore(folder, name, 'module')
}


function toCamelCase(str) {
    return str.split('-').map(subStr => subStr[0].toUpperCase() + subStr.slice(1).toLowerCase()).join('');
}

function errorHandle(error, abort) {
    if (error.message) {
        writeLog(error.message, 'Error');
    } else if (error.messages) {
        error.messages.forEach(message => writeLog(message));
    }


    if (program.verbose) {
        if (error.message) {
            writeLine('❌\tFollwoing error occured:\n\t-\t' + error.message);
        } else if (error.messages) {
            writeLine('❌\tFollwoing error occured:');
            error.messages.forEach(message => writeLine('\t-\t' + message));
        }
    }
}

function checkPreconditionForAdd() {
    // check if folder './src' exist
    writeLine('⏳\tCheck \'' + srcRoot + '\' folder!');
    if (!fs.existsSync(srcRoot)) {
        errorHandle({ message: 'No \'' + srcRoot + '\' folder found!' });
        reWriteLine(3, '❌\tCheck \'' + srcRoot + '\' folder!');
        reWriteLine(4, '❌\tStart to create new feature:' + feature);
        process.exit(1);
    } else {
        reWriteLine(1, '✔️\tCheck \'' + srcRoot + '\' folder!');
    }

    // check if 'app.module.ts' exist
    const mainModulePath = path.join(srcRoot, 'app.module.ts');
    writeLine('⏳\tCheck \'' + mainModulePath + '\'');
    if (!fs.existsSync(mainModulePath)) {
        errorHandle({ messages: ['No main module file "app.module.ts" found!', 'Please check it!'] });
        reWriteLine(4, '❌\tCheck \'' + mainModulePath + '\'');
        reWriteLine(6, '❌\tStart to create new feature:' + feature);
    } else {
        reWriteLine(1, '✔️\tCheck \'' + mainModulePath + '\'');
    }
}

function reWriteLine(count, content) {
    process.stdout.write(ansiEscapes.cursorSavePosition);
    process.stdout.write(ansiEscapes.cursorUp(count) + ansiEscapes.cursorLeft);
    process.stdout.write(ansiEscapes.eraseLine);
    process.stdout.write(content);
    process.stdout.write(ansiEscapes.cursorRestorePosition);
}

function writeLine(content) {
    lCnt++;
    console.log(content);
}

function writeLog(line, type) {
    if (!type) { type = 'Info' }
    const ds = new Date(Date.now());
    const prefix = '[ ' + ds.toLocaleString() + ' | ' + type + ' ]\t'
    if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, prefix + line);
    } else {
        fs.appendFileSync(logPath, eol + prefix + line);
    }
}
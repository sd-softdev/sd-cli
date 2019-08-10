const commander = require('commander');
const program = new commander.Command();
var fs = require('fs');

program.version('0.0.1');
program.option('-a, --add [featureName]', 'add new feature');

program.parse(process.argv);

console.log('Create new feature:', program.add);

if (program.add) {
    const feauture = program.add;
    createNewFolder(feauture);
    createEntity(feauture);
    createService(feauture);
    createController(feauture);
    createModule(feauture);
}



function createNewFolder(dirName) {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName)
    }
}

function createCore(name, type) {
    const src = './templates/' + type + '.tmplt';
    const dst = './' + name + '/' + name + '.' + type + '.ts';    
    const oldContent = fs.readFileSync(src, 'ascii');

    console.log('Create', type, 'in', dst);

    // upper case replace
    const upperReg = /(\[<Feature>\])/g;
    const tmp = oldContent.replace(upperReg, name)

    // lower case replace
    const lowerReg = /(\[<feature>\])/g;
    const newContent = tmp.replace(lowerReg, name.toLowerCase());

    fs.writeFileSync(dst, newContent, 'ascii');
}

function createEntity(name) {
    createCore(name, 'entity')
}

function createService(name) {
    createCore(name, 'service')
}

function createController(name) {
    createCore(name, 'controller')
}

function createModule(name) {
    createCore(name, 'module')
}
const ansiEscapes = require('ansi-escapes');

console.log('⏳ 1 Start to create new feature:');
console.log('⏳ 2 Start to create new feature:');
console.log('⏳ 3 Start to create new feature:');
console.log('⏳ 4 Start to create new feature:');
console.log('⏳ 5 Start to create new feature:');
console.log('⏳ 6 Start to create new feature:');

reWriteLine(5, 'ASdad', 'asd');

function reWriteLine(count, content) {
    process.stdout.write(ansiEscapes.cursorSavePosition);
    process.stdout.write(ansiEscapes.cursorUp(count) + ansiEscapes.cursorLeft);
    console.log(content);
    process.stdout.write(ansiEscapes.cursorRestorePosition);
}
const { exec } = require("child_process");
execCmd('npm pack');
execCmd('npm i -g .\\sd-nest-cli-0.1.0.tgz');

function execCmd(cmd) {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
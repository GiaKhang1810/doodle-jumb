const Child = require('child_process');

const options = {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
    env: process.env
}

function RunSystem(func) {
    if (typeof func === 'function') 
        func();
    var main = Child.spawn('electron', ['src/index.js'], options);
    main
        .on('close', code => {
            if (code === 2)
                setTimeout(RunSystem, 5000, console.clear);
        })
        .on('error', console.error);
}
RunSystem();
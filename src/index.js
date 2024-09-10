const electron = require('electron');
const path = require('path');

const App = electron.app;
const Browser = electron.BrowserWindow;

let main;

function createWindow() {
    main = new Browser({
        frame: true,
        fullscreen: true,
        title: 'Doodle Jumb',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        devTools: true
    });

    main.setMenuBarVisibility(null);
    main.loadFile(__dirname + '/index.html');
}

(async () => {
    await App.whenReady();
    if (!main)
        createWindow();
    App
        .on('activate', () => {
            if (Browser.getAllWindows().length === 0)
                createWindow();

            if (Browser.getAllWindows().length > 1)
                Browser.getAllWindows().forEach(win => {
                    if (win !== main)
                        win.close();
                });
        })
        .on('window-all-closed', () => {
            if (process.platform !== 'darwin')
                App.quit();
        });
})();

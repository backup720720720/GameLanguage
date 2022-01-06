const electron = require("electron");
const {app, BrowserWindow, globalShortcut} = electron;
/*** @type {{language: string, file: string, console: boolean, refresh: boolean}} */
const conf = require("./conf.json");
const NAME = "Gamey";
let screen;

require("request")("https://api.github.com/repos/backup720720720/GameLanguage/commits", {}, (err, res) => {
    if(err) return console.log("Update failed");
    // TODO: update, console.log(res.body);
});

const create_window = async () => {
    screen = new BrowserWindow({
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        webPreferences: {
            preload: __dirname + "/scripts/connect.js"
        }
    });
    screen.setMenu(null);
    screen.hide();
    screen.setTitle("Yükleniyor...");
    screen.setIcon("./assets/loading.png");
    await screen.loadFile("./" + conf.file + ".html");
    screen.load_now = async () => {
        if(conf["debug-compiler"]) await screen.webContents.executeJavaScript("debug_compiler = true;");
        await screen.webContents.executeJavaScript("NAME = \"" + NAME + "\";lang = \"" + conf.language + "\";window.load_start();");
    }
    await screen.load_now();
    screen.setTitle(NAME);
    screen.setIcon("./assets/favicon.png");
    screen.show();
    screen.setSize(500, 500);
    screen.maximize();
    screen.webContents.on("update-target-url", () => {
        screen.load_now();
    })
};

app.whenReady().then(async () => {
    globalShortcut.register("F5", () => {
    });
    globalShortcut.register("CommandOrControl+R", () => {
        if(conf.refresh) {
            screen.reload();
        }
    });
    globalShortcut.register("CommandOrControl+D", () => conf.console ? screen.webContents.openDevTools() : null);
    globalShortcut.unregister("F5");
    await create_window();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) create_window();
    });
});

app.on("window-all-closed", () => process.platform !== "darwin" ? app.quit() : null);
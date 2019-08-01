//toda aplicación necesita app, ventana, menu, socket
//ipcMain el proceso principal
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

//Electron reload - refrescar views
if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

let mainWindow
let newProductWindow

//Ventaja Principal
app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    //Que mostrar cuando cargue
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));
    //Arreglo de navegación nuevo menu
    const mainMenu = Menu.buildFromTemplate(templateMenu);
    //Integrar a la ventana principal
    Menu.setApplicationMenu(mainMenu);
    //Evento de cierre
    mainWindow.on('close', () => {
        //toda la aplicación
        app.quit();
    })
});

//ipcMain principal y on si recibo
ipcMain.on('product:new', (e, newProduct) => {
    //enviar al index.html = mainWindow.webContents
    mainWindow.webContents.send('product:new', newProduct);
    newProductWindow.close();
})


const templateMenu = [{
    label: 'File',
    submenu: [{
        label: 'New Product',
        accelerator: 'Ctrl+N',
        click() {
            createNewProductWindow()
        }
    }, {
        label: 'Remove All Products',
        click() {
            mainWindow.webContents.send('products:remove-all');
        }
    }, {
        //darwin es igual mac
        label: 'Exit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
            app.quit();
        }
    }]
}];

function createNewProductWindow() {
    //Declarar una nueva ventana
    newProductWindow = new BrowserWindow({
        width: 400,
        height: 330,
        title: 'Add a New Product'
    });
    //newProductWindow.setMenu(null);
    //Que mostrar cuando cargue
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true
    }));
    //la x cierra la ventana
    newProductWindow.on('close', () => {
        newProductWindow = null;
    });
}
//si estamos en mac aparecera una pestaña sino por default
if (process.platform === 'darwin') {
    templateMenu.unshift({
        label: app.getName()
    })
}
//si estamos en desarrollo veremos una pestaña de desarrollo
//desarrollo 1 = mostrar/ocultar consola navegador 2 = refrescar
if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'DevTools',
        submenu: [{
            label: 'Show/Hide Dev Tools',
            accelerator: 'Ctrl+D',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }, {
            role: 'reload'
        }]
    })
}
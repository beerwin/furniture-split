import { app, BrowserWindow, Menu, ipcMain, dialog, Dialog, IpcMainInvokeEvent } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
// import hu from './hu.ts'
// import en from './en.ts'

//const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

// function getLangPack(lang: string) {
//   switch (lang) {
//     default:
//     case 'en':
//       return en;
//       break;
//     case 'hu':
//       return hu;
//       break;
//   }
// }

function createMainMenu() {
  // const langPack = getLangPack(lang);
  // const menuTemplate: MenuItemConstructorOptions[] = [
  //   {
  //     id: 'file',
  //     label: 'File', 
  //     submenu: [
  //       {
  //         id: 'file.new',
  //         label: langPack['file.new'],
  //         accelerator: 'CmdOrCtrl+N',
  //         click: () => {
  //           win?.webContents.send('file.new', '');
  //         }
  //       },
  //       {
  //         id: 'file.open',
  //         label: langPack['file.open'],
  //         accelerator: 'CmdOrCtrl+O',
  //         click: () => {
  //           win?.webContents.send('file.open', '');
  //         }
  //       },
  //       {
  //         id: 'file.saveAs',
  //         label: langPack['file.saveAs'],
  //         accelerator: 'CmdOrCtrl+Shift+S',
  //         click: () => {
  //           win?.webContents.send('file.saveAs', '');
  //         }
  //       },
  //       { 
  //         id: 'file.quit',
  //         label: langPack['file.quit'], 
  //         accelerator: 'CmdOrCtrl+Q',
  //         role: 'quit' 
  //       }
  //     ]
  //   },
  //   // {
  //   //   label: 'View',
  //   //   submenu: [
  //   //     { role: 'reload' },
  //   //     { role: 'forceReload' },
  //   //     { role: 'toggleDevTools' },
  //   //   ]
  //   // },
  //   {
  //     id: 'language',
  //     label: langPack['language'],
  //     submenu: [
  //       {
  //         id: 'language.en',
  //         label: 'English', 
  //         type: 'radio',
  //         checked: lang === 'en',
  //         click: () => {
  //           win?.webContents.send('language.change', 'en');
  //           createMainMenu('en');
  //         }
  //       },
  //       {
  //         id: 'language.hu',
  //         label: 'Magyar', 
  //         type: 'radio',
  //         checked: lang === 'hu',
  //         click: () => {
  //           win?.webContents.send('language.change', 'hu' );
  //           createMainMenu('hu');
  //         }
  //       }
  //     ]
  //   }
  // ]  
  
  const menu = Menu.buildFromTemplate([])
  Menu.setApplicationMenu(menu)
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'app-icon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  win.on('close', (e) => {
    e.preventDefault()
    win?.webContents.send('app-close-query')
  })

  ipcMain.on('close-query', (e) => {
    e.preventDefault()
    win?.webContents.send('app-close-query')
  })

  ipcMain.on('app-close-confirmed', () => {
    win?.destroy()
    win = null;
  })

  ipcMain.handle('show-dialog', (_event: IpcMainInvokeEvent, method: keyof Dialog, params) => {
    return (dialog[method] as any)(params)
  })

  ipcMain.handle('load-file', async (_event, filename: string) => {
    return fs.promises.readFile(filename, { encoding: 'utf-8' });
  })

  ipcMain.handle('save-file', async (_event: IpcMainInvokeEvent, params) => {
    return fs.promises.writeFile(params.filename, params.content, { encoding: 'utf-8' });
  })

  createMainMenu();
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

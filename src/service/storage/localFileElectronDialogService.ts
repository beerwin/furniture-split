export async function doFileOpen(): Promise<string | undefined> {
  const result = await window.ipcRenderer?.openDialog('showOpenDialog', {
    title: 'Open a file',
    properties: ['openFile'],
    filters: [
      { name: 'Furniture Sheet Files', extensions: ['fsh'] },
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return;
  }

  const fc = await window.ipcRenderer?.readFile(result.filePaths[0]);
  return fc
}

export async function doFileSave(name: string, data: string) {
  const result = await window.ipcRenderer?.openDialog('showSaveDialog', {
    title: 'Save a file',
    defaultPath: name,
    filters: [
      { name: 'Furniture Sheet Files', extensions: ['fsh'] },
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
    
  if (result.canceled) {
    return;
  }

  await window.ipcRenderer?.saveFile(result.filePath, data);
}

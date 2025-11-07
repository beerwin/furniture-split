export async function doFileOpen(): Promise<string | undefined> {
  const result = await window.api?.openDialog('showOpenDialog', {
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

  const fc = await window.api?.readFile(result.filePaths[0]);
  return fc
}

export async function doFileSave(name: string, data: string) {
  const result = await window.api?.openDialog('showSaveDialog', {
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

  await window.api?.saveFile(result.filePath, data);
}

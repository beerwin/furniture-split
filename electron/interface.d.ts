export interface ApiInterface {
  openDialog: (method: 'showOpenDialog' | 'showSaveDialog', options: any) => Promise<any>;
  readFile: (filePath: string) => Promise<string>;
  saveFile: (filePath: string, data: string) => Promise<void>;
  send: (channel: string, ...args: any[]) => void;
  on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
  off: (channel: string, listener: (...args: any[]) => void) => void;
  invoke: (channel: string, ...args: any[]) => Promise<any>;
}

declare global {
  interface Window {
    api: ApiInterface
  }
}
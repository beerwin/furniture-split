import { doFileOpen, doFileSave } from '../../service/storage/localFileElectronDialogService'
import type { CutsFormContent } from '../../types/cuts/cutsFormContent'

export const saveAs = async (data: CutsFormContent) => {
  const s = JSON.stringify(data)
  await doFileSave(data.formName, s)
}

export const open = async (): Promise<CutsFormContent | undefined> => {
  const s = await doFileOpen()
  if (!s) { 
    return
  }
  return JSON.parse(s) as CutsFormContent
}

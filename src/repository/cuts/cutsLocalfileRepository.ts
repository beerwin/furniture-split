import { doFileOpen, doFileSave } from '../../service/storage/localFileService'
import type { CutsFormContent } from '../../types/cuts/cutsFormContent'

export const saveAs = async (data: CutsFormContent) => {
  const s = JSON.stringify(data)
  await doFileSave(data.formName, s)
}

export const open = async (): Promise<CutsFormContent> => {
  const s = await doFileOpen()
  return JSON.parse(s) as CutsFormContent
}

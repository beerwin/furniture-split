import { open, saveAs } from '../../repository/cuts/cutsLocalfileRepository'
import { useCalculatorForm } from '../../stores/calculatorForm'
import { ConfirmationModalState } from '../../types/dialogs/confirmationModalState'
import type { PromptModalInterface } from '../../types/dialogs/promptModalInterface'
import type { TriStateConfirmationInterface } from '../../types/dialogs/triStateconfirmationInterface'

export async function newForm(
  askForSaveAs: TriStateConfirmationInterface,
  promptForName: PromptModalInterface,
) {
  const formState = useCalculatorForm()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (formState.isDirty()) {
    const response: ConfirmationModalState = (await askForSaveAs?.open()) ?? 0
    if (response === ConfirmationModalState.Cancel) {
      return
    }

    if (response === ConfirmationModalState.Yes) {
      await fileSaveAs(promptForName)
    }
  }

  formState.reset()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  formState.setDirty(false)
}

export async function fileOpen(
  askForSaveAs: TriStateConfirmationInterface,
  promptForName: PromptModalInterface,
) {
  const formState = useCalculatorForm()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (formState.isDirty()) {
    const response: ConfirmationModalState = (await askForSaveAs?.open()) ?? 0
    if (response === ConfirmationModalState.Cancel) {
      return
    }

    if (response === ConfirmationModalState.Yes) {
      await fileSaveAs(promptForName)
    }
  }

  formState.fromFileContent(await open())
}

export async function fileSaveAs(promptForName: PromptModalInterface) {
  const formState = useCalculatorForm()
  const { formName } = formState
  if (!formName) {
    const fName = await promptForName?.open()

    if (fName === false) {
      return
    }

    formState.setFormName(fName ?? '')
  }
  await saveAs(formState.toFileContent())
}

import { nextTick } from 'vue'
import { open, saveAs } from '../../repository/cuts/cutsLocalfileRepository'
import { useCalculatorForm } from '../../stores/calculatorForm'
import { ConfirmationModalState } from '../../types/dialogs/confirmationModalState'
import type { PromptModalInterface } from '../../types/dialogs/promptModalInterface'
import type { TriStateConfirmationInterface } from '../../types/dialogs/triStateconfirmationInterface'
import { useResultStore } from '../../stores/resultStore'

export async function newForm(
  askForSaveAs: TriStateConfirmationInterface,
  promptForName: PromptModalInterface,
) {
  const formState = useCalculatorForm()
  const resultStore = useResultStore()
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
  nextTick(() => {
    formState.setDirty(false)
    resultStore.reset();
  })
}

export async function fileOpen(
  askForSaveAs: TriStateConfirmationInterface,
  promptForName: PromptModalInterface,
) {
  const formState = useCalculatorForm()
  const resultsStore = useResultStore()
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

  const s = await open()
  if (!s) {
    return
  }

  formState.fromFileContent(s)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  nextTick(() => {
    formState.setDirty(false)
    resultsStore.reset();
  })
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  nextTick(() => formState.setDirty(false)) 
}

export async function closeQuery(
  askForSaveAs: TriStateConfirmationInterface, 
  promptForName: PromptModalInterface
): Promise<void> {
  const formState = useCalculatorForm();

  if (!formState.isDirty()) {
    window.api?.send('app-close-confirmed');
    return;
  }
  const response = await askForSaveAs?.open();
  if (response === ConfirmationModalState.Cancel) {
    return;
  }

  if (response === ConfirmationModalState.Yes) {
    await fileSaveAs(promptForName as PromptModalInterface);
  }

  window.api?.send('app-close-confirmed');
}

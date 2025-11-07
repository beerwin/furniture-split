export async function doFileSave(name: string, data: string) {
  return new Promise((resolve) => {
    const a = document.createElement('a')
    a.setAttribute('download', name)
    a.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data))
    a.click()

    const focus = () => {
      window.removeEventListener('focus', focus)
      resolve(true)
    }
    window.addEventListener('focus', focus)
  })
}

export async function doFileOpen(): Promise<string> {
  return new Promise((resolve, reject) => {
    let s: string = ''
    const field = document.createElement('input')
    field.setAttribute('type', 'file')
    field.setAttribute('accept', 'application/json, *.json')
    field.click()
    field.addEventListener('change', async (e) => {
      if (!e.currentTarget) {
        throw new Error('Unexpected change event on file selection')
      }
      if (!(e.currentTarget instanceof HTMLInputElement)) {
        throw new Error('Invalid event source')
      }

      const file = e.currentTarget.files?.[0]
      if (!file) {
        return reject()
      }

      const stream = file?.stream()
      const reader = stream?.getReader()
      while (true) {
        const { done, value } = await reader.read()
        const part = new TextDecoder().decode(value)
        s = `${s}${part}`
        if (done) {
          break
        }
      }

      return resolve(s)
    })
  })
}

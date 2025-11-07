export const storeLanguage = (language: string): void => {
    window.localStorage.setItem('appLanguage', language);
}

export const retrieveLanguage = (): string => {
    return window.localStorage.getItem('appLanguage') || 'en';
}
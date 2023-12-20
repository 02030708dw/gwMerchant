const getStorage = (name: string): any => JSON.parse(localStorage.getItem(name) as any)
const setStorage = (name: string, data: any): void => localStorage.setItem(name, JSON.stringify(data))
const removeStorage = (name: string): void => localStorage.removeItem(name)
const clearStorage = (): void => localStorage.clear()
export {
    getStorage, setStorage, removeStorage, clearStorage
}

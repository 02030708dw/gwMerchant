export type propsModal={
    title:string,
    formItem:FormItem[]
    formConfig:Record<'labelPosition'|'size', string>&Record<'labelWidth', number>
}
export type propsSearchModal=Omit<propsModal, 'formConfig'>

export namespace DetailModal{
    export interface propModalDetail{
        type?:keyof typeof popupEnum
        title?:string,
        formItem?:FormItem[]
        formConfig?:Record<'labelPosition'|'size', string>&Record<'labelWidth', number>
    }
}
export enum popupEnum {
    form,table,custom
}

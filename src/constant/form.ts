export const formConfig = {
    labelWidth: 100,
    size: "default",
    labelPosition: "right",
};
export const selectOptions=[
    {
        label: "男",
        value: 0,
    },
    {
        label: "女",
        value: 1,
    },
]
export const formConfigF=(l:number=100,s:string='default',la:string='right')=>{
    return {
        labelWidth: l,
        size: s,
        labelPosition: la,
    }
}
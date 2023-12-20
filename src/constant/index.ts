const tablePropsRedundant=[{
    title: '创建人', prop: 'creator'},
    {
        title: '创建时间',
        prop: 'createdAt',
    },
    {
        title: '更新人',
        prop: 'updater',
    },
    {
        title: '更新时间',
        prop: 'updatedAt',
    },]
const standardReferStatus=(status:string,textArr=['未启用','启用'],colorArr=['danger','success'],skip=0)=>
{
    if (textArr.length!==colorArr.length) throw new Error('请确保textArr与colorArr长度相等')
    return {
        text:textArr[+status+skip],
        color:colorArr[+status+skip]
    }
}
const standardSelect=(arr=['停用','启用'],skip=0)=>arr.map((it,i)=>({label:it,value:i+skip}))
export {
    tablePropsRedundant,standardReferStatus,standardSelect
}
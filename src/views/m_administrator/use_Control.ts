import {ElMessage, ElMessageBox} from "element-plus";
import {nextTick, Ref} from "vue";
export function use_Control<T=FormItem>(updateRef:Ref,form:T[]){
    const onUpdateItem = (it:any) => {
        nextTick(()=>{
            // @ts-ignore
            form.forEach(its=>its.value=it[its.name])
        })
        updateRef.value?.open(()=>{
            console.log('update user')
        })
    }
    const onCheck = (it:any) => {

    }
    const onLog = (it:any) => {
        console.log(it)
    }
    const onResetPass = (it:any) => {
        ElMessageBox.confirm(
           `确定要重置${it.nickName}用户吗？`,
            "重置密码"
        )
            .then(() => {
                ElMessage.success(
                    "模拟成功, 参数为：" + JSON.stringify({ uid: it.id })
                );
            })
            .catch(console.log);
    }
    const onEnableItem=(item: any)=>{
        ElMessageBox.confirm(
            "确定要" + (item.status === 1 ? "禁用" : "启用") + "此用户吗？",
            "提示"
        )
            .then(() => {
                ElMessage.success(
                    "模拟成功, 参数为：" + JSON.stringify({ uid: item.id })
                );
            })
            .catch(console.log);
    }
    return {
        onUpdateItem,onCheck,onResetPass,onLog,onEnableItem
    }
}
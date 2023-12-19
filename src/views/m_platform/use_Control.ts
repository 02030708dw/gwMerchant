import {ElMessage, ElMessageBox} from "element-plus";
import {nextTick, Ref} from "vue";
import {useRouter} from "vue-router";
export function use_Control<T=FormItem>(updateRef:Ref,form:T[]){
    const router=useRouter()
    const onUpdateItem = (it:any) => {
        nextTick(()=>{
            // @ts-ignore
            form.forEach(its=>its.value=it[its.name])
        })
        updateRef.value?.open(()=>{
            console.log('update merchant')
        })
    }
    const onCheckPlat = (it:any) => {
        router.push({
            path:'/m_platform/listp',
            query:{it}
        })
    }
    const onCheckMer = (it:any) => {
        router.push({
            path:'/m_platform/listmer',
            query:{it}
        })
    }
    const onLog = (it:any) => {
        console.log(it)
    }
    const onPlaySet = (it:any) => {

    }
    const onEnableItem=(item: any)=>{
        ElMessageBox.confirm(
            "确定要" + (item.status === 1 ? "暂停" : "") + "运营",
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
        onUpdateItem,onCheckPlat,onCheckMer,onPlaySet,onLog,onEnableItem
    }
}
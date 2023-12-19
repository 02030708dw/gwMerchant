import {computed, Ref, ref, toRaw} from "vue";
import {post} from "@/api/http";
import {ElMessage, ElMessageBox} from "element-plus";

export function useMulSelector<T = any>(url: string,doRefresh:()=>void) {
    const mulSector = ref<T[]>([]) as Ref<T[]>
    const handleSelectionChange = (val: T[]) => mulSector.value = val
    const delStatus = computed<boolean>(() => !mulSector.value.length)
    const del = (key: string = 'id') => {
        ElMessageBox.confirm('确定删除当前信息?')
            .then(() => {
                ElMessage.warning(JSON.stringify(mulSector.value.map((it: any) => it[key])))
                /*post({
                    url,
                    data: mulSector.value.map((it: any) => it[key])
                }).then(v => {ElMessage.success(v.msg);doRefresh()}).catch(r => ElMessage.error(r.msg))*/
            })
            .catch(() => {
                // catch error
            })
    }
    return {
        mulSector, delStatus,
        handleSelectionChange, del
    }
}
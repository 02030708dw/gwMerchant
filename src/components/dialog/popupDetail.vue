<script setup lang="ts">
import {useDataTable, useLikeSearch} from "@/hooks";
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import {DetailModal, popupEnum} from './popupProps'
import {DialogType} from "@/components/types";
import {formConfig} from "@/constant/form";
const {getSearchParams,likeSearchModel} = useLikeSearch();
const props=withDefaults(defineProps<{
  type?:keyof typeof popupEnum
  title?:string,
  formItem?:FormItem[],
  dataList?:any[]
  formConfig?:Record<'labelPosition'|'size', string>&Record<'labelWidth', number>
}>(),{
  type:'custom',
  title:'标题',
  formConfig:()=>formConfig
})
const emit=defineEmits<{
  (e:'onSearch'):void
  (e:'onConfirm',data:number[]):void
}>()
likeSearchModel.conditionItems = reactive(props.formItem!);
const {
  tableConfig,
  tableLoading,
  useHeight,
  offTableCollapseTransition,
} = useDataTable();
const dialog = ref<DialogType>();
const open = () => dialog.value?.show(()=>emit('onConfirm',getSearchParams()));
const close = () => dialog.value?.close()
defineExpose({
  open,close
})
onMounted(() => {
  useHeight();
});
onBeforeMount(offTableCollapseTransition);
</script>

<template>
  <Dialog
      ref="dialog"
      :title="title"
      :closeOnClickModal="true"
  >
    <template #content>
      <BaseForm
          v-if="type==='form'"
          class="padding-left padding-right"
          ref="baseForm"
          :form-items="likeSearchModel.conditionItems"
          :config="props.formConfig"
      >
        <template #prefix>
          <slot name="formExtra"/>
        </template>
      </BaseForm>
      <el-table
          v-if="type==='table'"
          :data="dataList"
          style="width: 100%"
          :stripe="tableConfig.stripe"
          :border="tableConfig.border"
          :height="tableConfig.height"
      >
        <slot name="tableInner"></slot>
      </el-table>
      <slot name="custom"></slot>
    </template>
  </Dialog>
</template>

<style scoped lang="less">
/*.el-form:deep(.el-form-item__content){
  margin-left: 10px !important;
}*/
</style>
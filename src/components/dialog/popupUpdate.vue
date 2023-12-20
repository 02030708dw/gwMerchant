<script setup lang="ts">
import {useLikeSearch} from "@/hooks";
import {reactive,ref} from "vue";
import {DialogType} from "@/components/types";
import {propsSearchModal} from "./popupProps";
const {getSearchParams,likeSearchModel} = useLikeSearch();
const props=withDefaults(defineProps<propsSearchModal>(),{
  title:'标题',
  formConfig:()=>({
    labelWidth: 100,
    size: "default",
    labelPosition: "right",
  })
})
const emit=defineEmits<{
  (e:'onSearch'):void
  (e:'onConfirm',data:number[]):void
}>()
likeSearchModel.conditionItems = reactive(props.formItem);
const multipleSelector=ref<number[]>([])
const dialog = ref<DialogType>();
const open = () => dialog.value?.show(()=>emit('onConfirm',multipleSelector.value));
const close = () => dialog.value?.close()
const onSearch=()=>emit('onSearch')
defineExpose({
  open,close
})
</script>

<template>
  <Dialog
      ref="dialog"
      :title="title"
      :closeOnClickModal="true"
  >
    <template #content>
      <BaseForm
          class="padding-left padding-right"
          ref="baseForm"
          :form-items="likeSearchModel.conditionItems"
          :config="props.formConfig"
      >
        <template #prefix>
          <slot name="formExtra"/>
        </template>
      </BaseForm>
    </template>
  </Dialog>
</template>

<style scoped lang="less">
/*.el-form:deep(.el-form-item__content){
  margin-left: 10px !important;
}*/
</style>
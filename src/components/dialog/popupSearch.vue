<script setup lang="ts">
import {useLikeSearch} from "@/hooks";
import {reactive,ref} from "vue";
import type {propsModal, propsSearchModal} from './popupProps'
import {DialogType} from "@/components/types";
const {getSearchParams,likeSearchModel} = useLikeSearch();
const props=defineProps<Omit<propsModal, 'formConfig'>>()
const emit=defineEmits<{
  (e:'onSearch'):void
  (e:'onConfirm',data:number[]):void
}>()
likeSearchModel.conditionItems = reactive(props.formItem);
const multipleSelector=ref<number[]>([])
const dialog = ref<DialogType>();
const formConfig = {
  labelWidth: 10,
  size: "default",
  labelPosition: "right",
};
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
      <BaseForm2
          class="padding-left padding-right"
          ref="baseForm"
          :form-items="likeSearchModel.conditionItems"
          :config="formConfig"
      >
        <template #prefix>
          <slot name="formExtra"/>
        </template>
        <template #extraInner>
          <el-col :offset="1" :span="6"><el-button @click="onSearch" type="success">筛选</el-button></el-col>
        </template>
      </BaseForm2>
      <slot name="content"></slot>
    </template>
  </Dialog>
</template>

<style scoped lang="less">
.el-form:deep(.el-form-item__content){
  margin-left: 10px !important;
}
</style>
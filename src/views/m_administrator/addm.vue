<script setup lang="ts">
import {formConfigF, selectOptions} from "@/constant/form";
import {useLikeSearch} from "@/hooks";
import {nextTick, reactive, ref} from "vue";
defineOptions({
  name:'addm'
})
const {getSearchParams, likeSearchModel} = useLikeSearch();
const baseForm = ref();
likeSearchModel.conditionItems = reactive([
  {
    label: "账号：",
    type: "input",
    name: "s1",
    value: "",
    maxLength: 50,
    inputType: "text",
    onChange: (value:string, assName = "") => {
      nextTick(() => {
          likeSearchModel.conditionItems.forEach((it:Record<string, string>) => {
            if (it.name==='s2') it.value=value.length?value+'123456':value
          })
      });
    },
  },
  {
    label: "预设密码：",
    type: "input",
    name: "s2",
    value: "",
    maxLength: 50,
    inputType: "text",
    disabled: true,
  },
  {
    label: "管理员名称：",
    type: "input",
    name: "s3",
    value: "",
    maxLength: 50,
    inputType: "text",
  },
  {
    label: "语言：",
    type: "radio-group",
    name: "s4",
    associatedOption: "address",
    value: 0,
    radioOptions: [
      {
        label: "中文",
        value: 0,
      },
      {
        label: "英文",
        value: 1,
      },
    ],
  },
  {
    label: "组别：",
    type: "select",
    name: "s5",
    value: "",
    selectOptions,
  },
  {
    label: "状态：",
    type: "select",
    name: "s6",
    value: "",
    selectOptions,
  },
]);
const onSubmit = () => {
  console.log(getSearchParams())
}
</script>

<template>
<el-card>
  <h3>新增管理员</h3>
  <BaseForm
      ref="baseForm"
      :form-items="likeSearchModel.conditionItems as FormItem[]"
      :config="formConfigF()"
  />
  <div class="flex justify-center">
    <el-button @click="onSubmit" type="success">提交</el-button>
  </div>
</el-card>
</template>

<style scoped lang="less">

</style>
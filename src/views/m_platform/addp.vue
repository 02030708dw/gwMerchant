<script setup lang="ts">
import {formConfigF, selectOptions} from "@/constant/form";
import {useLikeSearch, useLikeSearchSub} from "@/hooks";
import {nextTick, reactive, ref} from "vue";
import {useRouter} from "vue-router";
const router=useRouter()
defineOptions({
  name:'addp'
})
const {getSearchParams, likeSearchModel} = useLikeSearch();
const SearchSub = useLikeSearchSub();
SearchSub.likeSearchModel.conditionItems=reactive([
  {
    label: "第三方状态：",
    type: "radio-group",
    name: "s7",
    associatedOption: "address",
    value: 0,
    radioOptions: [
      {
        label: "正式",
        value: 0,
      },
      {
        label: "测试",
        value: 1,
      },
      {
        label: "展示",
        value: 2,
      },
      {
        label: "预建厅",
        value: 3,
      },
      {
        label: "销售推广厅",
        value: 4,
      },
    ],
  },
  {
    label: "投注形态：",
    type: "select",
    name: "s8",
    value: "",
    selectOptions,
  },
  {
    label: "登入形态：",
    type: "select",
    name: "s9",
    value: "",
    selectOptions,
  },
  {
    label: "派奖形态：",
    type: "select",
    name: "s10",
    value: "",
    selectOptions,
  },
  {
    label: "钱包形态：",
    type: "select",
    name: "s11",
    value: "",
    selectOptions,
  },
  {
    label: "参数讯息：",
    type: "input",
    name: "s12",
    value: "",
    inputType: 'textarea',
    rows: 2
  },
  {
    label: "彩种盈亏警报设定：",
    type: "radio-group",
    name: "s13",
    associatedOption: "address",
    value: 0,
    radioOptions: [
      {
        label: "开启",
        value: 0,
      },
      {
        label: "关闭",
        value: 1,
      },
    ],
  },
  {
    label: "彩种盈亏亏损值：",
    type: "input",
    name: "s14",
    value: "",
  },
])
const baseForm = ref();
const baseFormSub = ref();
likeSearchModel.conditionItems = reactive([
  {
    label: "类型：",
    type: "select",
    name: "s0",
    value: "",
    selectOptions,
  },
  {
    label: "平台商名称：",
    type: "input",
    name: "s1",
    value: "",
    maxLength: 50,
    inputType: "text",
  },
  {
    label: "合法注册国家：",
    type: "select",
    name: "s2",
    value: "",
    selectOptions,
  },
  {
    label: "合同日起：",
    type: "date",
    name: "s3",
    value: "",
  },
  {
    label: "上线日期：",
    type: "date",
    name: "s4",
    value: "",
  },
  {
    label: "客服地点与位置：",
    type: "input",
    name: "s5",
    value: "",
  },
  {
    label: "备注：",
    type: "input",
    inputType: 'textarea',
    name: "s6",
    value: "",
    rows:2
  },
]);
const onSubmit = () => {
  console.log(Object.assign(getSearchParams(),SearchSub.getSearchParams()))
}
const onList = () => {
  router.push('/m_platform/listp')
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between align-center">
        <h2>资料设定</h2>
        <el-button @click="onList" type="info" plain>平台商列表</el-button>
      </div>
    </template>
    <h3>基本资料</h3>
    <el-divider />
    <BaseForm
        ref="baseForm"
        :form-items="likeSearchModel.conditionItems as FormItem[]"
        :config="formConfigF(150)"
    />
    <h3>设定资料</h3>
    <el-divider />
    <BaseForm
        ref="baseForm"
        :form-items="SearchSub.likeSearchModel.conditionItems as FormItem[]"
        :config="formConfigF(150)"
    />
    <div class="flex justify-center">
      <el-button @click="onSubmit" type="success">提交</el-button>
    </div>
  </el-card>
</template>

<style scoped lang="less">
.el-card{
  &:deep(.el-card__header){
    padding: 5px 20px;
  }
  &:deep(.el-card__body){
    padding: 5px 10px;
  }
}
</style>
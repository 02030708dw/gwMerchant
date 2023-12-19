<template>
  <div class="main-container">
    <el-card
        :body-style="{padding: '0'}"
        class="margin-top-xs"
    >
      <template #header>
        <div class="flex align-center">
          <h3 :underline="false">公告内容</h3>
          <div class="flex-sub"></div>
          <el-button
              type="primary"
              @click="onPublish"
          >发布</el-button>
        </div>
      </template>
      <div class="form-wrapper padding-top">
        <BaseForm
            ref="baseForm"
            :form-items="likeSearchModel.conditionItems"
            :config="formConfig"
        >
          <template #extra>
            <el-form-item
                label="内容："
            >
                      <RichTextEditor
                          ref="richTextEditor"
                          :height="200"
                          style="width: 100%"
                      />
            </el-form-item>
            <el-form-item
                label="发布对象："
            >
              <el-button @click="openPublish">设定</el-button>
            </el-form-item>
          </template>
        </BaseForm>
      </div>
    </el-card>
    <popup-search ref="popSearchRef" title="发布对象" :form-item="searchItems"
                  @on-confirm="onSelect"
                  @on-search="() => {
      console.log(111)
    }">
      <template #content>
        <div class="selectTable">
          table
        </div>
      </template>
    </popup-search>
  </div>
</template>

<script setup lang="ts">
import RichTextEditor from "@/components/common/RichTextEditor.vue";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {useLikeSearch} from "@/hooks";
import PopupSearch from "@/components/dialog/popupSearch.vue";
const richTextEditor = ref<typeof RichTextEditor>();
const {getSearchParams,likeSearchModel} = useLikeSearch();
const baseForm = ref();
likeSearchModel.conditionItems = reactive([
  {
    label: "标题：",
    type: "input",
    name: "name",
    value: "",
    maxLength: 50,
    inputType: "text",
    placeholder: "请输入会议名称",
    validator: ({ value = "", placeholder = "" }) => {
      if (!value) {
        ElMessage.error(placeholder);
        return false;
      }
      return true;
    },
  },
  {
    label: "发布语言：",
    type: "radio-group",
    name: "meetType",
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
    onChange: (value = 0, assName = "") => {
      // const assObj = this.formItems.find(
      //   (it: any) => it.name === assName,
      // );
      // this.$set(assObj, "hidden", value === 1);
    },
  },
  {
    label: "上架时间：",
    type: "date",
    name: "date",
    placeholder: "请选择上架时间",
    value: "",
    validator: ({ value = "", placeholder = "" }) => {
      if (!value) {
        ElMessage.error(placeholder);
        return false;
      }
      return true;
    },
  },
]);
const formConfig = {
  labelWidth: 100,
  size: "default",
  labelPosition: "right",
};
const popSearchRef=ref<InstanceType<typeof PopupSearch>|null>(null)
function onPublish() {
  if (baseForm.value?.checkParams()) {
    console.log(getSearchParams())
    console.log(richTextEditor.value?.getHtmlContent(),richTextEditor.value?.getJsonContent())
  }
  // console.log(richTextEditor.value?.getHtmlContent(),richTextEditor.value?.getJsonContent())
}
const selectOptions=[
  {
    label: "男",
    value: 0,
  },
  {
    label: "女",
    value: 1,
  },
]
const searchItems=[...Array.from(Array(6),(e,i)=>({
  name: "s"+i,
  value: "",
  type: "select",
  selectOptions,
  span: 6,
})),] as FormItem[]
const onSelect = () => {
  popSearchRef.value?.close()
}
const openPublish = () => {
  console.log(popSearchRef.value)
  popSearchRef.value?.open()
}
</script>

<style scoped lang="less">
.selectTable{
  padding: 5px 10px;
}
</style>
<template>
  <div class="main-container">
    <TableBody>
      <template #header>
        <TableHeader
            :can-collapsed="
            likeSearchModel.conditionItems &&
            likeSearchModel.conditionItems.length !== 0
          "
            :search-model="likeSearchModel.conditionItems"
            :default-collapsed-state="true"
            title="游戏玩法列表"
            @doSearch="doSearch"
            @resetSearch="resetSearch as any"
        />
      </template>
      <template #tableConfig>
        <TableConfig
            v-model:border="tableConfig.border"
            v-model:stripe="tableConfig.stripe"
            v-model:tableColumns="tableProps"
            @refresh="doRefresh"
        >
          <!--          <template #actions>
                      <el-button type="success" size="small" icon="PlusIcon"
                      >添加管理员
                      </el-button>
                      <el-button type="danger" size="small" icon="DeleteIcon" @click="onDelete" :disabled="delStatus"
                      >删除
                      </el-button>
                    </template>-->
        </TableConfig>
      </template>
      <template #default>
        <el-table
            v-loading="tableLoading"
            :data="dataList"
            :header-cell-style="tableConfig.headerCellStyle"
            :size="tableConfig.size"
            :stripe="tableConfig.stripe"
            :border="tableConfig.border"
            :height="tableConfig.height"
            @selection-change="handleSelectionChange"
        >
          <!--          <el-table-column type="selection" width="45" />-->
          <!--          <el-table-column align="center" label="Id" width="120">
                      <template v-slot="scope">
                        {{ scope.row.id }}
                      </template>
                    </el-table-column>-->
          <el-table-column align="center"
                           v-for="t in tableProps"
                           :key="t.prop"
                           :label="t.title"
                           :prop="t.prop"
          >
            <template v-slot="scope">
              <div>
                {{scope.row[t.prop]===null?'-':scope.row[t.prop]}}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template v-slot="scope">
              <el-tag
                  :type="standardReferStatus(scope.row.status).color"
              >
                {{standardReferStatus(scope.row.status).text}}
              </el-tag>
            </template>
          </el-table-column>
          <!--          <el-table-column
                        align="center"
                        label="操作"
                        fixed="right"
                        width="340"
                    >
                      <template #default="scope">
                        <el-button
                            type="warning"
                            size="small"
                            plain
                            @click="onUpdateItem(scope.row)"
                        >修改</el-button>
                        <el-button
                            type="danger"
                            size="small"
                            plain
                            @click="onLog(scope.row)"
                        >日志</el-button>
                        <el-button
                            type="info"
                            size="small"
                            plain
                            @click="onResetPass(scope.row)"
                        >重置密码</el-button>
                        <el-button
                            :type="scope.row.status === 1 ? 'warning' : 'success'"
                            size="small"
                            plain
                            @click="onEnableItem(scope.row)"
                        >{{ scope.row.status === 1 ? "禁用" : "启用" }}</el-button
                        >
                      </template>
                    </el-table-column>-->
        </el-table>
      </template>
      <!--      <template #footer>
              <TableFooter
                  ref="tableFooter"
                  @refresh="doRefresh"
                  @pageChanged="doRefresh"
              />
            </template>-->
    </TableBody>
    <popup-update title="修改管理员信息" ref="updateRef" :form-item="updateForms"/>
  </div>
</template>

<script lang="ts" setup>
import {getGameList, getGamePlayList, getMerchantAdminList} from "@/api/url";
import { useDataTable, useLikeSearch, usePost } from "@/hooks";
import {computed, nextTick, onBeforeMount, onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import type { TableFooter } from "@/components/types";
import {useMulSelector} from "@/hooks/table/useMulSelector";
import {use_Control} from "@/hooks/custom/useControl";
import PopupUpdate from "@/components/dialog/popupUpdate.vue";
import useTableProps from "@/hooks/custom/useTableProps";
import {standardReferStatus, standardSelect, tablePropsRedundant} from "@/constant";
import useListStore from "@/store/modules/list";
const updateRef=ref<InstanceType<typeof PopupUpdate>|null>(null)
const tableFooter = ref<TableFooter>();
const list=useListStore()
const { likeSearchModel, getSearchParams} = useLikeSearch();
const {
  handleSuccess,
  dataList,
  tableConfig,
  tableLoading,
  useHeight,
  offTableCollapseTransition,
} = useDataTable();
const post = usePost();
onBeforeMount(()=>{
  list.addGameList()
})
likeSearchModel.extraParams = () => ({
  ...tableFooter.value?.withPageInfoData(),
});
likeSearchModel.conditionItems = reactive([
  {
    name: "gameId",
    label: "游戏Id",
    value: list.gameList&&list.gameList[0].gameId,
    type: "select",
    placeholder: "请选择游戏Id",
    span: 8,
    selectOptions: computed(()=>list.gameList).value,
    selectConfig:{
      labelField:'gameName',
      valueField:'gameId'
    }
  },
  {
    name: "status",
    value: 1,
    label: "状态",
    type: "select",
    clearable:false,
    selectOptions:standardSelect(),
    span: 8,
  },
  /*  {
      name: "s3",
      label: "创建人",
      value: "",
      type: "input",
      placeholder: "请输入用户姓名",
      span: 8,
    },*/
]);
// search params
const doSearch = () => {
  // const params = getSearchParams();
  // console.log(params)
  tableLoading.value=true
  doRefresh()
};
const resetSearch = () => {
  likeSearchModel.conditionItems && likeSearchModel.conditionItems.forEach((it:any)=>{
    it.value=''
    if (it.name==='status') it.value=1
  })
}
// table props
const {tableProps}=useTableProps([
      {prop: "gameId", title: "游戏ID"},
      {prop: "gameName", title: "游戏名称"},
      {prop: "gamePlayId", title: "游戏玩法ID"},
      {prop: "gamePlayName", title: "游戏玩法名称"},
      {prop: "gamePlayTypeId", title: "游戏玩法类型ID"},
      {prop: "gamePlayTypeName", title: "游戏类型名称"},
    ]
)
// table refresh
function doRefresh() {
  post({
    url: getGamePlayList,
    data: {
      // ...tableFooter.value?.withPageInfoData(),
      ...getSearchParams(),
    },
  })
      .then((r:any)=>{
        handleSuccess({data:r.resultSet})
        // tableFooter.value?.setTotalSize(r.resultSet.length);
      })
      .catch((rr)=>{
        ElMessage.error(rr.message)
      });
}
// multiple checkbox onChange Event
const {delStatus,del,handleSelectionChange}=useMulSelector <typeof dataList>('111',doRefresh)
// update form
const updateForms=[
  {
    label: "账号：",
    type: "input",
    name: "creator",
    value: "",
    maxLength: 50,
    inputType: "text",
    disabled:true
  },
  {
    label: "管理员名称：",
    type: "input",
    name: "nickName",
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
    name: "roleName",
    value: "",
    selectOptions:standardSelect(),
  },
] as FormItem[]
// control event
const {onCheck,onUpdateItem,onLog,onResetPass,onEnableItem}=use_Control<FormItem>(updateRef,updateForms)
const onDelete = () => {
  del('id')
}
onMounted(() => {
  doRefresh();
  useHeight();
});
onBeforeMount(offTableCollapseTransition);
</script>

<style lang="scss" scoped>

</style>

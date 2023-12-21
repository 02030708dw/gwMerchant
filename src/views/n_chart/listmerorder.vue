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
            title="会员订单列表"
            @doSearch="doSearch"
            @resetSearch="resetSearch as any"
        />
      </template>
      <template #tableConfig>
        <TableConfig
            v-model:border="tableConfig.border"
            v-model:stripe="tableConfig.stripe"
            v-model:tableColumns="tableProps"
            :tool="true"
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
          <el-table-column align="center" label="Id" width="120">
            <template v-slot="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
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
          <el-table-column fixed='right' align="center" label="状态" width="80">
            <template v-slot="scope">
              <el-tag
                  :type="standardReferStatus(scope.row.status,
                  ['待开奖','中奖','未中奖','用户撤单','后台撤单'],
                  ['info','success','info','info','info']).color"
              >
                {{standardReferStatus(scope.row.status,
                  ['待开奖','中奖','未中奖','用户撤单','后台撤单'],
                  ['info','success','info','info','info']
              ).text}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed='right' align="center" label="类型" width="80">
            <template v-slot="scope">
              <el-tag
                  :type="standardReferStatus(scope.row.type,
                  ['彩票','体育直播竞猜','彩票直播竞猜'],['info','warning','default'],-1).color"
              >
                {{standardReferStatus(scope.row.type,['彩票','体育直播竞猜','彩票直播竞猜'],['info','warning','default'],-1).text}}
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
      <template #footer>
        <TableFooter
            ref="tableFooter"
            @refresh="doRefresh"
            @pageChanged="doRefresh"
        />
      </template>
    </TableBody>
    <popup-update title="修改管理员信息" ref="updateRef" :form-item="updateForms"/>
  </div>
</template>

<script lang="ts" setup>
import {getMemberList, getMerchantAdminList} from "@/api/url";
import { useDataTable, useLikeSearch, usePost } from "@/hooks";
import {nextTick, onBeforeMount, onMounted, reactive, ref} from "vue";
import { ElMessageBox } from "element-plus";
import type { TableFooter } from "@/components/types";
import {useMulSelector} from "@/hooks/table/useMulSelector";
import {use_Control} from "@/hooks/custom/useControl";
import PopupUpdate from "@/components/dialog/popupUpdate.vue";
import useTableProps from "@/hooks/custom/useTableProps";
import {standardReferStatus, standardSelect, tablePropsRedundant} from "@/constant";
import useListStore from "@/store/modules/list";
const updateRef=ref<InstanceType<typeof PopupUpdate>|null>(null)
const tableFooter = ref<TableFooter>();
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
const list=useListStore()
likeSearchModel.extraParams = () => ({
  ...tableFooter.value?.withPageInfoData(),
});
likeSearchModel.conditionItems = reactive([
  {
    name: "orderNum",
    label: "订单号",
    value: "",
    type: "input",
    placeholder: "请输入订单号",
    span: 8,
  },
  {
    name: "gameId",
    value: '',
    label: "游戏ID",
    type: "select",
    clearable:false,
    selectOptions:list.gameList,
    selectConfig:{
      labelField:'gameName',
      valueField:'gameId'
    },
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
  tableFooter.value?.resetCurrentPage()
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
    {prop: "merchantId", title: "商户ID"},
    {prop: "gameId", title: "游戏ID"},
    {prop: "gameName", title: "游戏名称"},
    {prop: "memberId", title: "会员ID"},
    {prop: "memberName", title: "会员名称"},
    {prop: "orderNo", title: "订单号"},
    {prop: "winAmount", title: "中奖金额"},
    {prop: "betAmount", title: "投注金额"},
    {prop: "createdAt", title: "创建时间"},
    ]
)
// table refresh
function doRefresh() {
  post({
    url: getMemberList,
    data: {
      ...tableFooter.value?.withPageInfoData(),
      ...getSearchParams(),
    },
  })
      .then((r:any)=>{
        handleSuccess({data:r.resultSet.data})
        tableFooter.value?.setTotalSize(r.resultSet.total);
      })
      .catch(console.log);
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
.avatar-container {
  position: relative;
  width: 30px;
  height: 30px;
  margin: 0 auto;
  vertical-align: middle;
  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .avatar-vip {
    border: 2px solid #cece1e;
  }
  .vip {
    position: absolute;
    top: 0;
    right: -9px;
    width: 15px;
    transform: rotate(60deg);
  }
}
.gender-container {
  .gender-icon {
    width: 20px;
  }
}
</style>

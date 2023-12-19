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
            title="管理员日志"
            @doSearch="doSearch"
            @resetSearch="resetSearch as any"
            :col-template="4"
        />
      </template>
      <template #tableConfig>
        <TableConfig
            v-model:border="tableConfig.border"
            v-model:stripe="tableConfig.stripe"
            @refresh="doRefresh"
        >
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
        >
          <el-table-column align="center" label="序号" width="80">
            <template v-slot="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="昵称" prop="nickName" />
          <el-table-column align="center" label="创建者" prop="creator" />
          <el-table-column align="center" label="部门" prop="departmentName" />
          <el-table-column align="center" label="性别" prop="gender">
            <template v-slot="scope">
              <div class="gender-container flex justify-center align-center">
                <img
                    class="gender-icon"
                    :src="
                    scope.row.gender === 0
                      ? require('@/assets/icon_sex_man.png')
                      : require('@/assets/icon_sex_woman.png')
                  "
                />
                <span>{{ scope.row.gender === 0 ? "男" : "女" }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template v-slot="scope">
              <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="邮箱" prop="email" />
          <el-table-column
              align="center"
              label="上次登录时间"
              prop="createDate"
              width="160px"
          />
          <el-table-column
              align="center"
              label="上次登录IP"
              prop="lastLoginIp"
              width="130px"
          />
          <el-table-column
              align="center"
              label="操作"
              fixed="right"
              width="120"
          >
            <template #default="scope">
              <el-button
                  type="success"
                  size="small"
                  plain
                  @click="onCheck(scope.row)"
              >查看</el-button>
            </template>
          </el-table-column>
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
    <popup-detail title="管理员详情" @on-confirm="data => {
      (logRef as any).close()
    }" type="form" :form-item="checkForm" ref="logRef"/></div>
</template>

<script lang="ts" setup>
import {getDefaultList, getTableList, getUserList} from "@/api/url";
import { useDataTable, useLikeSearch, usePost } from "@/hooks";
import {nextTick, onBeforeMount, onMounted, reactive, ref} from "vue";
import { ElMessageBox } from "element-plus";
import type { TableFooter } from "@/components/types";
import {useMulSelector} from "@/hooks/table/useMulSelector";
import {use_Control} from "@/views/m_administrator/use_Control";
import PopupUpdate from "@/components/dialog/popupUpdate.vue";
import PopupDetail from "@/components/dialog/popupDetail.vue";
defineOptions({
  name:'listlg'
})
const logRef=ref<InstanceType<typeof PopupUpdate>|null>(null)
const tableFooter = ref<TableFooter>();
const { likeSearchModel, getSearchParams, resetSearch } = useLikeSearch();
const {
  handleSuccess,
  dataList,
  tableConfig,
  tableLoading,
  useHeight,
  offTableCollapseTransition,
} = useDataTable();
const post = usePost();
likeSearchModel.extraParams = () => ({
  ...tableFooter.value?.withPageInfoData(),
});
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
likeSearchModel.conditionItems = reactive([
  {
    name: "s1",
    label: "管理员",
    value: "",
    type: "input",
    span: 6,
  },
  {
    name: "s2",
    label: "ip",
    value: "",
    type: "input",
    span: 4,
  },
  {
    name: "s3",
    label: "操作网址",
    value: "",
    type: "input",
    span: 6,
  },
  {
    name: "s4",
    label: "操作时间",
    value: "",
    type: "date-range",
    placeholder: "",
    span: 8,
  },
]);
// search params
const doSearch = () => {
  const params = getSearchParams();
  console.log(params)
  ElMessageBox.alert(`模拟模糊搜索成功，搜索参数为：${JSON.stringify(params)}`);
};
// table data
function doRefresh() {
  post({
    url: getDefaultList,
    data: {
      ...tableFooter.value?.withPageInfoData(),
      ...getSearchParams(),
    },
  })
      .then((r:any)=>{
        // console.table(r.data)
        handleSuccess(r)
        tableFooter.value?.setTotalSize(r.totalSize);
      })
      .catch(console.log);
}
// check form
const checkForm=reactive<FormItem[]>([
  {
    name: "creator",
    label: "管理员账号",
    value: "",
    type: "input",
  },
  {
    name: "lastLoginIp",
    label: "IP",
    value: "",
    type: "input",
  },
  {
    name: "email",
    label: "操作网址",
    value: "",
    type: "input",
  },
  {
    name: "departmentName",
    label: "操作",
    value: "",
    type: "input",
  },
  {
    name: "createDate",
    label: "操作时间",
    value: "",
    type: "datetime",
    placeholder: "",
  },
].map(it=>({...it,span:24,disabled:true})))
// control event
const onCheck = (it:any) => {
  nextTick(()=>{
    console.log(it)
    checkForm.forEach(its=>{
      its.value=it[its.name]
    })
  })
  logRef.value?.open(()=>{
    console.log('open')
  })
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

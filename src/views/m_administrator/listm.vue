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
            title="管理员列表"
            @doSearch="doSearch"
            @resetSearch="resetSearch as any"
        />
      </template>
      <template #tableConfig>
        <TableConfig
            v-model:border="tableConfig.border"
            v-model:stripe="tableConfig.stripe"
            @refresh="doRefresh"
        >
          <template #actions>
            <el-button type="success" size="small" icon="PlusIcon"
            >添加管理员
            </el-button>
            <el-button type="danger" size="small" icon="DeleteIcon" @click="onDelete" :disabled="delStatus"
            >删除
            </el-button>
          </template>
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
          <el-table-column type="selection" width="45" />
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
    <popup-update title="修改管理员信息" ref="updateRef" :form-item="updateForms"/>
  </div>
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
const updateRef=ref<InstanceType<typeof PopupUpdate>|null>(null)
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
    value: "",
    type: "select",
    selectOptions,
    span: 8,
  },
  {
    name: "s2",
    label: "账号",
    value: "",
    type: "input",
    placeholder: "请输入用户姓名",
    span: 8,
  },
  {
    name: "s3",
    label: "创建人",
    value: "",
    type: "input",
    placeholder: "请输入用户姓名",
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
        console.table(r.data)
        handleSuccess(r)
        tableFooter.value?.setTotalSize(r.totalSize);
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
    selectOptions,
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

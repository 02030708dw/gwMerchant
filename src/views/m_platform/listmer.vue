<template>
  <div class="main-container">
    <TableBody>
      <template #header>
        <div class="selectTop">
          <el-select v-model="selectPlatMerchant">
            <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-select
              style="margin-left: 15px"
              v-if="selectPlatMerchant!==''" v-model="selectMerchant">
            <el-option
                v-for="item in selectMerchantOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </div>
      </template>
      <template #tableConfig>
        <TableConfig
            v-model:border="tableConfig.border"
            v-model:stripe="tableConfig.stripe"
            @refresh="doRefresh"
        >
          <template #actions>
            <el-button type="success" size="small"
                       :disabled="!isNumI(selectPlatMerchant)"
                       icon="PlusIcon" @click="$router.push({
                       name:'addmerchant'
                       })"
            >新增商户
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
        >
          <el-table-column align="center" label="序号" width="80">
            <template v-slot="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="名称" prop="nickName" />
          <el-table-column align="center" label="头像">
            <template v-slot="scope">
              <div class="avatar-container">
                <el-image
                    :src="require('@/assets/img_avatar_default.png')"
                    class="avatar"
                    :class="{ 'avatar-vip': scope.row.vip === 1 }"
                />
                <img
                    v-if="scope.row.vip === 1"
                    class="vip"
                    :src="require('@/assets/img_vip_icon.png')"
                />
              </div>
            </template>
          </el-table-column>
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
              prop="lastLoginTime"
              width="160px"
          />
          <el-table-column
              align="center"
              label="操作"
              fixed="right"
              width="380"
          >
            <template #default="scope">
              <el-button
                  type="warning"
                  size="small"
                  plain
                  @click="onUpdateItem(scope.row)"
              >详情</el-button>
              <el-button
                  type="primary"
                  size="small"
                  plain
                  @click="onCheckPlat(scope.row)"
              >查看平台商</el-button>
              <el-button
                  type="danger"
                  size="small"
                  plain
                  @click="onLog(scope.row)"
              >游戏设定</el-button>
              <el-button
                  type="info"
                  size="small"
                  plain
                  @click="onPlaySet(scope.row)"
              >玩法开关设置</el-button>
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
    <popup-detail title="商户详情"
                  :form-config="{size:'default',labelWidth:150,labelPosition:'right'}"
                  @on-confirm="detailConfirm" type="form" :form-item="detailForm" ref="detailRef"/>
  </div>
</template>

<script lang="ts" setup>
import { getTableList, getUserList } from "@/api/url";
import { useDataTable, useLikeSearch, usePost } from "@/hooks";
import {onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import { ElMessageBox } from "element-plus";
import type { TableFooter } from "@/components/types";
import {use_Control} from "@/views/m_platform/use_Control";
import PopupDetail from "@/components/dialog/popupDetail.vue";
import PopupUpdate from "@/components/dialog/popupUpdate.vue";
import {isNumI} from "@/utils/custom";
const tableFooter = ref<TableFooter>();
const detailRef=ref<InstanceType<typeof PopupUpdate>|null>(null)
const selectPlatMerchant=ref('')
const selectMerchant=ref('')
const selectMerchantOption=ref([])
const {
  handleSuccess,
  dataList,
  tableConfig,
  tableLoading,
  useHeight,
  offTableCollapseTransition,
} = useDataTable();
const post = usePost();
const selectOptions=[
  {
    label: "选择平台商(非直客/包网)",
    value: '',
  },
  {
    label: "男",
    value: 0,
    children:[
      {label: "男1", value: 1},
      {label: "男2", value: 2},
    ]
  },
  {
    label: "女",
    value: 1,
  },
]
// merchant change
watch(()=>selectPlatMerchant.value,(n,i)=>{
  selectMerchant.value=''
  selectMerchantOption.value=[{label:'选择商户',value:''},
    ...selectOptions.find(it=>it.value===n)?.children||[]] as any
})
// search params
// table data
function doRefresh() {
  post({
    url: getUserList,
    data: {
      ...tableFooter.value?.withPageInfoData(),
    },
  })
      .then(r=>{
        handleSuccess(r)
        console.log(r)
        return Promise.resolve(r)
      })
      .then((res: any) => {
        tableFooter.value?.setTotalSize(res.totalSize);
      })
      .catch(console.log);
}
// detailForm
const detailForm=reactive<FormItem[]>([
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
const {onUpdateItem,onLog,onPlaySet,onCheckPlat}=use_Control<FormItem>(detailRef,detailForm)
const detailConfirm = (d:any) => {
  console.log(d)
  detailRef.value.close()
}
onMounted(() => {
  doRefresh();
  useHeight();
});
onBeforeMount(offTableCollapseTransition);
</script>

<style lang="scss" scoped>
.selectTop{
  padding: 15px 10px 5px 10px;
}
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

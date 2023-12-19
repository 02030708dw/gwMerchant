<template>
  <div class="main-container">
    <div class="box-wrapper">
      <div class="flex">
        <el-card
            class="box-card personal-box"
            :body-style="{ padding: '10px' }"
        >
          <div class="info-wrapper">
            <div class="avatar-wrapper">
              <div
                  class="avatar"
                  :class="{ 'avatar-touch': touched, 'avatar-end': uploaded }"
                  @mouseenter="avatarTouchStart"
              >
                <img :src="avatar"/>
              </div>
              <div
                  class="camera-layer flex justify-center align-center"
                  @click="uploadAvatar"
              >
                <i class="el-icon-camera-solid text-white text-sl"></i>
              </div>
            </div>
            <div class="text-xl">
              {{ nickName }}
            </div>
            <div class="des-wrapper">
              <i class="el-icon-edit"></i>
              冰冻三尺，非一日之寒，成大事者不拘小节。
            </div>
            <div class="text-wrapper">
              <div class="label">昵称：</div>
              <div class="value">蝴蝶飞呀飞</div>
            </div>
            <div class="text-wrapper">
              <div class="label">性别：</div>
              <div class="value">男</div>
            </div>
            <div class="text-wrapper">
              <div class="label">生日：</div>
              <div class="value">2021-1-1</div>
            </div>
            <div class="text-wrapper">
              <div class="label">部门：</div>
              <div class="value">研发部</div>
            </div>
            <div>
              <el-tag
                  effect="dark"
                  size="small"
              >技术控
              </el-tag>
              <el-tag
                  effect="dark"
                  size="small"
              >爱学习
              </el-tag>
              <el-tag
                  effect="dark"
                  size="small"
              >大嘴巴
              </el-tag>
              <el-tag
                  effect="dark"
                  size="small"
              >宅男
              </el-tag>
              <el-tag
                  type="info"
                  effect="dark"
                  size="small"
              >嘚嘚没完
              </el-tag>
              <el-tag
                  type="info"
                  effect="dark"
                  size="small"
              >UP主
              </el-tag>
              <el-tag
                  type="info"
                  effect="dark"
                  size="small"
              >手机控
              </el-tag>
            </div>
          </div>
        </el-card>
        <el-card
            class="box-card wating-box flex-sub margin-left"
            :body-style="{ padding: '10px' }"
        >
          <template #header>
            <div class="flex justify-between align-center">
              <span class="text-sm">账号信息</span>
            </div>
          </template>
          <div>
            <BaseForm
                ref="baseForm"
                :form-items="conditionItems as FormItem[]"
                :config="formConfig"
            >
              <template #extra>

                <el-form-item
                    label="修改密码："
                >
                  <el-button @click="modifyPass">修改</el-button>
                </el-form-item>
              </template>
            </BaseForm>
          </div>
          <div class="flex justify-center">
            <el-button @click="onSubmit" type="success">提交修改</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useUserStore from "@/store/modules/user";
import {defineComponent, ref, reactive, onMounted, nextTick} from "vue";
import RichTextEditor from "@/components/common/RichTextEditor.vue";
import {useLikeSearch} from "@/hooks";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: "Personal",
  components: {RichTextEditor},
  setup() {
    const touched = ref(false);
    const uploaded = ref(false);
    const avatarTouchStart = () => {
      touched.value = true;
    };
    const uploadAvatar = () => {
      uploaded.value = true;
      setTimeout(() => {
        touched.value = false;
        uploaded.value = false;
      }, 1000);
    };
    const userStore = useUserStore();

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
        disabled: true,
      },
      {
        label: "组别：",
        type: "input",
        name: "s2",
        value: "",
        maxLength: 50,
        inputType: "text",
        disabled: true,
      },
      {
        label: "语言：",
        type: "radio-group",
        name: "s3",
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
        label: "名称：",
        type: "input",
        name: "s4",
        value: "",
        maxLength: 50,
        inputType: "text",
      },
    ]);
    const formConfig = {
      labelWidth: 100,
      size: "default",
      labelPosition: "right",
    };
    const modifyPass = () => {
      console.log('改密码')
    }
    const onSubmit = () => {
      console.log(getSearchParams())
    }
    let obj = {s1: "admin", s2: "111", s3: 1, s4: "wsx"}
    onMounted(() => {
      nextTick(() => {
        likeSearchModel.conditionItems.forEach((it:Record<string, string>) => {
          it.value = (obj as any)[it.name]
        })
      });
    })
    return {
      touched,
      uploaded,
      avatar: userStore.avatar,
      nickName: userStore.nickName,
      avatarTouchStart,
      uploadAvatar,
      conditionItems: likeSearchModel.conditionItems,
      formConfig, baseForm,
      modifyPass, onSubmit
    };
  },
});
</script>
<style lang="scss" scoped>
.el-tag--dark + .el-tag--dark {
  margin-left: 10px;
  margin-top: 10px;
}

.box-wrapper {
  .personal-box {
    width: 30%;

    .info-wrapper {
      text-align: center;

      .avatar-wrapper {
        display: inline-block;
        width: 6rem;
        height: 6rem;
        margin-top: 20px;
        position: relative;

        .avatar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transform-origin: bottom;
          transform: rotate(0deg);
          z-index: 1;
          transition: all 0.5s ease-in-out;

          & > img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid rgb(245, 241, 7);
          }
        }

        .avatar-touch {
          transform: rotate(180deg);
        }

        .avatar-end {
          transform: rotate(0deg);
        }

        .camera-layer {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
        }
      }

      .des-wrapper {
        width: 70%;
        margin: 0 auto;
        font-size: 14px;
        padding: 15px;
      }

      .text-wrapper {
        font-size: 0.8rem;
        margin-top: 10px;
        width: 50%;
        margin: 0 auto;

        .label {
          display: inline-block;
          width: 40%;
          text-align: right;
        }

        .value {
          display: inline-block;
          width: 60%;
          text-align: left;
        }
      }

      .text-wrapper + .text-wrapper {
        margin-top: 15px;
      }
    }
  }

  .message-wrapper {
    border-bottom: 1px solid #f5f5f5;
    padding-bottom: 10px;

    .notify {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .message-title {
      font-size: 1rem;
    }

    .content {
      font-size: 0.8rem;
      margin-top: 10px;
      line-height: 1rem;
    }
  }

  .message-wrapper + .message-wrapper {
    margin-top: 10px;
  }

  .wating-box {
    width: 30%;

    .wating-item {
      padding: 10px;
      border-bottom: 1px solid #f5f5f5;
    }
  }
}
</style>

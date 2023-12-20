<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import {getStorage} from "@/utils/storage";

export default defineComponent({
  name: "App",
  mounted() {
    console.log(getStorage('token'))
  },
  setup() {
    return {
      zhCn,
    };
  },
});
</script>

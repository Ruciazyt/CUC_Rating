<template>
  <van-config-provider :theme-vars="themeVars">
    <!-- <van-nav-bar title="XXXX年教学科研单位考核组打分" /> -->
    <van-row align="center" justify="center" style="margin-top: 16px">
      <van-col span="16">
        <span style="font-size: 16px; font-weight: bold">
          XXXX年机关职能部门、直（附）属单位考核会打分表
        </span>
      </van-col>
      <van-col span="4"
        ><van-button
          type="success"
          size="small"
          icon="points"
          @click="totalScoreClick"
          >总分</van-button
        ></van-col
      >
      <van-col span="4"
        ><van-button type="success" size="small" icon="apps-o"
          >列表</van-button
        ></van-col
      >
    </van-row>
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }" />
    <FormItem
      v-for="item in rateTargets"
      :key="item.id"
      :rateItem="item"
      :ref="setRef"
      class="FormItem"
    />
  </van-config-provider>
</template>

<script>
import {
  Button,
  NavBar,
  Cell,
  ConfigProvider,
  Col,
  Row,
  Divider,
  Icon,
} from "vant";
import { ref } from "vue";
import FormItem from "./components/FormItem.vue";
import { useRouter, useRoute } from "vue-router";
import { getAllTarget } from "@/apis/reportForm.js";
export default {
  components: {
    FormItem,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [ConfigProvider.name]: ConfigProvider,
    [Col.name]: Col,
    [Row.name]: Row,
    [Divider.name]: Divider,
    [Icon.name]: Icon,
  },
  setup() {
    const themeVars = {
      navBarTitleFontSize: "15px",
    };
    const router = useRouter();
    const route = useRoute();
    const rateTargets = ref([]);
    const refArr = [];
    const setRef = (el) => {
      if (el) {
        refArr.push(el);
      }
    };
    const getTargets = () => {
      const condition = {
        time_string: "2022-04-27_07:40:26",
        token: "Eyj2ni",
      };
      getAllTarget(condition).then((resp) => {
        rateTargets.value = resp.data;
        jumpToId();
      });
    };

    getTargets();
    const totalScoreClick = () => {
      router.push({
        path: "/totalScore",
      });
    };

    const jumpToId = () => {
      if (route.query && route.query.id) {
        // console.log(route.query.id);
        // 首先找到当前id的元素在数组中的位置
        const location = rateTargets.value.findIndex(
          (element) => element.id == route.query.id
        );
        if (location !== -1) {
          // 根据location获取ref， 取得对应的DOM
          const el = refArr[location];
          const offsetTop = el.$el.offsetTop;
          // console.log(el.$el);
          const htmlDom = document.documentElement;
          htmlDom.scrollTo(0, offsetTop);
        }
      } else {
        // console.log(route);
      }
    };
    return {
      themeVars,
      rateTargets,
      setRef,
      totalScoreClick,
    };
  },
};
</script>

<style scoped>
.FormItem {
  margin: 0 0 5% 5%;
  box-sizing: border-box;
  height: 130px;
}
</style>
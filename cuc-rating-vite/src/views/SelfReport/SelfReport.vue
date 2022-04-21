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
      :rateTarget="item.name"
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
import { nextTick, onMounted, ref } from "vue";
import FormItem from "./components/FormItem.vue";
import { useRouter, useRoute } from "vue-router";
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
      rateTargets.value = [
        { name: "研究生院", id: 1 },
        { name: "教务处", id: 2 },
        { name: "教务处3", id: 3 },
        { name: "教务处4", id: 4 },
        { name: "教务处5", id: 5 },
        { name: "教务处6", id: 6 },
        { name: "教务处7", id: 7 },
        { name: "教务处8", id: 8 },
        { name: "教务处9", id: 9 },
        { name: "教务处10", id: 10 },
      ];
    };
    getTargets();
    const totalScoreClick = () => {
      router.push({
        path: "/totalScore",
      });
    };

    const jumpToId = () => {
      if (route.query && route.query.id) {
        console.log(route.query.id);
        // 首先找到当前id的元素在数组中的位置
        const location = rateTargets.value.findIndex(
          (element) => element.id == route.query.id
        );
        if (location !== -1) {
          // 根据location获取ref， 取得对应的DOM
          const el = refArr[location];
          const offsetTop = el.$el.offsetTop;
          const htmlDom = document.documentElement;
          htmlDom.scrollTo(0, offsetTop);
        }
      } else {
        console.log(route);
      }
    };
    onMounted(() => jumpToId());
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
<template>
  <van-config-provider :theme-vars="themeVars">
    <!-- <van-nav-bar title="XXXX年教学科研单位考核组打分" /> -->
    <van-row align="center" justify="center" style="margin-top: 16px">
      <van-col span="16">
        <span style="font-size: 16px; font-weight: bold">
          XXXX年机关职能部门、直（附）属单位考核会打分表
        </span>
      </van-col>
      <van-col span="4" offset="3">
        <van-button type="success" size="small" icon="points" @click="totalScoreClick()">总分</van-button>
      </van-col>
    </van-row>
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }" />
    <div v-if="state.type === '0'">
      <div v-for="(item, index) in rateTargets" v-show="index === state.targetId" :key="item.id">
        <TechForm :rateItem="item" :formInfo="formInfo" :ref="setRef" :deptType="state.type" />
      </div>
    </div>
    <div v-if="state.type === '1'">
      <div v-for="(item, index) in rateTargets" v-show="index === state.targetId" :key="item.id">
        <PublicForm :rateItem="item" :formInfo="formInfo" :ref="setRef" :deptType="state.type" />
      </div>
    </div>
    <div class="controlBtn">
      <van-button type="success" size="small" @click="handlePreClick()" v-if="state.targetId > 0" class="preBtn">上一个
      </van-button>
      <van-button type="success" size="small" @click="handleNextClick()"
        v-if="state.targetId < state.rateTargetsLength - 1" class="nextBtn">下一个</van-button>
    </div>
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
  Notify,
} from "vant";
import { ref, reactive, nextTick, onMounted } from "vue";
import FormItem from "./components/FormItem.vue";
import TechForm from "./components/TechForm.vue";
import PublicForm from "./components/PublicForm.vue";
import { useRouter, useRoute } from "vue-router";
import { getAllTarget } from "@/apis/reportForm.js";
export default {
  components: {
    FormItem,
    TechForm,
    PublicForm,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [ConfigProvider.name]: ConfigProvider,
    [Col.name]: Col,
    [Row.name]: Row,
    [Divider.name]: Divider,
    [Icon.name]: Icon,
    [Notify.Component.name]: Notify.Component,
    PublicForm
  },
  setup() {
    const themeVars = {
      navBarTitleFontSize: "15px",
    };
    const router = useRouter();
    const route = useRoute();
    const rateTargets = ref([]);
    const state = reactive({ type: null, targetId: 0, rateTargetsLength: 0 })
    const refArr = [];
    let formInfo = {};
    const setRef = (el) => {
      if (el) {
        refArr.push(el);
      }
    };
    const getFirstCondition = () => {
      const paramsIndex = route.fullPath.indexOf("?");
      if (paramsIndex !== -1) {
        let raw_params = route.fullPath.slice(paramsIndex + 1);
        let params_pair = raw_params.split("&");
        const condition = {};
        params_pair.forEach((pair) => {
          const pairArr = pair.split("=");
          condition[pairArr[0]] = pairArr[1];
        });
        formInfo = condition;
      }
    };
    const getTargets = () => {
      if (JSON.stringify(formInfo) === "{}") {
        // 获取初始的token和string
        getFirstCondition();
      }
      getAllTarget(formInfo).then((resp) => {
        rateTargets.value = resp.data.progress;
        state.rateTargetsLength = rateTargets.value.length
        state.type = resp.data.type[1]
        // await nextTick()
        nextTick(() => {
          jumpToId();
        })

      });
    };

    getTargets();
    const totalScoreClick = async () => {
      Notify({ type: "success", message: "自动保存成功" });
      setTimeout(() => {
        router.push({
          path: "/totalScore",
          query: formInfo,
        });
      }, 1600);
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

    const handlePreClick = () => {
      if (state.targetId > 0) {
        state.targetId--
      }
    }

    const handleNextClick = () => {
      Notify({ type: "success", message: "保存中..." });
      setTimeout(() => {
        const nextBtnStatus = nextBtnDisable()
        if (nextBtnStatus) {
          Notify({ type: "warning", message: "当前部门未完成评分" });
          return
        }
        if (state.targetId < state.rateTargetsLength - 1)
          state.targetId++
      }, 1500)
    }

    const nextBtnDisable = () => {
      const scoreList = rateTargets.value[state.targetId].score || []
      const memberScoreList = rateTargets.value[state.targetId].members || {}
      let memberFlag = false
      Object.keys(memberScoreList).forEach(key=>{
        if(memberScoreList[key] === 0){
          memberFlag = true
        }
      })
      return scoreList.includes(0) || memberFlag
    }

    return {
      themeVars,
      rateTargets,
      formInfo,
      state,
      setRef,
      handlePreClick,
      handleNextClick,
      totalScoreClick,
    };
  },
};
</script>

<style scoped>
.controlBtn {
  width: 100%;
}

.preBtn {
  position: absolute;
  left: 20px
}

.nextBtn {
  position: absolute;
  right: 20px
}
</style>
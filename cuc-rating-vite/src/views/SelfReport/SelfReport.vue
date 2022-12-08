<template>
  <van-config-provider :theme-vars="themeVars">
    <!-- <van-nav-bar title="XXXX年教学科研单位考核组打分" /> -->
    <van-row align="center" justify="center" style="margin-top: 16px">
      <van-col span="16">
        <span style="font-size: 16px; font-weight: bold">
          2022年度考核
        </span>
      </van-col>
      <van-col span="4" offset="3">
        <van-button type="success" @click="totalScoreClick()" style="font-weight:bold;width: 60px;">总分</van-button>
      </van-col>
    </van-row>
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }" />
    <div style="margin-left:2%" v-if="state.type === '0'">
      <div v-for="(item, index) in rateTargets" v-show="index == state.targetId" :key="item.id">
        <TechForm :rateItem="item" :formInfo="formInfo" :ref="setRef" :deptType="state.type"
          @updateScore='updateScore' />
      </div>
    </div>
    <div style="margin-left:2%" v-if="state.type === '1'">
      <div v-for="(item, index) in rateTargets" v-show="index == state.targetId" :key="item.id">
        <PublicForm :rateItem="item" :formInfo="formInfo" :ref="setRef" :deptType="state.type"
          @updateScore='updateScore' />
      </div>
    </div>
    <div style="margin-left:2%" v-if="state.type === '2'">
      <div v-for="(item, index) in rateTargets" v-show="index == state.targetId" :key="item.id">
        <div v-if="(index < deptsNumber.techDeptLength)">
          <TechForm :rateItem="item" :formInfo="formInfo" :ref="setRef" :deptType="state.type"
            @updateScore='updateScore' />
        </div>
        <div v-else>
          <PublicForm :rateItem="item" :formInfo="formInfo" :ref="setRef" :deptType="state.type"
            @updateScore='updateScore' />
        </div>
      </div>
    </div>
    <div class="controlBtn">
      <van-button type="success" size="small" @click="handlePreClick()" v-if="state.targetId > 0"
        class="preBtn">上一个</van-button>
      <van-button type="success" size="small" @click="handleNextClick()"
        v-if="state.targetId < state.rateTargetsLength - 1" class="nextBtn">下一个</van-button>
      <van-button type="success" size="small" @click="handleSubmit()" v-else class="nextBtn">提交</van-button>
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
  Dialog,
} from "vant";
import { ref, reactive, nextTick, onMounted } from "vue";
import FormItem from "./components/FormItem.vue";
import TechForm from "./components/TechForm.vue";
import PublicForm from "./components/PublicForm.vue";
import { useRouter, useRoute } from "vue-router";
import { getAllTarget, getDepts, getQuestionnaireStatus, updateQuestionnaireStatus } from "@/apis/reportForm.js";
export default {
  components: {
    FormItem,
    TechForm,
    PublicForm,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
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
  emits: ['updateScore'],
  setup() {
    const themeVars = {
      navBarTitleFontSize: "15px",
    };
    const router = useRouter();
    const route = useRoute();
    const rateTargets = ref([]);
    const state = reactive({ type: null, targetId: 0, rateTargetsLength: 0 })
    const deptsNumber = reactive({ techDeptLength: 0, publicDeptLength: 0 })
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
    const getAllDepts = async () => {
      getDepts().then(resp => {
        const data = resp.data
        deptsNumber.techDeptLength = data[0].length
        deptsNumber.publicDeptLength = data[1].length
      })
    }

    const checkeDeptStatus = async (condition) => {
      getQuestionnaireStatus(condition).then(resp => {
        if (resp.data === 1) {
          router.push({
            path: "/hints",
          });
        }
      })
    }

    const getTargets = async () => {
      if (JSON.stringify(formInfo) === "{}") {
        // 获取初始的token和string
        getFirstCondition();
        if (route.query && route.query.id) {
          state.targetId = route.query.id
        }
      }
      await checkeDeptStatus(formInfo)
      await getAllDepts()
      getAllTarget(formInfo).then((resp) => {
        const data = resp.data
        rateTargets.value = data.progress;
        state.rateTargetsLength = rateTargets.value.length
        if (data.type.length > 1) {
          state.type = data.type[1]
        } else {
          state.type = data.type
        }

        console.log(state.targetId)
        // nextTick(() => {
        //   jumpToId();
        // })

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
        // const location = rateTargets.value.findIndex(
        //   (element) => element.id == route.query.id
        // );
        // if (location !== -1) {
        //   // 根据location获取ref， 取得对应的DOM
        //   const el = refArr[location];
        //   const offsetTop = el.$el.offsetTop;
        //   // console.log(el.$el);
        //   const htmlDom = document.documentElement;
        //   htmlDom.scrollTo(0, offsetTop);
        // }
      } else {
        // console.log(route);
      }
    };

    const handlePreClick = () => {
      if (state.targetId > 0) {
        state.targetId--
      }
    }

    const updateScore = async () => {
      await getTargets()
      console.log("重新获取分数")
    }

    const handleNextClick = () => {
      Notify({ type: "success", message: "检查评分数据中..." });
      setTimeout(() => {
        nextBtnDisable().then(res => {
          let nextBtnStatus = res
          if (nextBtnStatus) {
            Notify({ type: "warning", message: "当前部门未完成评分" });
            return
          }
          if (state.targetId < state.rateTargetsLength - 1)
            state.targetId++
        })
      }, 1500)
    }

    const nextBtnDisable = async () => {
      const scoreList = rateTargets.value[state.targetId].score || []
      const memberScoreList = rateTargets.value[state.targetId].members || {}
      let memberFlag = false
      Object.keys(memberScoreList).forEach(key => {
        if (memberScoreList[key] === 0) {
          memberFlag = true
        }
      })
      return scoreList.includes(0) || memberFlag
    }

    const findTargetsNotScored = () => {
      const deptList = rateTargets.value
      const unscoredDeptName = []
      deptList.forEach(dept => {
        const deptScore = dept.score
        const memberScore = dept.members
        let memberFlag = false
        Object.keys(memberScore).forEach(key => {
          if (memberScore[key] === 0) {
            memberFlag = true
          }
        })
        if ((deptScore.indexOf(0) !== -1) || (memberFlag === true)) {
          unscoredDeptName.push(dept.name)
        }
      })
      let res = "未完成对以下单位打分:\n" + unscoredDeptName.join('\n')
      return res
    }

    const handleSubmit = () => {
      const condition = formInfo
      condition.status = 1
      updateQuestionnaireStatus(condition).then(res => {
        if (res.data === 0) {
          let msg = findTargetsNotScored()
          Dialog({ message: msg });
        } else {
          Dialog({ message: '完成打分' });
          router.push({
            path: "/hints",
          });
        }
      })
    }

    return {
      themeVars,
      rateTargets,
      formInfo,
      state,
      deptsNumber,
      setRef,
      handlePreClick,
      handleNextClick,
      totalScoreClick,
      updateScore,
      handleSubmit
    };
  },
};
</script>

<style scoped>
.controlBtn {
  width: 100%;
  height: 100%;
  position: relative;
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
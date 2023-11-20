<template>
  <div>
    <div>
      <van-nav-bar title="打分情况" left-text="开始打分" left-arrow @click-left="onClickLeft" />
    </div>
    <ul>
      <li v-for="item in scoreList" :key="item.id" class="scoreItem" @click="onClickJumpToId(item.id)">
        <div class="content-wrapper">
          <p class="label">
            <span class="itemId"> {{ (item.id + 1) }} </span>
            <span class="itemName"> {{ item.name }}</span>
          </p>
          <p class="tips">
            <span>部门评分：{{ item.deptScoreTip }}</span>
            <span v-show="query_type !== 0">领导班子成员打分：{{ item.leaderScoreTip }}</span>
          </p>
        </div>
      </li>
    </ul>
    <div style="margin:1%">
      <div v-if="unscoredDepts.length > 0">
        <p>未完成对以下部门打分:</p>
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了">
          <van-cell v-for="item in unscoredDepts" :key="item.id" :title="item.name" @click="onClickJumpToId(item.id)" />
        </van-list>
      </div>
      <div v-else class="submitBtn">
        <van-button type="success" @click="handleSubmit()" class="nextBtn">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, List, Cell, Button,  Dialog } from "vant";
import { ref, reactive, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getAllTarget, updateQuestionnaireStatus } from "@/apis/reportForm.js";
export default {
  components: {
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [List.name]: List,
    [Cell.name]: Cell,
    [Dialog.Component.name]: Dialog.Component,
  },
  setup() {
    const state = reactive({
      scoreList: [],
    });
    const router = useRouter();
    const route = useRoute();
    const unscoredDepts = ref([])
    const loading = ref(false);
    const finished = ref(false);
    const query_type = ref(-1)

    const findTargetsNotScored = () => {
      const deptList = state.scoreList
      const unscoredDeptName = []
      loading.value = false
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
          unscoredDeptName.push({ name: dept.name, id: dept.id })
        }
      })
      unscoredDepts.value = unscoredDeptName
      finished.value = true
    }

    const getScoreList = () => {
      console.log(route)
      if (
        route.query &&
        route.query.time_string &&
        route.query.token
      ) {
        const condition = {
          time_string: route.query.time_string,
          token: route.query.token,
        };
        getAllTarget(condition).then((resp) => {
          const data = resp.data.progress
          const type = parseInt(resp.data.type[0])
          query_type.value = type
          state.scoreList = data.map(item => {
            if (item.score.indexOf(0) !== -1) {
              item.deptScoreTip = "未完成"
            } else {
              item.deptScoreTip = "已完成"
            }

            const memberScore = item.members
            let memberFlag = false
            Object.keys(memberScore).forEach(key => {
              if (memberScore[key] === 0) {
                memberFlag = true
              }
            })
            item.leaderScoreTip = memberFlag ? '未完成' : '已完成'
            return item
          })
          state.scoreList = resp.data.progress;
          findTargetsNotScored()
        });
      }
    };

    getScoreList();

    const onClickLeft = () => {
      router.push({
        path: "/scoreIndex",
        query: {
          time_string: route.query.time_string,
          token: route.query.token,
          id: 0,
        },
      });
    };
    const onClickJumpToId = (id) => {
      router.push({
        path: "/scoreIndex",
        query: {
          time_string: route.query.time_string,
          token: route.query.token,
          id: id,
        },
      });
    };

    const handleSubmit = () => {
      const condition = {
        time_string: route.query.time_string,
        token: route.query.token,
        status: 1
      }
      Dialog.confirm({ message: '提交后不可修改，确认提交?' }).then(() => {
        updateQuestionnaireStatus(condition).then(res => {
          router.push({
            path: "/hints",
          });
        })
      });
    }

    return {
      unscoredDepts,
      loading,
      finished,
      query_type,
      ...toRefs(state),
      onClickLeft,
      onClickJumpToId,
      handleSubmit
    };
  },
};
</script>

<style scoped>
ul {
  padding: 20px 10px 0px 10px;
}

.scoreItem {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.scoreItem:last-child {
  margin-bottom: 0px;
}

.itemName {
  font-size: 14px;
  color: rgb(97, 198, 235);
}

.content-wrapper {
  display: flex;
  width: 100%;
}

.label {
  flex: 1
}

.tips {
  flex: 1.5;
  display: flex;
  flex-direction: column;
}

.submitBtn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
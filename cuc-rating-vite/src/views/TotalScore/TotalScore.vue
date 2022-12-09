<template>
  <div>
    <div>
      <van-nav-bar title="打分情况" left-text="返回至第一项" left-arrow @click-left="onClickLeft" />
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
            <span>领导班子成员打分：{{ item.leaderScoreTip }}</span>
          </p>
        </div>
      </li>
    </ul>
    <div style="margin:1%">
      <p>未完成对以下部门打分:</p>
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了">
        <van-cell v-for="item in unscoredDepts" :key="item.id" :title="item.name" @click="onClickJumpToId(item.id)" />
      </van-list>
    </div>
  </div>
</template>

<script>
import { NavBar, List, Cell } from "vant";
import { ref, reactive, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getAllTarget } from "@/apis/reportForm.js";
export default {
  components: {
    [NavBar.name]: NavBar,
    [List.name]: List,
    [Cell.name]: Cell,
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
    return {
      unscoredDepts,
      loading,
      finished,
      ...toRefs(state),
      onClickLeft,
      onClickJumpToId,
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
  display:flex;
  flex-direction: column;
}
</style>
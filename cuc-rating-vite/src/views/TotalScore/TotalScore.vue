<template>
  <div>
    <div>
      <van-nav-bar
        title="总分"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <ul>
      <li
        v-for="item in scoreList"
        :key="item.id"
        class="scoreItem"
        @click="onClickJumpToId(item.id)"
      >
        <span class="itemId"> {{( item.id + 1)}} </span>
        <span class="itemName"> {{ item.name }}</span>
        <span class="itemScore"> {{ item.score }}</span>
      </li>
    </ul>
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
          state.scoreList = resp.data.progress;
        });
      }
    };

    getScoreList();

    const onClickLeft = () => history.back();
    const onClickJumpToId = (id) => {
      router.push({
        path: "/",
        query: {
          time_string:route.query.time_string,
          token:route.query.token,
          id: id,
        },
      });
    };
    return {
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
.itemId {
  line-height: 30px;
}
.itemName {
  font-size: 14px;
  margin-left: 5px;
  color: rgb(97, 198, 235);
  line-height: 30px;
}
.itemScore {
  line-height: 30px;
  font-weight: bold;
  margin-left: auto;
}
</style>
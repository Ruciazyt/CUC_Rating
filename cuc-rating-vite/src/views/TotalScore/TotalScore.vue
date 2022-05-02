<template>
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
      <span class="itemId"> {{ item.id }} </span>
      <span class="itemName"> {{ item.name }}</span>
      <span class="itemScore"> {{ item.score }}</span>
    </li>
  </ul>
</template>

<script>
import { NavBar, List, Cell } from "vant";
import { ref, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
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

    const getScoreList = () => {
      const condition = {
        time_string: "2022-04-27_07:40:26",
        token: "Eyj2ni",
      };
      getAllTarget(condition).then((resp) => {
        state.scoreList = resp.data;
      });
    };
    
    getScoreList();

    const onClickLeft = () => history.back();
    const onClickJumpToId = (id) => {
      router.push({
         path: "/",
         query:{
           id:id
         }
      })
    };
    return {
      ...toRefs(state),
      onClickLeft,
      onClickJumpToId
    };
  },
};
</script>

<style scoped>
ul {
  padding: 20px 40px 0px 40px;
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
  margin-left: 30px;
  color: rgb(97, 198, 235);
  line-height: 30px;
}
.itemScore {
  line-height: 30px;
  font-weight: bold;
  margin-left: auto;
}
</style>
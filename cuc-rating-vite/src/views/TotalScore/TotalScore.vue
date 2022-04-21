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
      // const conditions = {}

      // getScoreList(conditions).then(resp => {
      //   const {data} = resp
      //   state.scoreList = data.data
      // })
      setTimeout(() => {
        const data = [];
        for (let i = 0; i < 20; i++) {
          data.push({
            id: i,
            name: "招生处",
            score: Math.round(Math.random() * 100),
          });
        }
        state.scoreList = data;
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
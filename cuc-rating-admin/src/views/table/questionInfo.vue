<template>
  <el-card style="margin: 1%">
    <div slot="header" class="clearfix">
      <span class="tableHeader">问卷时间戳：{{ timeStr }} ---下属Token</span>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95" prop="id" />
      <el-table-column align="center" label="tokenId" prop="tokenId" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="success" @click="handleClick(scope.row)" size="small"
            >查看进度</el-button
          >
          <!-- <el-button type="info" size="small">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      v-show="total > 0"
      :total="total"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      style="float: right; padding: 32px 16px"
    >
    </el-pagination>
    <score-list ref="scoreList" :list="progressList"></score-list>
  </el-card>
</template>

<script>
import { getTokens, getProgress } from "@/api/qs";
import ScoreList from './components/ScoreList.vue'
export default {
  components: { ScoreList },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      timeStr: "",
      progressList: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.timeStr = this.$route.params && this.$route.params.token;
      const timeStrParam = this.timeStr
      this.getTokens(timeStrParam);
    },
    getTokens(qsTimeStr) {
      const condition = {
        time_string: qsTimeStr,
      };
      this.listLoading = true;
      getTokens(condition).then((resp) => {
        const tokensArr = resp.data;
        this.total = tokensArr.length;
        this.list = tokensArr.map((item, index) => {
          return { id: index, tokenId: item };
        });
        this.listLoading = false;
      });
    },

    handleClick(rowData){
      const [timeStr, tokenId] = [this.timeStr, rowData.tokenId];
      const condition = {
        time_string: timeStr,
        token: tokenId,
      }
      getProgress(condition).then((resp) => {
        const tmpData=  resp.data.progress
        this.progressList = tmpData.map(element => {
          element.sorce_display = element.score.join(' ')
          return element
        });
      })
      this.$refs.scoreList.dialogVisible = true;
    }
  },
};
</script>

<style scoped>
.tableHeader{
  font-weight: bold;
  color:#34495e
}
</style>

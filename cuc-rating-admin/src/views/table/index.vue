<template>
  <div class="app-container">
    <aside>
      <el-button @click="handleAdd">新增问卷</el-button>
    </aside>
    <el-table v-loading="listLoading" :data="list.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="95" prop="id" />
      <el-table-column align="center" label="创建时间" prop="createTime" />
      <el-table-column fixed="right" label="操作" width="400">
        <template slot-scope="scope">
          <router-link :to="'/question/tokenList/' + scope.row.createTime">
            <el-button type="success" size="small">查看</el-button>
          </router-link>
          <el-button type='primary' size='small' @click="handleExportDoc(scope.row.createTime)"
            style="margin-left:10px">导出文档</el-button>
          <el-button type="success" @click="handleExportRes(scope.row.createTime)" size="small">导出结果</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" v-show="total > 0" :total="total"
      :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
      style="float: right; padding: 32px 16px">
    </el-pagination>
    <ScoreForm ref="ScoreForm" @successCb="handleSuccess" />
  </div>
</template>

<script>
import { getAllQS, exportDoc, exportRes } from "@/api/qs";
import ScoreForm from "./components/ScoreForm.vue";
export default {
  components: { ScoreForm },
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0,
      currentPage: 1,
      pageSize: 10,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getAllQS().then((response) => {
        const qsArr = response.data;
        if (qsArr.length > 0) {
          this.total = qsArr.length;
          this.list = qsArr.map((item, index) => {
            return {
              id: index,
              createTime: item,
            };
          });
        }
        this.listLoading = false;
      });
    },
    handleAdd() {
      this.$refs.ScoreForm.dialogVisible = true;
    },
    handleSuccess() {
      this.fetchData();
    },
    handleExportDoc(timeStr) {
      const condition = {
        time_string: timeStr
      }
      const fileName = timeStr + "导出文档"
      exportDoc(condition).then(response => {
        let blob = new Blob([response.data], { type: 'application/zip' })
        // 非IE下载
        let a = document.createElement('a')
        a.style.display = 'none'
        a.href = window.URL.createObjectURL(blob)
        a.download = fileName
        a.click()
        URL.revokeObjectURL(a.href) // 释放URL 对象
      })
    },
    handleExportRes(timeStr){
      const condition = {
        time_string: timeStr
      }
      const fileName = timeStr + "导出结果"
      exportRes(condition).then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        // 非IE下载
        let a = document.createElement('a')
        a.style.display = 'none'
        a.href = window.URL.createObjectURL(blob)
        a.download = fileName
        a.click()
        URL.revokeObjectURL(a.href) // 释放URL 对象
      })
    }
  },
};
</script>
<style scoped>
aside {
  background: #eef1f6;
  padding: 8px 24px;
  margin-bottom: 20px;
  border-radius: 2px;
  display: block;
  line-height: 32px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
}
</style>

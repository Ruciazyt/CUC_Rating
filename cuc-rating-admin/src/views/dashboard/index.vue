<template>
  <div>
    <aside>
      现有部门
      <el-button type="text" icon="el-icon-plus" @click="handleAddClick"></el-button>

    </aside>
    <p class="deptTypeTitle">教学教研单位</p>
    <el-card class="deptCard">
      <draggable v-model="deptsList_JY" group="JY_depts" @start="drag=true" @end="drag=false" @change="handleMove()">
        <el-tag v-for="tag in deptsList_JY" :key="tag.name" class="deptTag" closable @close="handleClose(tag.name)">
          {{ tag.name }}
        </el-tag>
      </draggable>
    </el-card>
    <p class="deptTypeTitle">党群行政职能部门</p>
    <el-card class="deptCard">
      <draggable v-model="deptsList_DQ" group="DQ_depts" @start="drag=true" @end="drag=false" @change="handleMove()">
        <el-tag v-for="tag in deptsList_DQ" :key="tag.name" class="deptTag" closable @close="handleClose(tag.name)">
          {{ tag.name }}
        </el-tag>
      </draggable>
    </el-card>
    <el-dialog title="新增目标" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="部门名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门类型">
          <el-select v-model="form.type" autocomplete="off">
            <el-option v-for="option in deptTypes" :label="option.label" :key="option.id" :value="option.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllDepts, deleteDept, addDept, updateAllDepts } from "@/api/dept";
import draggable from 'vuedraggable'
export default {
  name: "Dashboard",
  components: { draggable },
  data() {
    return {
      deptsList_JY: [],
      deptsList_JY_SORT: [],
      deptsList_DQ: [],
      testArr: [],
      dialogFormVisible: false,
      form: {
        name: "",
        type: 0,
      },
      //type=0为教学教研单位  type=1为党群行政职能部门
      deptTypes: [
        {
          id: 0,
          label: "教学教研单位",
        },
        {
          id: 1,
          label: "党群行政职能部门",
        },
      ],
    };
  },
  created() {
    this.getAllDepts();
  },
  methods: {
    getAllDepts() {
      getAllDepts().then((resp) => {
        const resObj = resp.data;
        const JY_depts = [];
        const DQ_depts = [];
        Object.keys(resObj).forEach((key) => {
          if (resObj[key] == 0) {
            JY_depts.push({
              id: resObj[key],
              name: key,
            });
          } else if (resObj[key] == 1) {
            DQ_depts.push({
              id: resObj[key],
              name: key,
            });
          }
          this.deptsList_JY = JY_depts;
          this.deptsList_DQ = DQ_depts;
        });
      });
    },
    handleSubmit() {
      const condition = Object.assign({}, this.form);
      addDept(condition).then((resp) => {
        console.log(resp);
        if (resp.status == 200) {
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: "添加失败",
          });
        }
        this.dialogFormVisible = false;
        this.getAllDepts();
      });
    },
    handleAddClick() {
      this.dialogFormVisible = true;
    },
    handleClose(tagName) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const condition = {
            name: tagName,
          };
          deleteDept(condition).then((resp) => {
            if (resp.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getAllDepts();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleMove() {
      const condition = {
        0: this.deptsList_JY.map(item => item.name),
        1: this.deptsList_DQ.map(item => item.name)
      }
      updateAllDepts(condition).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "排序变更!",
          });
          this.getAllDepts();
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
aside {
  background: #eef1f6;
  padding: 8px 24px;
  margin: 20px;
  border-radius: 2px;
  display: block;
  line-height: 32px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
}

.deptCard {
  margin: 20px;
}

.deptTag {
  margin: 0 0 0 10px;
}

.deptTypeTitle {
  margin-left: 30px;
  font-size: 18px;
  font-weight: 500;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑",
    Arial, sans-serif;
}
</style>

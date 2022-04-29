<template>
  <el-dialog title="创建问卷" :visible.sync="dialogVisible">
    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="formInfo"
    >
      <el-form-item label="问卷生成份数">
        <el-input v-model="formInfo.token_num"></el-input>
      </el-form-item>
      <el-form-item label="最少填写份数">
        <el-input v-model="formInfo.min_num"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { createQS } from "@/api/qs";
export default {
  name: "ScoreForm",
  data() {
    return {
      labelPosition: "right",
      formInfo: {
        token_num: 4,
        min_num: 3,
      },
      dialogVisible: false,
    };
  },
  methods: {
    onSubmit() {
      const condition = Object.assign({}, this.formInfo);
      createQS(condition).then((resp) => {
        console.log(resp);
        if (resp.status === 200) {
          this.$notify({
            title: "成功",
            message: "这是一条成功的提示消息",
            type: "success",
          });
          this.$emit("successCb");
        } else {
          this.$notify.error({
            title: "错误",
            message: "出错了",
          });
        }
      });
      this.dialogVisible = false;
    },
  },
};
</script>

<style>
</style>

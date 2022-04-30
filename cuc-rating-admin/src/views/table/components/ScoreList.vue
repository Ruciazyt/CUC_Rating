<template>
  <el-dialog title="问卷进度" :visible.sync="dialogVisible">
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="Id" width="180"> </el-table-column>
      <el-table-column prop="name" label="目标" width="180"> </el-table-column>
      <el-table-column prop="score" label="分数"> </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: "ScoreList",
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {},
};
</script>

<style>
</style>

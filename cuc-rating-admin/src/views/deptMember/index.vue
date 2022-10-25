<template>
    <div>
        <aside>
            <p>当前部门：<el-select v-model="currentDept" placeholder="请选择" style="margin-left:1%"
                    @change="handleDeptChange()">
                    <el-option v-for="item in options" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </p>
            <span>人员管理</span>
            <el-button type="text" icon="el-icon-plus" @click="handleAddClick"></el-button>
        </aside>

        <el-card style="margin:1%">
            <el-table v-loading="listLoading"
                :data="deptMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                element-loading-text="Loading" border fit highlight-current-row>
                <el-table-column align="center" label="序号" width="95" prop="id" />
                <el-table-column align="center" label="名称" prop="name" />
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="danger" @click="handleDelete(scope.row)" size="small">删除</el-button>
                        <!-- <el-button type="info" size="small">编辑</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-pagination background layout="prev, pager, next" v-show="total > 0" :total="total"
            :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
            style="float: right; padding: 32px 16px">
        </el-pagination>
        <el-dialog title="新增人员" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="部门名称">
                    <el-input v-model="currentDept" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="人员">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
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
import { getDeptMembers, setDeptMembers } from '@/api/dept'
import { deleteByArrName } from '../../utils/arrUtils'
import { getAllDepts } from '@/api/dept'
export default {
    data() {
        return {
            currentDept: '',
            rawMembers: [],
            deptMembers: [],
            options: [],
            dialogFormVisible: false,
            listLoading: false,
            total: 0,
            currentPage: 1,
            pageSize: 10,
            form: {
                name: ''
            }
        }
    },
    created() {
        // this.getMemebers()
        this.init()
    },

    methods: {
        handleAddClick() {
            this.dialogFormVisible = true;
        },
        init() {
            this.getAllDepts()
        },
        getMemebers() {
            const params = { dept: this.currentDept }
            this.listLoading = true
            getDeptMembers(params).then(resp => {
                this.rawMembers = resp.data
                console.log(resp.data)
                this.deptMembers = this.rawMembers.map((value, key) => {
                    return { id: key, name: value }
                })
                this.listLoading = false
            })
        },
        setMembers() {
            this.rawMembers.push(this.form.name)
            const members = this.rawMembers.slice() || []
            const dept = this.currentDept
            this.updateMembers(dept, members)
        },
        updateMembers(dept, members){
            setDeptMembers(dept, members).then(resp => {
                if (resp.status == 200) {
                    this.$notify({
                        title: "成功",
                        message: "更新成功",
                        type: "success",
                    })
                } else {
                    this.$notify.error({
                        title: "错误",
                        message: "更新失败",
                    });
                }
                this.getMemebers()
                this.dialogFormVisible = false
            })
        },
        getAllDepts() {
            getAllDepts().then(resp => {
                this.options = resp.data.flat()
            })
        },
        handleDeptChange() {
            this.getMemebers()
        },
        handleSubmit() {
            this.setMembers()
        },
        handleDelete(item) {
            this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    const name = item.name
                    const dept = this.currentDept
                    const members = deleteByArrName(this.rawMembers.slice(), name)
                    this.updateMembers(dept, members)
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        }

    },
}
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
</style>
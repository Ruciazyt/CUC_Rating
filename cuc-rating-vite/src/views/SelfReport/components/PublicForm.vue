<template>
    <van-row justify="space-between" style="margin-bottom: 1%">
        <span style="font-weight: bold">{{ rateItem.name }}</span>
    </van-row>
    <div v-show="checkDeptShow(rateItem.name)">
        <FormItem v-for="(item, index) in scoreItemList" :key="item.id + item.value.toString()" :rateItem="item"
            :formInfo="formInfo" @updateScore="updateScore">
        </FormItem>
    </div>
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }" />
    <div style="background:#f7f8fa" v-show="members.length > 0">
        <van-row justify="space-between" style="margin-bottom: 1%">
            <van-col span="8"><span style="font-weight: bold">部门领导干部</span></van-col>
        </van-row>
        <FormItem v-for="item in members" :key="item.id" :rateItem="item" :formInfo="formInfo"
            :targetType="item.targetType" @updateScore="updateScore" :deptName="rateItem.name">
        </FormItem>
    </div>
</template>
  
<script>
import { ref, reactive } from "vue";
import {
    Form,
    Field,
    CellGroup,
    RadioGroup,
    Radio,
    Row,
    Col,
    Stepper,
    Divider,
    Notify,
} from "vant";
import FormItem from "./FormItem.vue"
export default {
    components: {
        FormItem,
        [Field.name]: Field,
        [Form.name]: Form,
        [CellGroup.name]: CellGroup,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [Col.name]: Col,
        [Row.name]: Row,
        [Stepper.name]: Stepper,
        [Divider.name]: Divider,
        [Notify.Component.name]: Notify.Component,

    },
    props: {
        rateItem: Object,
        formInfo: Object,
        deptType: String
    },
    emits: ['updateScore'],
    setup(props, { emit }) {
        const scoreItemList = [
            { id: props.rateItem.id, label: "年度综合评分", value: 0, score: props.rateItem.score[0] },
            { id: props.rateItem.id, label: "年度贡献评分", value: 1, score: props.rateItem.score[1] },
        ]
        const members = Object.keys(props.rateItem.members).map((key) => {
            return { id: props.rateItem.id, label: key, score: props.rateItem.members[key], targetType: 1 }
        })
        const updateScore = () => {
            emit('updateScore')
        }
        const checkDeptShow = (deptName) => {
            // 特判部门,下列部门不显示部门打分,只显示人员打分
            let reg = /校长助理|学部领导|校务委员会领导/
            return !reg.test(deptName)
        }
        return { scoreItemList, members, updateScore, checkDeptShow }
    }
};
</script>
  
<style scoped>

</style>

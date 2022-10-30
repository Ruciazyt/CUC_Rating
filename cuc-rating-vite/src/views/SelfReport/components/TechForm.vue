<template>
    <van-row justify="space-between" style="margin-bottom: 1%">
        <van-col span="8"><span style="font-weight: bold">{{ rateItem.name }}</span></van-col>
    </van-row>
    <FormItem v-for="item in scoreItemList" :key="item.id + item.value.toString()" :rateItem="item"
        :formInfo="formInfo">
    </FormItem>
    <van-row justify="space-between" style="margin-bottom: 1%">
        <van-col span="8"><span style="font-weight: bold">部门成员打分</span></van-col>
    </van-row>
    <FormItem v-for="item in members" :key="item.label" :rateItem="item" :formInfo="formInfo" :targetType="item.targetType">
    </FormItem>
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
        deptType: String,
    },
    setup(props) {
        const scoreItemList = [
            { id: props.rateItem.id, label: "基础评分", value: 0, score: props.rateItem.score[0] },
            { id: props.rateItem.id, label: "年度贡献奖", value: 1, score: props.rateItem.score[1] },
            { id: props.rateItem.id, label: "改革创新奖", value: 2, score: props.rateItem.score[2] },
            { id: props.rateItem.id, label: "年度进步奖", value: 3, score: props.rateItem.score[3] },
        ]
        const members = Object.keys(props.rateItem.members).map((key) => {
            return { id:props.rateItem.id, label: key, score: props.rateItem.members[key], targetType:1 }
        })
        return { scoreItemList, members }
    }
};
</script>
  
<style scoped>

</style>
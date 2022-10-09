<template>
    <van-row justify="space-between" style="margin-bottom: 1%">
        <van-col span="8"><span style="font-weight: bold">{{ rateItem.name }}</span></van-col>
    </van-row>
    <FormItem v-for="item in scoreItemList" :key="item.id + item.value.toString()" :rateItem="item" :formInfo="formInfo">
    </FormItem>
    <van-divider />
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
        ]
        return { scoreItemList }
    }
};
</script>
  
<style scoped>

</style>
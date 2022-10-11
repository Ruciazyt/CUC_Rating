<template>
  <div>
    <p>{{rateItem.label}}</p>
    <van-stepper v-show="scoreShow.isShow" v-model="valueRange.currentValue" @change="handleStepperChange"
      :min="valueRange.min" :max="valueRange.max" />
    <van-radio-group v-model="checked" direction="horizontal" @change="handleCheckedChange" icon-size="16px"
      class="group">
      <van-radio name="1">优秀</van-radio>
      <van-radio name="2">良好</van-radio>
      <van-radio name="3">合格</van-radio>
      <van-radio name="4">基本合格</van-radio>
      <van-radio name="5">不合格</van-radio>
    </van-radio-group>
  </div>
</template>

<script>
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
import { reactive, ref } from "vue";
import { rate } from "@/apis/reportForm";
export default {
  name: "FormItem",
  components: {
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
    const checked = ref("1");
    const valueRange = reactive({
      currentValue: props.rateItem.score === -1 ? -1 : props.rateItem.score,
      min: -1,
      max: 100,
    });
    const scoreShow = reactive({
      isShow: props.rateItem.score === -1 ? false : true,
    })
    const handleCheckedChange = (checked) => {
      scoreShow.isShow = true;
      switch (checked) {
        case "1":
          valueRange.currentValue = 90;
          setRange(90, 100);
          break;
        case "2":
          valueRange.currentValue = 80;
          setRange(80, 89);
          break;
        case "3":
          valueRange.currentValue = 70;
          setRange(70, 79);
          break;
        case "4":
          valueRange.currentValue = 60;
          setRange(60, 69);
          break;
        case "5":
          valueRange.currentValue = 50;
          setRange(50, 59);
          break;
      }
    };

    const setRange = (min, max) => {
      valueRange.max = max;
      valueRange.min = min;
    };

    const initChecked = () => {
      let val = valueRange.currentValue
      if (val >= 90) {
        checked.value = "1";
        setRange(90, 100);
      } else if (val >= 80) {
        checked.value = "2";
        setRange(80, 89);
      } else if (val >= 70) {
        checked.value = "3";
        setRange(70, 79);
      } else if (val >= 60) {
        checked.value = "4";
        setRange(60, 69);
      } else if (val >= 0) {
        checked.value = "5";
        setRange(0, 59);
      } else {
        // 没打分
        checked.value = ""
        setRange(-1, -1);
      }
    };
    // 根据得分初始化 选项按钮
    initChecked();
    // 防抖函数 - 控制多次触发只执行一次
    const debounce = (fn, delay) => {
      let timer;
      return function () {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fn();
        }, delay);
      };
    };

    const stepperChange = debounce(() => {
      const condition = {
        time_string: props.formInfo.time_string,
        token: props.formInfo.token,
        id: props.rateItem.id,
        score: valueRange.currentValue,
        no: props.rateItem.value
      };
      rate(condition).then((resp) => {
        if (resp.status != 200) {
          Notify({ type: "error", message: "评分提交失败，请联系管理员" });
        }
      });
    }, 1500);

    const handleStepperChange = () => {
      stepperChange();
    };

    return { checked, valueRange, scoreShow, handleCheckedChange, handleStepperChange };
  },
};
</script>

<style scoped>
.group {
  align-content: space-around;
  height: 80px;
}
</style>

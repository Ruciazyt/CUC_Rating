<template>
  <div>
    <van-row justify="space-between" style="margin-bottom: 1%">
      <van-col span="8"
        ><span style="font-weight: bold">{{ rateItem.name }}</span></van-col
      >
      <van-col span="8" offset="8">
        <van-stepper
          v-model="valueRange.currentValue"
          @change="handleStepperChange"
          :min="valueRange.min"
          :max="valueRange.max"
        />
      </van-col>
    </van-row>
    <van-radio-group
      v-model="checked"
      direction="horizontal"
      @change="handleCheckedChange"
      icon-size="16px"
      class="group"
    >
      <van-radio name="1">优秀</van-radio>
      <van-radio name="2">良好</van-radio>
      <van-radio name="3">合格</van-radio>
      <van-radio name="4">基本合格</van-radio>
      <van-radio name="5">不合格</van-radio>
    </van-radio-group>
    <van-divider />
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
  },
  setup(props) {
    const checked = ref("1");
    const valueRange = reactive({
      currentValue: props.rateItem.score === "-1" ? 0 : props.rateItem.score,
      min: 0,
      max: 100,
    });
    const handleCheckedChange = (checked) => {
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
          valueRange.currentValue = 0;
          setRange(0, 59);
          break;
      }
    };
    const setRange = (min, max) => {
      valueRange.max = max;
      valueRange.min = min;
    };

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
    const handleStepperChange = debounce(() => {
      const condition = {
        time_string: "2022-04-27_07:40:26",
        token: "Eyj2ni",
        id: props.rateItem.id,
        score: valueRange.currentValue,
      };
      rate(condition).then((resp) => {
        if (resp.status == 200) {
          Notify({ type: 'success', message: '自动保存成功' });
        }
      });
    }, 2000);

    return { checked, valueRange, handleCheckedChange, handleStepperChange };
  },
};
</script>

<style scoped>
.group {
  align-content: space-around;
  height: 80px;
}
</style>

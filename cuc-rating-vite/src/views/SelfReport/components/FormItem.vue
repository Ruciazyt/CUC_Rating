<template>
  <div>
    <van-row justify="space-between" style="margin-bottom: 1%">
      <van-col span="8"
        ><span style="font-weight: bold">{{ rateTarget }}</span></van-col
      >
      <van-col span="8" offset="8">
        <van-stepper
          v-model="valueRange.currentValue"
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
} from "vant";
import { reactive, ref } from "vue";
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
  },
  props: {
    rateTarget: String,
  },
  setup(props) {
    const checked = ref("1");
    const valueRange = reactive({
      currentValue: 90,
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
    return { checked, valueRange, handleCheckedChange };
  },
};
</script>

<style scoped>
.group {
  align-content: space-around;
  height: 80px;
}
</style>

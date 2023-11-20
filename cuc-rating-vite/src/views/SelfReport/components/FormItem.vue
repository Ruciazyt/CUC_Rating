<template>
  <div>
    <van-row>
      <p>{{ rateItem.label }}</p>
      <div class="scoreCenter">
        <van-stepper v-show="scoreShow.isShow" v-model="valueRange.currentValue" @change="handleStepperChange"
          :min="valueRange.min" :max="valueRange.max" />
      </div>
      <div v-if="(targetType === 1)" class="report">
        <van-button plain type="success" size="small" @click="checkReport(rateItem.label)">述职报告</van-button>
        <!-- <a target="_blank" href="/test.pdf">预览pdf</a> -->
      </div>
    </van-row>
    <div v-if="(targetType !== 1)">
      <van-radio-group v-model="checked" direction="horizontal" @change="handleCheckedChange" icon-size="24px"
        class="group">
        <van-radio name="1" class="radioItem">优秀</van-radio>
        <van-radio name="2" class="radioItem">良好</van-radio>
        <van-radio name="3" class="radioItem">合格</van-radio>
        <van-radio name="4" class="radioItem">基本合格</van-radio>
        <van-radio name="5" class="radioItem">不合格</van-radio>
      </van-radio-group>
    </div>
    <div v-else>
      <van-radio-group v-model="checked" direction="horizontal" @change="handleCheckedChange" icon-size="24px"
        class="group">
        <van-radio name="1" class="radioItem">优秀</van-radio>
        <van-radio name="2" class="radioItem">称职</van-radio>
        <van-radio name="3" class="radioItem">基本称职</van-radio>
        <van-radio name="4" class="radioItem">不称职</van-radio>
      </van-radio-group>
    </div>
    <!-- <van-dialog v-model:show="show" title="标题" show-cancel-button>
      <iframe src="/test.pdf" frameborder="0" style="width: 100vw; height: 80vh"></iframe>
    </van-dialog> -->
  </div>
</template>

<script>
import {
  Button,
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
  Dialog
} from "vant";
import { reactive, ref, provide } from "vue";
import { rate, rateMember, getUrl } from "@/apis/reportForm";
export default {
  name: "FormItem",
  components: {
    [Button.name]: Button,
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
    [Dialog.Component.name]: Dialog.Component,

  },
  props: {
    rateItem: Object,
    formInfo: Object,
    deptType: String,
    deptName: String,
    targetType: {
      default: 0,
      type: Number
    }, // 用来区分是部门还是成员打分
  },
  emits: ['updateScore'],
  setup(props, { emit }) {
    const show = ref(false)
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
      if (props.targetType !== 1) {
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
      } else {
        switch (checked) {
          case "1":
            valueRange.currentValue = 90;
            setRange(90, 100);
            break;
          case "2":
            valueRange.currentValue = 80;
            setRange(70, 89);
            break;
          case "3":
            valueRange.currentValue = 60;
            setRange(60, 69);
            break;
          case "4":
            valueRange.currentValue = 50;
            setRange(50, 59);
            break;
        }
      }
    };

    const setRange = (min, max) => {
      valueRange.max = max;
      valueRange.min = min;
    };

    const initChecked = () => {
      let val = valueRange.currentValue
      if (props.targetType !== 1) {
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
        } else if (val > 0) {
          checked.value = "5";
          setRange(50, 59);
        } else {
          // 没打分
          checked.value = ""
          // setRange(-1, -1);
        }
      } else {
        if (val >= 90) {
          checked.value = "1";
          setRange(90, 100);
        } else if (val >= 70) {
          checked.value = "2";
          setRange(70, 89);
        } else if (val >= 60) {
          checked.value = "3";
          setRange(60, 69);
        } else if (val > 0) {
          checked.value = "4";
          setRange(50, 59);
        } else {
          // 没打分
          checked.value = ""
          // setRange(-1, -1);
        }
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
      if (props.targetType === 1) {
        const condition = {
          time_string: props.formInfo.time_string,
          token: props.formInfo.token,
          id: props.rateItem.id,
          score: valueRange.currentValue,
          name: props.rateItem.label
        };
        rateMember(condition).then((resp) => {
          if (resp.status === 200) {
            // TODO
            // 向外提示更新整体数据
            emit('updateScore')
          } else {
            Notify({ type: "warning", message: "评分提交失败，请联系管理员" });
          }
        });
        return
      } else {
        const condition = {
          time_string: props.formInfo.time_string,
          token: props.formInfo.token,
          id: props.rateItem.id,
          score: valueRange.currentValue,
          no: props.rateItem.value
        };
        rate(condition).then((resp) => {
          if (resp.status === 200) {
            // TODO
            // 向外提示更新整体数据
            emit('updateScore')
          } else {
            Notify({ type: "warning", message: "评分提交失败，请联系管理员" });
          }
        });
      }
    }, 1500);

    const handleStepperChange = () => {
      stepperChange();
    };

    const checkReport = (name) => {
      // show.value = true
      console.log(props.deptName)
      const condition = {
        dept:props.deptName,
        member:name
      }
      getUrl(condition).then(resp=>{
        let url = resp.data
        // alert(url)
        window.location = url
        // window.open(url,'_blank')
      })
    }


    return { show, checked, valueRange, scoreShow, handleCheckedChange, handleStepperChange, checkReport };
  },
};
</script>

<style scoped>
.group {
  align-content: space-around;
  height: 80px;
}

.radioItem {
  margin-left: 5%;
}

.scoreCenter {
  margin-left: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.report {
  margin-left: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

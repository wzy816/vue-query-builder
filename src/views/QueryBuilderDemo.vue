<template>
  <div class="demo-wrap">
    <div class="title">demo</div>
    <div class="subtitle">query builder</div>
    <div class="condition-builder">
      <GroupExpression
        v-bind:meta="meta"
        v-bind:id="rootGroupExpressionId"
        @changed="handleRootGroupChange"
      />
    </div>
    <div class="output-json-title">
      <div class="subtitle">query json</div>
      <div class="subtitle">query sql where</div>
    </div>
    <div class="output-json">
      <pre v-text="rootGroupJson"></pre>
      <div v-text="rootGroupSQL"></div>
    </div>
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
import GroupExpression from "../components/GroupExpression.vue";
export default {
  name: "QueryBuilderDemo",
  components: { GroupExpression },
  data() {
    return {
      meta: {},
      rootGroupExpressionId: "",
      rootGroupJson: "",
      rootGroupSQL: "",
    };
  },
  computed: {},
  created() {
    this.getMeta();
    this.rootGroupExpressionId = uuidv4();
  },
  methods: {
    parseNode(node, level) {
      let nl = "\n";
      let indent = " ".repeat(level * 4);
      if (node.type == "group") {
        let ret = "";
        for (let [index, child] of node.data.children.entries()) {
          if (index != 0) {
            ret += " " + indent + node.data.op + nl;
          }
          ret += this.parseNode(child, level + 1);
        }
        if (node.data.children.length > 1) {
          ret = indent + "(" + nl + ret;
          ret += indent + ")" + nl;
        }
        return ret;
      }
      if (node.type == "rule") {
        let d = node.data;

        let ret = d.field + " ";

        const opSymbol = this.meta.operators.filter(
          (op) => op.value == d.operator
        )[0]["symbol"];
        ret += opSymbol + " ";

        let val = d.value;
        const valType = this.meta.labels.filter(
          (l) => l.field.value == d.field
        )[0]["value"]["type"];

        if (valType === "string") {
          val = '"' + val + '"';
        } else if (valType == "enum_string") {
          val = val.map((v) => '"' + v + '"').join(",");
        } else if (valType == "date_range") {
          val = '"' + val[0] + '"' + " and " + '"' + val[1] + '"';
        }
        if (d.operator == "in" || d.operator == "notIn") {
          val = "( " + val + " )";
        }
        ret += val;

        return indent + "( " + ret + " )" + nl;
      }
    },
    getMeta() {
      const meta = {
        operators: [
          { name: "等于", value: "equals", symbol: "==" },
          { name: "不等于", value: "notEquals", symbol: "!=" },
          { name: "小于", value: "less", symbol: "<" },
          { name: "小于等于", value: "lessOrEquals", symbol: "<=" },
          { name: "大于", value: "greater", symbol: ">" },
          { name: "大于等于", value: "greaterOrEquals", symbol: ">=" },
          { name: "包括", value: "in", symbol: "in" },
          { name: "不包括", value: "notIn", symbol: "not in" },
          { name: "之间", value: "between", symbol: "between" },
        ],
        labels: [
          {
            field: {
              name: "车牌",
              value: "vehicle_id",
            },
            operators: ["equals", "notEquals"],
            value: {
              type: "string",
            },
          },
          {
            field: {
              name: "采集日期",
              value: "collect_date",
            },
            operators: ["between"],
            value: {
              type: "date_range",
            },
          },
          {
            field: {
              name: "天气",
              value: "weather",
            },
            operators: ["in", "notIn"],
            value: {
              type: "enum_string",
              const: ["阴天", "雨天", "晴天", "雪天", "雾天"],
            },
          },
          {
            field: {
              name: "障碍物总数",
              value: "obstacle_total",
            },
            operators: [
              "equals",
              "less",
              "lessOrEquals",
              "greater",
              "greaterOrEquals",
            ],
            value: {
              type: "integer",
            },
          },
          {
            field: {
              name: "是否有调头",
              value: "u_turn",
            },
            operators: ["equals"],
            value: {
              type: "boolean",
            },
          },
          {
            field: {
              name: "车速区间 kph",
              value: "speed_range",
            },
            operators: ["in", "notIn"],
            value: {
              type: "enum_string",
              const: [
                "0-10",
                "10-20",
                "20-30",
                "30-40",
                "40-50",
                "50-60",
                "60-70",
                "70-80",
                "80-90",
                "90-100",
                "100-110",
                "110-120",
                "120-130",
                "130-140",
                "140-150",
                "150-160",
                "160-170",
                "170-180",
                "180-190",
                "190-200",
              ],
            },
          },
        ],
      };
      this.meta = meta;
    },
    handleRootGroupChange(val) {
      const val2 = JSON.parse(
        JSON.stringify(val, (k, v) => (k === "id" ? undefined : v))
      );
      this.rootGroupJson = JSON.stringify(val2, null, 2);
      this.rootGroupSQL = this.parseNode(val2, 1);
    },
  },
};
</script>

<style type="text/scss" lang="scss" scoped>
@import "@/assets/style/bd.scss";
.demo-wrap {
  @include bd-flex-column;
  padding: 20px;

  .title {
    margin: 20px 0;
    font-size: 24px;
    font-weight: 700;
    margin: auto;
  }
  .subtitle {
    margin: 20px 0;
    font-size: 24px;
    font-weight: 700;
    margin-right: auto;
  }
  .output-json-title {
    @include bd-flex-row;
    width: 100%;
    .subtitle {
      width: 50%;
    }
  }
  .output-json {
    @include bd-flex-row;
    width: 100%;
    pre,
    div {
      width: 50%;
      white-space: pre-wrap;
    }
  }
}
</style>

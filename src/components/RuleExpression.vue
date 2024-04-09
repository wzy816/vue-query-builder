<template>
  <div class="rule-expression-wrap">
    <div class="field-wrap">
      <el-select
        v-model="selectedLabel"
        filterable
        placeholder="选择字段"
        @change="emit"
      >
        <el-option
          v-for="label in meta.labels"
          :key="label.field.value"
          :label="label.field.name"
          :value="label"
        />
      </el-select>
    </div>
    <el-select
      v-model="selectedOperator"
      class="operator-wrap"
      placeholder="选择操作符"
      @change="emit"
    >
      <el-option
        v-for="op in allowedOperators"
        :key="op.value"
        :label="op.name"
        :value="op.value"
      />
    </el-select>
    <div class="value-wrap">
      <component
        class="value-component"
        v-bind:is="curValueComponent"
        v-bind:meta="valueMeta"
        @changed="updateSelectedValue"
      />
    </div>
  </div>
</template>

<script>
import ValueDateRange from "../components/ValueDateRange.vue";
import ValueInput from "../components/ValueInput.vue";
import ValueMultiSelect from "../components/ValueMultiSelect.vue";
import ValueRadio from "../components/ValueRadio.vue";
export default {
  name: "RuleExpression",
  components: {
    ValueInput,
    ValueMultiSelect,
    ValueRadio,
    ValueDateRange,
  },
  props: {
    meta: {
      type: Object,
      default: function () {
        return {};
      },
    },
    id: {
      type: String,
      default: function () {
        return "";
      },
    },
  },
  data() {
    return {
      selectedLabel: undefined,
      selectedOperator: undefined,
      selectedValue: undefined,
    };
  },

  computed: {
    allowedOperators: function () {
      if (this.selectedLabel) {
        const all_ops = this.meta.operators;
        return all_ops.filter((op) =>
          this.selectedLabel.operators.includes(op.value)
        );
      }
      return [];
    },
    valueMeta: function () {
      if (this.selectedLabel) {
        return this.selectedLabel.value;
      }
      return undefined;
    },
    curValueComponent: function () {
      let ret = "value-input";
      if (this.selectedLabel) {
        const vt = this.selectedLabel.value.type;
        const comp_map = {
          string: "value-input",
          enum_string: "value-multi-select",
          integer: "value-input",
          boolean: "value-radio",
          date_range: "value-date-range",
        };
        ret = comp_map[vt];
      }
      return ret;
    },
  },
  watch: {
    selectedLabel: function () {
      this.selectedOperator = undefined;
      this.selectedValue = undefined;
      this.$nextTick(() => {
        if (this.allowedOperators.length >= 1) {
          this.selectedOperator = this.allowedOperators[0].value;
        }
      });
    },
    selectedOperator: function () {
      this.selectedValue = undefined;
    },
  },
  created() {},
  methods: {
    updateSelectedValue: function (val) {
      this.selectedValue = val;
      this.emit();
    },
    emit: function () {
      if (
        this.selectedLabel != undefined &&
        this.selectedOperator != undefined &&
        this.selectedValue != undefined
      ) {
        this.$emit("changed", {
          id: this.id,
          type: "rule",
          data: {
            field: this.selectedLabel.field.value,
            operator: this.selectedOperator,
            value: this.selectedValue,
          },
        });
      }
    },
  },
};
</script>

<style type="text/scss" lang="scss" scoped>
@import "@/assets/style/bd.scss";
.rule-expression-wrap {
  @include bd-flex-row;

  .field-wrap {
    width: 140px;
  }
  .operator-wrap {
    width: 120px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .value-wrap {
    @include bd-flex-center;
    flex-grow: 1;
    .value-component {
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="wrap">
    <el-date-picker
      v-model="value"
      :default-time="['00:00:00', '23:59:59']"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      type="daterange"
      value-format="yyyy-MM-dd"
      @change="handler"
    />
  </div>
</template>
<script>
export default {
  name: "ValueDateRange",
  props: {
    meta: {
      type: Object,
      default: function () {
        return { type: undefined };
      },
    },
  },
  data() {
    return {
      value: undefined,
    };
  },
  watch: {},
  methods: {
    handler() {
      if (this.value != undefined) {
        this.$emit("changed", this.value);
      }
    },
  },
};
</script>
<style type="text/scss" lang="scss" scoped>
@import "@/assets/style/bd.scss";
.wrap {
  @include bd-flex-row;
  align-items: center;
  justify-content: start;

  height: 32px;
}
</style>

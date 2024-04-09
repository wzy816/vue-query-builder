<template>
  <el-radio-group class="wrap" v-model="value" v-on:input="handler">
    <el-radio :label="1">是</el-radio>el-radio>
    <el-radio :label="2">否</el-radio>el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: "ValueRadio",
  props: {},
  data() {
    return {
      value: undefined,
    };
  },
  methods: {
    handler() {
      if (this.value == "1") {
        this.$emit("changed", true);
      }
      if (this.value == "2") {
        this.$emit("changed", false);
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

  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0px 20px;
  height: 32px;
}
</style>

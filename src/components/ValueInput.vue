<template>
  <el-input v-model="value" placeholder="请输入值" @input="handler" />
</template>

<script>
export default {
  name: "ValueInput",
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

  methods: {
    handler() {
      if (this.value != undefined && this.value != "" && this.meta) {
        if (this.meta.type == "integer") {
          this.$emit("changed", parseInt(this.value));
        }
        if (this.meta.type == "string") {
          this.$emit("changed", this.value);
        }
      }
    },
  },
};
</script>
<style type="text/scss" lang="scss" scoped></style>

<template>
  <el-select v-model="value" multiple @change="handler" placeholder="请选择值">
    <el-option
      v-for="e in options"
      :key="e.value"
      :label="e.name"
      :value="e.value"
    />
  </el-select>
</template>

<script>
export default {
  name: "ValueMultiSelect",
  props: {
    meta: {
      type: Object,
      default: function () {
        return {
          type: undefined,
          const: [],
        };
      },
    },
  },
  data() {
    return {
      value: undefined,
    };
  },
  computed: {
    options: function () {
      if (this.meta && this.meta.const && Array.isArray(this.meta.const)) {
        return this.meta.const.map((c) => ({ name: c, value: c }));
      }
      return [];
    },
  },
  methods: {
    handler() {
      this.$emit("changed", this.value);
    },
  },
};
</script>
<style type="text/scss" lang="scss" scoped></style>

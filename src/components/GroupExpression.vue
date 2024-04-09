<template>
  <div
    class="group-expression-wrap"
    v-bind:class="{ 'no-children': this.children.length == 0 }"
  >
    <div class="toolbar-wrap">
      <div class="add-rule" @click="addRule">
        <i class="el-icon-plus"></i>
      </div>
      <div class="add-group" @click="addGroup">
        <i class="el-icon-plus circled-button"></i>
      </div>
    </div>
    <div class="body-wrap">
      <div class="op-wrap">
        <div v-if="moreThanOneChild" class="top-bracket" />
        <el-radio-group
          v-model="selectedLogicalOperator"
          :disabled="!moreThanOneChild"
          @input="handleLogicalOperatorChange"
        >
          <el-radio-button label="和" />
          <el-radio-button label="或" />
        </el-radio-group>
        <div v-if="moreThanOneChild" class="bottom-bracket" />
      </div>
      <div class="children-wrap">
        <div class="child-wrap" v-for="node in children" :key="node.id">
          <component
            class="expression-wrap"
            v-bind:is="curChildComponent(node)"
            v-bind:meta="meta"
            v-bind:id="node.id"
            @changed="updateChildren"
          />
          <div class="delete-btn" @click="deleteNode(node.id)">
            <i v-if="node.type == 'rule'" class="el-icon-minus"></i>
            <i
              v-if="node.type == 'group'"
              class="el-icon-minus circled-button"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import GroupExpression from "../components/GroupExpression.vue";
import RuleExpression from "../components/RuleExpression.vue";

export default {
  name: "GroupExpression",
  components: {
    GroupExpression,
    RuleExpression,
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
      selectedLogicalOperator: "和",
      children: [],
    };
  },
  computed: {
    moreThanOneChild: function () {
      return this.children.length > 1;
    },
  },
  watch: {
    children: function () {
      this.emit();
    },
    selectedLogicalOperator: function () {
      this.emit();
    },
  },
  created() {
    this.addRule();
  },
  methods: {
    addRule: function () {
      const rule = {
        id: uuidv4(),
        data: {},
        type: "rule",
      };
      this.children.push(rule);
    },
    addGroup: function () {
      const group = {
        id: uuidv4(),
        data: {},
        type: "group",
      };
      this.children.push(group);
    },
    deleteNode: function (id) {
      this.children = this.children.filter((node) => node.id != id);
    },
    curChildComponent: function (node) {
      if (node.type == "rule") {
        return "rule-expression";
      }
      if (node.type == "group") {
        return "group-expression";
      }
    },
    handleLogicalOperatorChange() {
      this.emit();
    },
    updateChildren(val) {
      for (let child of this.children) {
        if (child.id == val.id) {
          child.data = { ...val.data };
        }
      }
      this.emit();
    },
    emit() {
      if (this.children.length == 0) {
        return;
      }
      for (let child of this.children) {
        if (Object.keys(child.data).length === 0) {
          return;
        }
      }

      this.$emit("changed", {
        id: this.id,
        type: "group",
        data: {
          op: this.selectedLogicalOperator == "和" ? "and" : "or",
          children: Array.from(this.children),
        },
      });
    },
  },
};
</script>

<style type="text/scss" lang="scss" scoped>
@import "@/assets/style/bd.scss";

.group-expression-wrap {
  @include bd-flex-column;

  border-radius: 6px;
  &.no-children {
    border-color: #ff0000;
  }
  border: 1px solid #dcdfe6;
  padding: 8px;

  .toolbar-wrap {
    @include bd-flex-row;
    align-items: center;
    justify-content: start;

    height: 32px;
    .add-rule {
      @include bd-hover-pointer;
    }
    .add-group {
      @include bd-hover-pointer;
      margin-left: 8px;
    }
  }
  .body-wrap {
    @include bd-flex-row;
    min-width: 90px;
    .op-wrap {
      @include bd-flex-column;
      align-items: end;
      justify-content: center;
      min-height: 52px;

      .top-bracket {
        width: 50%;
        flex-grow: 1;
        margin-top: 10px;
        margin-bottom: 10px;
        border-left: 1px solid #dcdfe6;
        border-top: 1px solid #dcdfe6;
        border-top-left-radius: 6px;
      }
      .bottom-bracket {
        flex-grow: 1;
        width: 50%;
        margin-top: 10px;
        margin-bottom: 10px;
        border-left: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        border-bottom-left-radius: 6px;
      }
    }
    .children-wrap {
      @include bd-flex-column;
      margin-left: 8px;

      .child-wrap {
        @include bd-flex-row;
        align-items: start;
        justify-content: center;

        .expression-wrap {
          flex-grow: 1;
          margin: 10px 0;
        }
        .delete-btn {
          margin-top: 16px;
          margin-left: 8px;
          @include bd-hover-pointer;
        }
      }
    }
  }
  .circled-button {
    border-radius: 50%;
    outline: 1px solid #54585a;
  }
}
</style>

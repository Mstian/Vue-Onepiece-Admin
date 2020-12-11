<template>
  <div class="hello">
    <h1>{{ msg + " " + obj.title }}</h1>

    <div>这是一个子组件，子父组件通信使用 provide inject 非常方便 {{obj.title}}就是从父组件中接收到的</div>
  </div>
</template>

<script lang="ts">
// import { Options, Vue } from "vue-class-component";
import {inject} from 'vue';
export default {
  props: {
    msg: String
  },
  setup(props: any) {
    const obj = inject('obj');
    return {
      obj
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

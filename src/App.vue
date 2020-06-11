<template>
  <div id="app">
    <!-- <div class="container mx-auto"> -->
    <tabs class="bg-gray-200" />
    <!-- </div> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";

import Tabs from "./components/Tabs.vue";

export default {
  name: "App",
  components: {
    Tabs
  },
  mounted(){
    this.GET_DEVICES();
  },
  methods: {
    ...mapActions("pushbullet", ["GET_DEVICES"]),
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.svg-icon {
  width: 1em;
  height: 1em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: #4691f6;
}

.svg-icon circle {
  stroke: #4691f6;
  stroke-width: 1;
}
</style>

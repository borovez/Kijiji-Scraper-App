<template>
  <transition name="fade">
    <div
      v-if="isVisible"
      class="cursor-pointer fixed transition bottom-0 right-0 m-8 bg-white rounded-lg shadow-md w-10 h-10 flex items-center justify-center z-50"
      @click="scrolltop"
    >
      <svg class="svg-icon transform -rotate-90 w-6 h-6" viewBox="0 0 20 20">
        <path
          fill="none"
          d="M14.989,9.491L6.071,0.537C5.78,0.246,5.308,0.244,5.017,0.535c-0.294,0.29-0.294,0.763-0.003,1.054l8.394,8.428L5.014,18.41c-0.291,0.291-0.291,0.763,0,1.054c0.146,0.146,0.335,0.218,0.527,0.218c0.19,0,0.382-0.073,0.527-0.218l8.918-8.919C15.277,10.254,15.277,9.784,14.989,9.491z"
        />
      </svg>
    </div>
  </transition>
</template>
<script>
export default {
  name: "scrolltop",
  props: {
    element: { required: true, default: null }
  },
  data() {
    return {
      scrollPosition: 0,
      isVisible: false
    };
  },
  mounted() {
    let self = this;
    this.$nextTick(()=> {
      if(self.element == null) return;
      if (self.element.scrollTop <= 100) {
        self.isVisible = false;
      } else {
        self.isVisible = true;
      }
      self.element.addEventListener("scroll", self.handleScroll);
    })

  },
  destroyed() {
    this.element.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll: function() {
      if (this.element.scrollTop <= 20) {
        this.isVisible = false;
      } else {
        this.isVisible = true;
      }
    },
    scrolltop: function() {
      let self = this;
      this.$nextTick(() => {
        self.element.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      });
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
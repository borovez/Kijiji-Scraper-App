<template>
  <div class="mb-6">
    <div class="bg-white mx-auto shadow-md rounded-t-lg flex flex-row">
      <div class="hidden sm:block p-3 pr-0">
        <div
          class="bg-gray-100 flex-none relative overflow-hidden mb-0 rounded-lg w-32 h-32 border flex items-center justify-center"
        >
          <img
            class="absolute w-full object-cover cursor-pointer"
            v-show="ad.image"
            @click="showImage = true"
            :src="ad.images[0]"
          />
        </div>
      </div>
      <div
        v-show="showImage"
        class="fixed inset-auto w-full h-full bg-black top-0 left-0 z-50 opacity-50 cursor-pointer"
        style="z-index:99999"
        @click="showImage = false"
      ></div>
      <img
        @click="showImage = false"
        v-show="showImage"
        :src="ad.images[0]"
        style="z-index:100000"
        class="fixed inset-0 justify-center items-center z-50 m-auto p-6 max-h-full max-w-full cursor-pointer"
      />
      <div class="sm:flex sm:items-start p-3  flex-1">
        <div class="text-left sm:flex-grow">
          <div class="relative flex flex-row min-w-full justify-between">
            <div>
              <a :href="ad.url" target="_blank" class="text-xl leading-tight">{{ad.title}}</a>
            </div>
          </div>
          <div class="flex flex-row items-center flex-wrap">
            <p class="text-3xl leading-tight text-black font-bold">${{ad.attributes.price}}</p>
            <span
              class="text-md leading-tight text-black font-bold w-auto rounded-full bg-gray-200 py-1 px-2 mx-3"
            >{{ad.attributes.type}}</span>
            <div class="flex flex-row p-3 pl-0">
              <div title="Visits"
                class="text-md leading-tight text-black font-bold py-1 px-2 mr-3 text-center rounded-full bg-gray-200"
              >{{ad.attributes.visits ? ad.attributes.visits : 0}}</div>
              <div title="Age"
                class="text-md leading-tight text-black font-bold py-1 px-2 text-center rounded-full bg-gray-200"
              >{{adAge}}</div>
            </div>
          </div>
          <a
            :href="`http://maps.google.com/?q=${ad.attributes.location.mapAddress}`"
            target="_blank"
            class="text-md leading-tight text-gray-500 inline-block align-middle"
          >
            {{ad.attributes.location.mapAddress}}
            <svg
              class="svg-icon align-middle inline-block"
              viewBox="0 0 20 20"
            >
              <path
                fill="none"
                d="M16.198,10.896c-0.252,0-0.455,0.203-0.455,0.455v2.396c0,0.626-0.511,1.137-1.138,1.137H5.117c-0.627,0-1.138-0.511-1.138-1.137V7.852c0-0.626,0.511-1.137,1.138-1.137h5.315c0.252,0,0.456-0.203,0.456-0.455c0-0.251-0.204-0.455-0.456-0.455H5.117c-1.129,0-2.049,0.918-2.049,2.047v5.894c0,1.129,0.92,2.048,2.049,2.048h9.488c1.129,0,2.048-0.919,2.048-2.048v-2.396C16.653,11.099,16.45,10.896,16.198,10.896z"
              />
              <path
                fill="none"
                d="M14.053,4.279c-0.207-0.135-0.492-0.079-0.63,0.133c-0.137,0.211-0.077,0.493,0.134,0.63l1.65,1.073c-4.115,0.62-5.705,4.891-5.774,5.082c-0.084,0.236,0.038,0.495,0.274,0.581c0.052,0.019,0.103,0.027,0.154,0.027c0.186,0,0.361-0.115,0.429-0.301c0.014-0.042,1.538-4.023,5.238-4.482l-1.172,1.799c-0.137,0.21-0.077,0.492,0.134,0.629c0.076,0.05,0.163,0.074,0.248,0.074c0.148,0,0.294-0.073,0.382-0.207l1.738-2.671c0.066-0.101,0.09-0.224,0.064-0.343c-0.025-0.118-0.096-0.221-0.197-0.287L14.053,4.279z"
              />
            </svg>
          </a>
          <p class="text-sm leading-tight text-gray-500">{{ad.date | moment("dddd, MMMM Do YYYY")}}</p>
          <div
            class="text-md leading-tight text-grey-dark mt-2 hidden lg:inline-block"
            style="overflow-wrap: anywhere;"
          >{{ad.description | truncate(300) }}</div>
        </div>
      </div>
    </div>
    <div class="relative shadow rounded-b-lg" v-on-clickaway="closeDescription">
      <div
        @click="isDescriptionToggled = !isDescriptionToggled"
        :class="{'rounded-b-lg' : !isDescriptionToggled}"
        class="w-full p-2 text-sm bg-gray-200 hover:bg-gray-300 flex justify-center items-center relative group cursor-pointer select-none"
      >
        <span>Read Full Description</span>
        <svg
          class="text-gray-500 absolute right-0 mx-2 h-5 w-5 group-hover:text-gray-800 group-focus:text-gray-800 transition ease-in-out duration-150"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div
        v-show="isDescriptionToggled"
        class="text-left absolute shadow-xl select-auto bg-gray-100 rounded-b-lg p-3 w-full"
        style="top:100%; z-index:1"
      >
        <perfect-scrollbar class="max-h-500 overflow-auto">
          <p class="px-6 py-4 select-auto">{{ad.description}}</p>
        </perfect-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
//https://sendpulse.com/features/webpush
//https://www.pushbullet.com/
import { mixin as clickaway } from "vue-clickaway";
import moment from "moment";
require("moment-duration-format");

export default {
  name: "card",
  mixins: [clickaway],
  props: {
    ad: Object
  },
  data() {
    return {
      isDescriptionToggled: false,
      showImage: false,
      ageInterval: null,
      adAge: 0
    };
  },
  computed: {},
  mounted() {
    this.$forceUpdate();
    this.calcAge();

    this.ageInterval = setInterval(() => {
      this.calcAge();
    }, 1000);
  },
  methods: {
    calcAge: function() {
      let duration = moment.duration(moment().diff(moment(this.ad.date)));
      this.adAge = duration.format("DD:HH:mm");
    },
    closeDescription: function() {
      this.isDescriptionToggled = false;
    }
  },
  beforeDestroy() {
    clearInterval(this.ageInterval);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="postcss" scoped>
h3 {
  @apply text-blue-600;
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
  @apply text-blue-600;
}
</style>

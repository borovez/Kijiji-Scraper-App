<template>
  <div v-show="tab.isActive" :id="`tab-content-${tab.id}`">
    <div class="flex flex-row min-w-full items-stretch">
      <div
        class="sidebar flex-none bg-white border-r-2 z-50 h-auto overflow-y-auto"
        :class="{'open':sidebarOpen}"
      >
        <div class="flex flex-row bg-white h-16 border-b-2 items-center">
          <button class="md:hidden p-2 ml-3" @click="sidebarOpen = !sidebarOpen">
            <svg class="svg-icon h-6 w-6" viewBox="0 0 20 20">
              <path
                fill="none"
                d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"
              />
            </svg>
          </button>
          <div class="flex flex-col flex-1 ml-3">
            <div v-if="tab.lastUpdate" class="text-sm text-left flex-initial">
              <strong>Last Updated:&nbsp;</strong>
              <em>{{tab.lastUpdate | moment("MMM/DD/YY H:mm")}}</em>
            </div>
            <div v-if="duration != null && duration > 0" class="text-sm text-left flex-initial">
              <strong>Next Update:&nbsp;</strong>
              <em>{{ time }}</em>
            </div>
          </div>
          <button
            class="p-2 bg-gray-200 flex justify-center items-center ml-3 hover:bg-gray-300 rounded-full mr-3 md:mr-0"
            :class="{'pointer-events-none' : tab.isLoading, 'pointer-events-none opacity-50' : !tab.keywords}"
            @click="update"
            v-tooltip="{
                        content: 'Force Update',
                        trigger: 'hover',
                        placement: 'bottom',
                        popperOptions: {
                          modifiers: {
                            preventOverflow: {
                              boundariesElement: 'offsetParent',
                            },
                          },
                        },
                      }"
          >
            <div
              v-if="tab.isLoading"
              class="loader flex-initial ease-linear rounded-full border-2 border-t-2 border-white h-6 w-6 inset-0 inline-block"
            ></div>
            <svg v-else class="svg-icon w-6 h-6" viewBox="0 0 20 20">
              <path
                fill="none"
                d="M3.254,6.572c0.008,0.072,0.048,0.123,0.082,0.187c0.036,0.07,0.06,0.137,0.12,0.187C3.47,6.957,3.47,6.978,3.484,6.988c0.048,0.034,0.108,0.018,0.162,0.035c0.057,0.019,0.1,0.066,0.164,0.066c0.004,0,0.01,0,0.015,0l2.934-0.074c0.317-0.007,0.568-0.271,0.56-0.589C7.311,6.113,7.055,5.865,6.744,5.865c-0.005,0-0.01,0-0.015,0L5.074,5.907c2.146-2.118,5.604-2.634,7.971-1.007c2.775,1.912,3.48,5.726,1.57,8.501c-1.912,2.781-5.729,3.486-8.507,1.572c-0.259-0.18-0.618-0.119-0.799,0.146c-0.18,0.262-0.114,0.621,0.148,0.801c1.254,0.863,2.687,1.279,4.106,1.279c2.313,0,4.591-1.1,6.001-3.146c2.268-3.297,1.432-7.829-1.867-10.101c-2.781-1.913-6.816-1.36-9.351,1.058L4.309,3.567C4.303,3.252,4.036,3.069,3.72,3.007C3.402,3.015,3.151,3.279,3.16,3.597l0.075,2.932C3.234,6.547,3.251,6.556,3.254,6.572z"
              />
            </svg>
          </button>
        </div>

        <div class="px-6 pb-12 text-left">
          <div class="font-medium text-lg my-3 flex items-center">
            <svg class="svg-icon inline mr-3 text-3xl" viewBox="0 0 20 20">
              <path
                fill="none"
                d="M2.25,12.584c-0.713,0-1.292,0.578-1.292,1.291s0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291S2.963,12.584,2.25,12.584z M2.25,14.307c-0.238,0-0.43-0.193-0.43-0.432s0.192-0.432,0.43-0.432c0.238,0,0.431,0.193,0.431,0.432S2.488,14.307,2.25,14.307z M5.694,6.555H18.61c0.237,0,0.431-0.191,0.431-0.43s-0.193-0.431-0.431-0.431H5.694c-0.238,0-0.43,0.192-0.43,0.431S5.457,6.555,5.694,6.555z M2.25,8.708c-0.713,0-1.292,0.578-1.292,1.291c0,0.715,0.579,1.292,1.292,1.292c0.713,0,1.292-0.577,1.292-1.292C3.542,9.287,2.963,8.708,2.25,8.708z M2.25,10.43c-0.238,0-0.43-0.192-0.43-0.431c0-0.237,0.192-0.43,0.43-0.43c0.238,0,0.431,0.192,0.431,0.43C2.681,10.238,2.488,10.43,2.25,10.43z M18.61,9.57H5.694c-0.238,0-0.43,0.192-0.43,0.43c0,0.238,0.192,0.431,0.43,0.431H18.61c0.237,0,0.431-0.192,0.431-0.431C19.041,9.762,18.848,9.57,18.61,9.57z M18.61,13.443H5.694c-0.238,0-0.43,0.193-0.43,0.432s0.192,0.432,0.43,0.432H18.61c0.237,0,0.431-0.193,0.431-0.432S18.848,13.443,18.61,13.443z M2.25,4.833c-0.713,0-1.292,0.578-1.292,1.292c0,0.713,0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291C3.542,5.412,2.963,4.833,2.25,4.833z M2.25,6.555c-0.238,0-0.43-0.191-0.43-0.43s0.192-0.431,0.43-0.431c0.238,0,0.431,0.192,0.431,0.431S2.488,6.555,2.25,6.555z"
              />
            </svg>Parameters
          </div>
          <div class="border-b-2 w-full my-3"></div>

          <!-- @keyup.enter="update" -->
          <form @change="SAVE" @keyup.enter="update">
            <label class="block mb-5" @click="$refs.tabname.focus()">
              <div class="mb-3 text-sm font-bold">Name:</div>
              <input
                ref="tabname"
                class="font-medium text-lg px-3 py-2 border w-full block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                v-model="tab.name"
              />
            </label>

            <label class="block mb-5" @click="$refs.keywords.focus()">
              <div class="mb-3 text-sm font-bold">Keywords:</div>
              <input
                ref="keywords"
                class="font-medium text-lg px-3 py-2 border w-full block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                v-model="tab.keywords"
              />
            </label>
            <!-- <label class="mb-2" @click="$refs.sortby.focus()">
            <div class="mb-3 text-sm font-bold">Sort by:</div>
            <div class="inline-block relative w-full mb-2">
              <select
                ref="sortby"
                v-model="tab.sortByName"
                class="font-medium text-lg px-3 py-2 block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 pr-8 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                @change="saveParams"
                @keyup.enter="update"
              >
                <option
                  v-for="(sort, i) in sortBy"
                  :key="`sort-${i}`"
                  :value="sort.value"
                >{{sort.title}}</option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
            </label>-->
            <!-- {{locations}} -->

            <label class="block mb-5">
              <div class="mb-3 text-sm font-bold">Sort by:</div>
              <v-select
                v-model="tab.sortByName"
                class="select"
                :reduce="label => label.value"
                :options="$store.state.tabs.sortBy"
                :filterable="false"
                @input="SAVE"
                :clearable="false"
                :searchable="false"
                autocomplete="disabled"
              ></v-select>
            </label>

            <label class="block mb-5">
              <div class="mb-3 text-sm font-bold">Location:</div>
              <v-select
                v-model="tab.locationId"
                class="select"
                :reduce="label => label.value"
                @input="SAVE"
                :options="$store.state.tabs.locations"
                :clearable="false"
                :filterable="false"
                :searchable="false"
                autocomplete="disabled"
              ></v-select>
            </label>

            <label class="block mb-5">
              <div class="mb-3 text-sm font-bold">Update Interval:</div>
              <v-select
                v-model="tab.updateInterval"
                class="select"
                :reduce="label => label.value"
                :options="$store.state.tabs.updateIntervals"
                :filterable="false"
                @input="SAVE(); calcNextUpdate();"
                :clearable="false"
                :searchable="false"
                autocomplete="disabled"
              ></v-select>
            </label>

            <!-- <label class="block mb-2">
              <div class="mb-3 text-sm font-bold">Categories:</div>
              <v-select
                class="select"
                label="poop"
                :options="[allCategories]"
                :clearable="false"
                :filterable="false"
                :searchable="false"
                autocomplete="disabled"
                :create-option="cat => ({ title: cat, id: { id: cat.id } })"
                :reduce="book => `${book.title} ${book.id}`"
              >
              </v-select>
            </label>-->
            <div class="font-medium text-lg flex items-center my-3">
              <svg class="svg-icon inline mr-3 text-3xl" viewBox="0 0 20 20">
                <path
                  fill="none"
                  d="M12.361,6.852H7.639C5.9,6.852,4.491,8.262,4.491,10s1.409,3.148,3.148,3.148h4.723c1.738,0,3.148-1.41,3.148-3.148S14.1,6.852,12.361,6.852z M12.361,12.361H7.639c-1.304,0-2.361-1.058-2.361-2.361s1.057-2.36,2.361-2.36h4.723c1.304,0,2.36,1.057,2.36,2.36S13.665,12.361,12.361,12.361z M10,0.949c-4.999,0-9.051,4.053-9.051,9.051S5.001,19.051,10,19.051c4.999,0,9.051-4.053,9.051-9.051S14.999,0.949,10,0.949z M10,18.264c-4.564,0-8.264-3.699-8.264-8.264S5.436,1.736,10,1.736c4.564,0,8.264,3.699,8.264,8.264S14.564,18.264,10,18.264z M7.639,8.819c-0.652,0-1.18,0.528-1.18,1.181s0.528,1.181,1.18,1.181c0.652,0,1.181-0.528,1.181-1.181S8.291,8.819,7.639,8.819z"
                />
              </svg>Filters
            </div>
            <div class="border-b-2 w-full mb-6"></div>
            <toggle
              v-model="tab.isWantedVisible"
              onText="Showing Wanted Ads"
              offText="Hiding Wanted Ads"
              class
            />
          </form>
        </div>
      </div>
      <div class="h-header overflow-auto relative min-h-full w-full" ref="scroll">
        <div
          class="bg-white h-16 shadow-sm w-auto border-b-2 text-left text-gray-600 absolute w-full z-10 top-0 overflow-y-hidden sticky flex items-center relative"
        >
          <button
            class="md:hidden p-2 border-r-2 sticky bg-white left-0 flex items-center justify-center pl-5 pr-5 h-16"
            @click="sidebarOpen = !sidebarOpen"
          >
            <svg class="svg-icon h-6 w-6" viewBox="0 0 20 20">
              <path
                fill="none"
                d="M3.314,4.8h13.372c0.41,0,0.743-0.333,0.743-0.743c0-0.41-0.333-0.743-0.743-0.743H3.314
								c-0.41,0-0.743,0.333-0.743,0.743C2.571,4.467,2.904,4.8,3.314,4.8z M16.686,15.2H3.314c-0.41,0-0.743,0.333-0.743,0.743
								s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,15.2,16.686,15.2z M16.686,9.257H3.314
								c-0.41,0-0.743,0.333-0.743,0.743s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,9.257,16.686,9.257z"
              />
            </svg>
          </button>
          <ul class="p-3 flex items-center overflow-x-auto" style="min-width:max-content">
            <!-- <li>
                <button class="md:hidden p-2" @click="sidebarOpen = !sidebarOpen">
                  <svg class="svg-icon h-6 w-6" viewBox="0 0 20 20">
                    <path
                      fill="none"
                      d="M3.314,4.8h13.372c0.41,0,0.743-0.333,0.743-0.743c0-0.41-0.333-0.743-0.743-0.743H3.314
								c-0.41,0-0.743,0.333-0.743,0.743C2.571,4.467,2.904,4.8,3.314,4.8z M16.686,15.2H3.314c-0.41,0-0.743,0.333-0.743,0.743
								s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,15.2,16.686,15.2z M16.686,9.257H3.314
								c-0.41,0-0.743,0.333-0.743,0.743s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,9.257,16.686,9.257z"
                    />
                  </svg>
                </button>
            </li>-->
            <li
              class="mx-1 bg-gray-200 rounded-full px-3 py-1 mr-5 box-content flex-none"
            >Records: {{ads.length}}</li>
            <template v-if="tab.lastRun">
              <li class>Parameters:</li>
              <li
                v-show="tab.lastRun.keywords"
                class="mx-1 bg-gray-200 rounded-full px-3 py-1 box-content flex-none"
              >{{tab.lastRun.keywords}}</li>
              <li
                v-show="tab.lastRun.sortByName"
                class="mx-1 bg-gray-200 rounded-full px-3 py-1 box-content flex-none"
              >{{$store.state.tabs.sortBy.find(x=> x.value == tab.lastRun.sortByName).label}}</li>
              <li
                v-show="tab.lastRun.locationId"
                class="mx-1 bg-gray-200 rounded-full px-3 py-1 box-content flex-none"
              >{{$store.state.tabs.locations.find(x=> x.value ==tab.lastRun.locationId).label}}</li>
            </template>
          </ul>
        </div>
        <div class="m-6 mb-32 rounded-lg overflow-hidden" v-if="ads">
          <card v-show="ads" v-for="(ad, i) in ads" :key="`ad-${i}`" :ad="ad" />
        </div>
      </div>
    </div>
    <scrolltop :element="$refs.scroll" />
  </div>
</template>


<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import Card from "@/components/Card.vue";
import moment from "moment";
import Scrolltop from "@/components/Scrolltop.vue";
import Toggle from "@/components/inputs/Toggle.vue";

const kijiji = require("kijiji-scraper");

export default {
  name: "Tab",
  components: {
    Card,
    Scrolltop,
    Toggle
  },
  props: {
    id: { required: true }
  },
  data() {
    return {
      event: 0,
      current: 0,
      sidebarOpen: false,
      isToggleOn: true,
      diffTime: 0,
      duration: null
    };
  },
  computed: {
    ...mapGetters([
      "tabs/ads"
    ]),
    ads() {
      return this["tabs/ads"](this.tab.id);
    },
    allLocations() {
      return kijiji.locations;
    },
    allCategories() {
      return kijiji.categories;
    },
    time() {
      var str = "";

      if (this.duration.isValid()) {
        str = this.duration.hours() > 0 ? this.duration.hours() + " hr. " : "";
        str +=
          this.duration.minutes() > 0 ? this.duration.minutes() + " min. " : "";
        str += this.duration.seconds() + " sec.";
      }

      return str;
    },
    tab() {
      return this.$store.getters["tabs/tab"](this.id);
    }
  },
  mounted() {
    this.allLocations;
    this.allCategories;

    if (!this.tab.lastUpdate) return;

    this.setNextUpdateInterval();
  },

  methods: {
    ...mapMutations("tabs", ["SAVE"]),
    ...mapActions("tabs", ["FETCH_ADS", "SEND_NOTIFICATION", "COMPUTE_DELTA"]),
    setNextUpdateInterval: function() {
      let self = this;

      this.calcNextUpdate();

      this.nextUpdateInterval = setInterval(() => {
        if(self.tab.lastUpdate == null) return;
        if (self.duration && (!self.duration.isValid() || self.duration <= 0)) {
          self.update();
        } else {
          self.duration = moment.duration(self.duration - 1000, "milliseconds");
        }
      }, 1000);
    },
    calcNextUpdate: function() {
      if (this.tab && this.tab.lastUpdate) {
        // make it a moment object again
        this.event = moment(this.tab.lastUpdate).add(
          this.tab.updateInterval,
          "minutes"
        );
        // get current time/date
        this.current = moment();
        // get difference between event and current
        this.diffTime = this.event.diff(this.current);
        // let moment.js make the duration out of the timestamp
        this.duration = moment.duration(this.diffTime, "milliseconds", true);

        this.nextUpdate = this.updateInterval;
      }
      if (this.duration < 0) {
        this.duration = 0;
      }
    },
    update() {
      let self = this;

      if (this.tab.isLoading) return;
      if (this.tab.keywords == "") return;

      this.FETCH_ADS({ tabID: self.tab.id })
        .then(res => {
          res?.forEach(r => {
            self.$toast.open({
              message: `<div class="text-lg font-medium">${self.tab.name}</div>
                <div>${r.message}</div>
                <div class="text-sm">Failure: <em>'${r.keyword}'</em></div>`,
              type: "error",
              position: "bottom",
              duration: 10000
            });
          });

          if (self.nextUpdateInterval == null) {
            self.setNextUpdateInterval();
          } else {
            this.calcNextUpdate();
          }
        })
        .catch(error => {
          self.$toast.open({
            message: `<div class="text-lg font-medium">${self.tab.name}</div>
                <div>${error.message}</div>
                <div class="text-sm">Failure: <em>'${error.keyword}'</em></div>`,
            type: "error",
            position: "bottom",
            duration: 10000
          });
        });
    }
  },
  beforeDestroy() {
    clearInterval(this.nextUpdateInterval);
  }
};
</script>

<style lang="postcss">
.sidebar {
  width: 100%;
  @apply absolute;
  height: calc(100vh - 64px) !important;
  border-right: 0;
  transform: translateX(-100%);

  &.open {
    transform: translateX(0);
  }

  @screen md {
    @apply relative;
    transform: translateX(0);

    max-width: 320px;
  }
}
.h-header {
  height: calc(100vh - 64px);
}
</style>
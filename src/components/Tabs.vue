<template>
  <div class="tabs-container">
    <div class="tabs fixed w-full bg-gray-200 top-0">
      <draggable v-model="tabs" class="flex box-content h-16" handle=".handle">
        <li
          class="box-content flex flex items-center relative block h-100 px-3 shadow flex-none group pl-6"
          v-for="(tab,i) in tabs"
          :class="{ 'border-b-2 border-blue-500 bg-white shadow-xl  z-50': tab.isActive, 'border-b-2 bg-gray-100 z-10' : !tab.isActive }"
          :key="`tab-${i}`"
          :id="`tab-${tab.id}`"
          v-tooltip="{
                        content: tabTooltip(tab),
                        trigger: 'hover',
                        placement: 'auto-start',
                        popperOptions: {
                          modifiers: {
                            preventOverflow: {
                              boundariesElement: 'offsetParent',
                            },
                          },
                        },
                      }"
        >
          <div class="handle transform rotate-90 absolute left-0 cursor-move">
            <svg class="svg-icon w-6 h-6" viewBox="0 0 20 20">
              <path
                fill="red"
                d="M3.936,7.979c-1.116,0-2.021,0.905-2.021,2.021s0.905,2.021,2.021,2.021S5.957,11.116,5.957,10
								S5.052,7.979,3.936,7.979z M3.936,11.011c-0.558,0-1.011-0.452-1.011-1.011s0.453-1.011,1.011-1.011S4.946,9.441,4.946,10
								S4.494,11.011,3.936,11.011z M16.064,7.979c-1.116,0-2.021,0.905-2.021,2.021s0.905,2.021,2.021,2.021s2.021-0.905,2.021-2.021
								S17.181,7.979,16.064,7.979z M16.064,11.011c-0.559,0-1.011-0.452-1.011-1.011s0.452-1.011,1.011-1.011S17.075,9.441,17.075,10
								S16.623,11.011,16.064,11.011z M10,7.979c-1.116,0-2.021,0.905-2.021,2.021S8.884,12.021,10,12.021s2.021-0.905,2.021-2.021
								S11.116,7.979,10,7.979z M10,11.011c-0.558,0-1.011-0.452-1.011-1.011S9.442,8.989,10,8.989S11.011,9.441,11.011,10
								S10.558,11.011,10,11.011z"
              />
            </svg>
          </div>
          <div class="group relative flex justify-center items-center">
            <div class="w-6 h-6">
              <div
                v-if="tab.isLoading"
                class="loader flex-initial ease-linear rounded-full border-2 border-t-2 border-gray-200 h-6 w-6 inset-0 inline-block"
              ></div>
              <svg v-else viewBox="0 0 20 20" class="w-6 h-6 svg-icon">
                <path
                  fill="none"
                  d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                />
              </svg>
            </div>
            <a
              :href="tab.href"
              class="inline-block p-4 cursor-pointer"
              @click="selectTab(tab.id)"
            >{{ tab.name | truncate(8)}}</a>

            <div
              class="hidden group-hover:inline-block hover:bg-gray-400 bg-gray-200 absolute p-2 left-0 cursor-pointer rounded-full"
              @click="editTab(i)"
            >
              <svg class="svg-icon w-4 h-4" viewBox="0 0 20 20">
                <path
                  d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"
                />
              </svg>
            </div>
            <div
              class="hover:bg-gray-200 p-2 cursor-pointer rounded-full"
              @click="removeTab(tab.id, i)"
            >
              <svg class="svg-icon w-3 h-3" viewBox="0 0 20 20">
                <path
                  fill="none"
                  d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08
							c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469
							c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304
							c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"
                />
              </svg>
            </div>
            <div
              class="flex justify-center items-center absolute left-10"
              :class="{ 'block': editingIndex == i, 'hidden': editingIndex != i }"
            >
              <form @change="SAVE">
                <input
                  type="text"
                  class="w-full h-5 outline-none border-2 py-4 px-2 mr-3"
                  v-model="tab.name"
                  @blur="editingIndex = undefined"
                  @keyup.enter="editingIndex = undefined"
                  ref="tabinput"
                />
              </form>
            </div>
          </div>
        </li>
        <li
          class="p-4 box-content flex items-center cursor-pointer hover:bg-gray-300"
          @click="addTab"
          v-tooltip="{
            content: 'Add New Tab',
            trigger: 'hover',
            placement: 'bottom-start',
            popperOptions: {
              modifiers: {
                preventOverflow: {
                  boundariesElement: 'offsetParent',
                },
              },
            },
          }"
        >
          <svg class="svg-icon w-6 h-6" viewBox="0 0 20 20">
            <path
              fill="none"
              d="M13.68,9.448h-3.128V6.319c0-0.304-0.248-0.551-0.552-0.551S9.448,6.015,9.448,6.319v3.129H6.319
								c-0.304,0-0.551,0.247-0.551,0.551s0.247,0.551,0.551,0.551h3.129v3.129c0,0.305,0.248,0.551,0.552,0.551s0.552-0.246,0.552-0.551
								v-3.129h3.128c0.305,0,0.552-0.247,0.552-0.551S13.984,9.448,13.68,9.448z M10,0.968c-4.987,0-9.031,4.043-9.031,9.031
								c0,4.989,4.044,9.032,9.031,9.032c4.988,0,9.031-4.043,9.031-9.032C19.031,5.012,14.988,0.968,10,0.968z M10,17.902
								c-4.364,0-7.902-3.539-7.902-7.903c0-4.365,3.538-7.902,7.902-7.902S17.902,5.635,17.902,10C17.902,14.363,14.364,17.902,10,17.902
								z"
            />
          </svg>
        </li>
      </draggable>
      <div class="absolute bottom-0 left-0 w-full border-b-2 z-0"></div>
    </div>
    <div class="relative min-h-screen min-w-screen">
      <div class="tabs-details pt-16" v-if="tabs.length" ref="tabsContainer">
        <tab v-for="(tab,i) in tabs" :key="`tab-details-${i}`" :id="tab.id" :index="i" ref="tabs"></tab>
      </div>
      <div class="absolute w-full h-full pt-16" v-else>
        <div class="flex flex-col justify-center items-center w-full h-full p-6">
          <div class="text-4xl text-gray-500 mb-5 cursor-pointer" @click="addTab">
            <svg class="svg-icon w-16 h-16" viewBox="0 0 20 20">
              <path
                fill="none"
                d="M13.68,9.448h-3.128V6.319c0-0.304-0.248-0.551-0.552-0.551S9.448,6.015,9.448,6.319v3.129H6.319
								c-0.304,0-0.551,0.247-0.551,0.551s0.247,0.551,0.551,0.551h3.129v3.129c0,0.305,0.248,0.551,0.552,0.551s0.552-0.246,0.552-0.551
								v-3.129h3.128c0.305,0,0.552-0.247,0.552-0.551S13.984,9.448,13.68,9.448z M10,0.968c-4.987,0-9.031,4.043-9.031,9.031
								c0,4.989,4.044,9.032,9.031,9.032c4.988,0,9.031-4.043,9.031-9.032C19.031,5.012,14.988,0.968,10,0.968z M10,17.902
								c-4.364,0-7.902-3.539-7.902-7.903c0-4.365,3.538-7.902,7.902-7.902S17.902,5.635,17.902,10C17.902,14.363,14.364,17.902,10,17.902
								z"
              />
            </svg>
          </div>
          <div class="text-4xl text-gray-500 pointer-events-none">Add a new tab to begin</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { mapState, mapActions, mapMutations } from "vuex";
import Tab from "@/components/Tab.vue";

export default {
  components: {
    Tab,
    draggable
  },
  data() {
    return {
      editingIndex: undefined
    };
  },
  computed: {
    tabs: {
      get() {
        return this.$store.getters["tabs/tabs"];
      },
      set(value) {
        this.REORDER_TABS({ tabs: value });
      }
    },
    ...mapState({
      // tabs: state => state.tabs.tabs,
      tabTooltip: function() {
        return tab => {
          let tooltip = `<div class="text-bold text-lg">${tab.name}</div>`;
          if (tab.lastUpdate) {
            tooltip += `<div class="text-sm">Last Update: ${this.$options.filters.moment(
              tab.lastUpdate,
              "MMM/DD/YY H:mm"
            )}</div>`;
          }

          return tooltip
        };
      }
    })
  },
  mounted() {
    // console.log(this.tabs);
  },
  methods: {
    ...mapMutations("tabs", [
      "RENAME_TAB",
      "REORDER_TABS",
      "SELECT_TAB",
      "REMOVE_TAB",
      "ADD_TAB",
      "SAVE"
    ]),
    ...mapActions("tabs", ["NEW_TAB"]),
    selectTab(id) {
      this.SELECT_TAB({ id: id });
    },
    editTab(index) {
      let self = this;
      this.editingIndex = index;

      this.$nextTick(() => {
        self.$refs.tabinput[index].focus();
        self.$refs.tabinput[index].select();
      });
    },
    addTab() {
      let self = this;

      this.ADD_TAB({
        name: "New Tab",
        selected: self.tabs.length == 0,
        isActive: self.tabs.length == 0,
        isLoading: false,
        keywords: "",
        locationId: 1700272,
        categoryId: 0,
        sortByName: "dateDsc",
        lastUpdate: null,
        updateInterval: 5,
        ads: []
      });

      this.SELECT_TAB({ id: this.tabs[this.tabs.length - 1].id });
    },
    removeTab(tab, i) {
      if (this.tabs[i - 1]) {
        this.SELECT_TAB({ id: this.tabs[i - 1].id });
      } else if (this.tabs[i + 1]) {
        this.SELECT_TAB({ id: this.tabs[i + 1].id });
      }
      this.REMOVE_TAB({ tab: tab });
    }
  }
};
</script>

<style lang="postcss" scoped>
.tabs-container {
  /* margin-bottom:-20px */
  overflow: hidden;
}
.tabs {
  z-index: 90000;
  overflow-x: auto;
}
.tabs ul {
  min-width: max-content;
}
</style>
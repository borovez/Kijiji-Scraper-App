const Kijiji = require("kijiji-scraper");

// initial state
export const state = {
  tabs: [],
  sortBy: [
    { label: "Low Price First", value: "priceAsc" },
    { label: "High Price First", value: "priceDsc" },
    { label: "Date Ascending", value: "dateAsc" },
    { label: "Date Descending", value: "dateDsc" }
  ],
  updateIntervals: [
    { label: "Every 5 Minutes", value: 5 },
    { label: "Every 10 Minutes", value: 10 },
    { label: "Every 30 Minutes", value: 30 },
    { label: "Every Hour", value: 60 },
    { label: "Once a Day", value: 60 * 24 }
  ],
  locations: [
    {
      label: "GTA",
      value: Kijiji.locations.ONTARIO.TORONTO_GTA.id
    },
    {
      label: "City of Toronto",
      value: Kijiji.locations.ONTARIO.TORONTO_GTA.CITY_OF_TORONTO.id
    },
    {
      label: "Markham / York Region",
      value: Kijiji.locations.ONTARIO.TORONTO_GTA.MARKHAM_YORK_REGION.id
    },
    {
      label: "Mississauga / Peel Region",
      value: Kijiji.locations.ONTARIO.TORONTO_GTA.MISSISSAUGA_PEEL_REGION.id
    },
    {
      label: "Oakville / Halton Region",
      value: Kijiji.locations.ONTARIO.TORONTO_GTA.OAKVILLE_HALTON_REGION.id
    },
    {
      label: "Oshawa / Duham Region",
      value: Kijiji.locations.ONTARIO.TORONTO_GTA.OSHAWA_DURHAM_REGION.id
    }
  ],
};

// getters
export const getters = {
  tabs: state => {
    return state.tabs
  },
  tab: state => id => {
    return state.tabs.find(tab => tab.id === id)
  },
  ads: state => id => {
    return state.tabs.find(tab => tab.id === id).ads
  },
};

export const setters = {
  tabs: state => {
    return state.tabs
  },
  tab: state => id => {
    return state.tabs.find(tab => tab.id === id)
  },
  ads: state => id => {
    return state.tabs.find(tab => tab.id === id).ads
  },
};

// actions
export const actions = {
  NEW_TAB({ commit }) {
    commit("ADD_TAB");
  },
  FETCH_ADS({ state, commit }, { tabID }) {
    var tab = state.tabs.find(t => t.id === tabID);
    commit("SET_ISLOADING", { tab: tab, isLoading: true });

    return new Promise((resolve, reject) => {
      console.log("fetching...")

      let options = {
        minResults: 60
      };

      let params = {
        keywords: tab.keywords, // Seperate keywords with a
        // adType: "WANTED", // Show ADS that are OFFERING not WANTED
        locationId: tab.locationId, // Same as kijiji.locations.ONTARIO.OTTAWA_GATINEAU_AREA.OTTAWA
        categoryId: tab.categoryId, // Same as kijiji.categories.CARS_AND_VEHICLES
        sortByName: tab.sortByName // Show the cheapest listings first
      };


      // Scrape using returned promise
      Kijiji.search(params, options)
        .then(function (ads) {
          tab.lastRun = Object.assign({}, tab);
          commit("SET_ADS", { tab: tab, ads: ads });
          commit("SET_LASTUPDATE", { tab: tab });
        })
        .catch(error => {
          reject(error);
        })
        .then(res => {
          commit("SET_ISLOADING", { tab: tab, isLoading: false });
          resolve(res);
        });
    });
  }
}

// mutations
export const mutations = {
  REORDER_TABS(state, { tabs: tabs }) {
    state.tabs = tabs;
  },
  SELECT_TAB(state, { id: id }) {
    state.tabs.forEach((tab) => {
      tab.isActive = id == tab.id;
      tab.selected = id == tab.id;
    });
  },
  ADD_TAB(state, tab) {
    tab.lastRun = Object.assign({}, tab);
    tab.id = Date.now()
    state.tabs.push(tab)
  },
  RENAME_TAB(state , { tab, name }) {
    state.tabs[tab].name = name;
  },
  RENAME_TAB_ID(state, { tabId, name }) {
    let tabIndex = state.tabs.findIndex(t => t.id === tabId);
    if (tabIndex >= 0) {
      state.tabs[tabIndex].name = name;
    }
  },
  SAVE() {

  },
  SET_PARAMS() {
    // let tabIndex = state.tabs.findIndex(t => t.id === tabId);
    // if (tabIndex >= 0) {
    //   state.tabs[tabIndex].lastRun = Object.assign({}, state.tabs[tabIndex]);
    //   console.log(tab);
    //   // state.tabs[tabIndex].name = tab.name;
    //   // state.tabs[tabIndex].keywords = tab.keywords;
    //   // state.tabs[tabIndex].sortByName = tab.sortByName;
    // }
  },
  REMOVE_TAB(state, {tab}) {
    state.tabs = state.tabs.filter(t => t.id !== tab)
  },
  SET_ADS(state, { tab, ads }) {
    tab.ads = ads;
  },
  SET_LASTUPDATE(state, { tab }) {
    tab.lastUpdate = new Date();
  },
  SET_ISLOADING(state, {tab, isLoading}) {
    tab.isLoading = isLoading;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

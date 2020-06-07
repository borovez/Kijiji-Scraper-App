const Kijiji = require("kijiji-scraper");

// initial state
export const state = {
  tabs: [],
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
        // minResults: 40
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
        })
        .catch(error => {
          console.log(error);
          reject(error);
        })
        .then(res => {
          commit("SET_LASTUPDATE", { tab: tab });
          commit("SET_ISLOADING", { tab: tab, isLoading: false });
          // console.log(tab);
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

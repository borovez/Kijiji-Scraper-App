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
  ads: (state, getters) => id => {
    let tab = getters.tab(id);

    if (!tab.isWantedVisible) {
      return tab.ads.filter(ad => ad.attributes.type !== "WANTED");
    }
    return tab.ads;
  },
};

// actions
export const actions = {
  NEW_TAB({ commit }) {
    commit("ADD_TAB");
  },
  FETCH_ADS({ state, commit, dispatch }, { tabID }) {

    var tab = state.tabs.find(t => t.id === tabID);
    commit("SET_ISLOADING", { tab: tab, isLoading: true });

    tab.keywords.trim().replace(" ", "+");
    tab.keywords.replace(/\+{2,}/g, '+');

    let keywords = tab.keywords.split(';');

    keywords = keywords.filter(key => {
      if (key.length > 0) {
        return key;
      }
    })

    tab.keywords = keywords.join(";")

    return new Promise((resolve, reject) => {

      if (keywords.length == 0) {
        commit("SET_ISLOADING", { tab: tab, isLoading: false });
        return reject({ message: 'Missing Keywords!', keyword: 'NoKey' });
      }

      Promise.all(keywords.map(async function (keyword) {
        return new Promise((resolve, reject) => {
          console.log("fetching...", keyword)

          let options = {
            minResults: 60
          };

          let params = {
            keywords: keyword, // Seperate keywords with a
            // adType: "WANTED", // Show ADS that are OFFERING not WANTED
            locationId: tab.locationId, // Same as kijiji.locations.ONTARIO.OTTAWA_GATINEAU_AREA.OTTAWA
            categoryId: tab.categoryId, // Same as kijiji.categories.CARS_AND_VEHICLES
            sortByName: tab.sortByName // Show the cheapest listings first
					};
					console.log(params,options)
          // Scrape using returned promise
          Kijiji.search(params, options)
            .then(ads => {
              resolve(ads);
            })
						.catch(e => {
							console.log('here', e);
              reject({ message: e.message, keyword: keyword });
            })
        })
          .catch(e => {
            reject({ message: e.message, keyword: keyword });
          })
      })).then(values => {
        return Promise.all(values);
      }).then(ads => {
        let messages = [];

        ads = ads.filter((a) => {
          if (a === undefined) {
            return false;
          }
          if ('message' in a) {
            messages.push(a)
            return false;
          } else {
            return true;
          }
        })

        let merged = [].concat.apply([], ads);

        merged.filter((item, index) => {
          return merged.indexOf(i => i.url === item.url) === index;
        })

        if (merged.length) {
          dispatch("COMPUTE_DELTA", tab);

          tab.lastRun = Object.assign({}, tab);

          commit("SET_ADS", { tab: tab, ads: merged });
          commit("SET_LASTUPDATE", { tab: tab });
        }

        resolve(messages);
      })
        .catch(error => {
          reject(error);
        })
    })
      .then(() => {
        commit("SET_ISLOADING", { tab: tab, isLoading: false });
      })
      .catch((e) => {
        commit("SET_ISLOADING", { tab: tab, isLoading: false });
        return [{ message: e.message, keyword: keywords.join()}];
      })
  },
  COMPUTE_DELTA({state}, tab) {
    console.log("computing delta...", tab.ads, tab.lastRun.ads, state);

    let tempAds = Object.assign([], tab.ads);
    let deltaAds = [];

    if (tab.lastRun.keywords != tab.keywords) return;

    if (tab.lastRun.ads.length > 0) {

      tempAds.filter((ad) => {
        let index = tab.lastRun.ads.findIndex(lad => {
          return lad.url == ad.url
        })

        let deltaAd = {
          title: ad.title,
          url: ad.url,
          image: ad.image,
          date: ad.date,
          description: ad.description,
          price: ad.attributes.price,
        }

        if (index < 0) {
          deltaAds.push(deltaAd)
          return true;
        } else if (index >= 0 && tab.lastRun.ads[index].attributes.price != ad.attributes.price) {
          deltaAd.priceDiff = ad.attributes.price - tab.lastRun.ads[index].attributes.price;
          deltaAds.push(deltaAd)
          return true;
        }

        return false;
      })
    }

    // dispatch("NOTIFY", deltaAds)
    console.log("DELTA", deltaAds);
    this.dispatch('pushbullet/NOTIFY_ADS', deltaAds);
  },
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
  RENAME_TAB(state, { tab, name }) {
    state.tabs[tab].name = name;
  },
  RENAME_TAB_ID(state, { tabId, name }) {
    let tabIndex = state.tabs.findIndex(t => t.id === tabId);
    if (tabIndex >= 0) {
      state.tabs[tabIndex].name = name;
    }
  },
  REMOVE_TAB(state, { tab }) {
    state.tabs = state.tabs.filter(t => t.id !== tab)
  },
  SET_ADS(state, { tab, ads }) {
    tab.ads = ads;
  },
  SET_LASTUPDATE(state, { tab }) {
    tab.lastUpdate = new Date();
  },
  SET_ISLOADING(state, { tab, isLoading }) {
    tab.isLoading = isLoading;
  },
  SAVE() {

  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

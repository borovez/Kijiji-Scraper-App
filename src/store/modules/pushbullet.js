import axios from 'axios';
import Vue from 'vue'

export const PUSH_BULLET = axios.create({
  baseURL: `https://api.pushbullet.com/v2/`,
  headers: {
    'Access-Token': process.env.VUE_APP_PUSH_BULLET_ACCESS_TOKEN,
    'Content-Type': 'application/json'
  }
})

// initial state
export const state = {
  test: 0,
  devices: null,
};

// getters
export const getters = {

};

// actions
export const actions = {
  NOTIFY_ADS({ state, dispatch }, ads){
    // let device0Id = state.devices[0].iden;
    // let deviceId = state.devices[1].iden;

    console.log('sending text...', state, ads)

    // PUSH_BULLET.post('texts', {
    //   data: {
    //     "addresses": [process.env.VUE_APP_PUSH_BULLET_PHONENUMBER],
    //     'target_device_iden': deviceId,
    //     'message': 'Hey this is dayan sending you a text from PushBullet!1'
    //   }
    // })

    // PUSH_BULLET.post('texts', {
    //   data: {
    //     "addresses": [process.env.VUE_APP_PUSH_BULLET_PHONENUMBER],
    //     'target_device_iden': device0Id,
    //     'message': 'Hey this is dayan sending you a text from PushBullet!2'
    //   }
    // })

    ads.forEach((ad, i) => {

      let body = Vue.filter('truncate')(ad.description, 40).replace(/(\r\n|\n|\r)/gm, "");
      body += `\n$${ad.price}`;
      if ("priceDiff" in ad) {
        body += ` -> $${ad.priceDiff}`;
      }
      setTimeout(() => {
        dispatch("PUSH", {
          "type": "link",
          "title": ad.title,
          "body": body,
          "url": ad.url,
        })
      }, i * 1500)
    })
  },
  PUSH({state}, payload) {
    console.log(state);
    PUSH_BULLET.post('pushes', payload)
  },
  GET_DEVICES: async ({ commit }) => {
    return new Promise(function (resolve, reject) {
      PUSH_BULLET.get('devices').then((response) => {
        commit("SET_DEVICES", response.data.devices)
        resolve(response.data);
        console.log(response.data)
      })
        .catch(error => {
          console.log("error2", error);
          reject(error);
        })
    });
  }
}

// mutations
export const mutations = {
  SET_DEVICES(state, payload) {
    state.devices = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

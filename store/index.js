import { Date } from "core-js";

// State de vuex: variables, data
export const state = () => ({
  searchData: {
    idCompany: 'a897fff7944e4b0a9a1014682a79933e',
    idDevice: 'P212199C00051',
    startDate: '2023-09-01',
    endDate: '2023-09-04',
  },
  items: [],
  selectedTab: 2,
  afterId: null,
  beforeId: null,
});

// Setters
export const mutations = {
  setIdCompany(state, idCompany) {
    state.searchData.idCompany = idCompany;
  },
  setIdDevice(state, idDevice) {
    state.searchData.idDevice = idDevice;
  },
  setStartDate(state, startDate) {
    state.searchData.startDate = startDate;
  },
  setEndDate(state, endDate) {
    state.searchData.endDate = endDate;
  },
  setSelectedTab(state, selectedTab) {
    state.selectedTab = selectedTab
  },
  setItems(state, items) {

    // console.log('state', state)
    // console.log('items', items)

    if (Array.isArray(items)) {
      state.items = items.map(item => ({
        ...item,
        startDate: item.startDate ? new Date(item.startDate) : '',
        endDate: item.endDate ? new Date(item.endDate) : '',    // new Date(item.issueDate)
      }));
    } else {
      state.items = [];
    }
  },
  setAfterId(state, afterId) {
    state.afterId = afterId
  },
  setBeforeId(state, beforeId) {
    state.beforeId = beforeId
  },
  setTotalItems(state, totalItems) {
    state.totalItems = totalItems
  }
};

// Getters
export const getters = {
  isSearchDataComplete(state) {
    return (
      !!state.searchData.idCompany &&
      !!state.searchData.idDevice &&
      !!state.searchData.startDate &&
      !!state.searchData.endDate
    )
  }
};

// Logic
export const actions = {
  async searchData({ state, commit, getters }, additionalParams) {
     const { idCompany, idDevice, startDate, endDate } = state.searchData

    commit('setItems')

    if (getters.isSearchDataComplete) {
      let url = 'https://core.dev.arisale.com.pe/log-service/api/'

      switch (state.selectedTab) {
        case 0:
          url += 'log/exceptions'
          break;
        case 1:
          url += 'log/pinpad-events'
          break
        case 2:
          url += 'log/web-services'
          break;
      }

      // Agregar los parámetros de paginación a la solicitud
      const resultado = await this.$axios.$get(url, {
        params: {
          companyId: idCompany,
          deviceId: idDevice,
          startDate: startDate , 
          endDate: endDate,
          ...additionalParams,
        }
        
      });
      // console.log(resultado.data);

      commit('setItems', resultado.data);
      commit('setAfterId', resultado.afterId);
      commit('setBeforeId', resultado.beforeId);
    } else {
      throw new Error('Todos los campos son obligatorios')
    }
  },
  async nextPage({ state, dispatch }) {
    await dispatch('searchData', {
      afterId: state.afterId,
    });
  },
  async previousPage({ state, dispatch }) {
    await dispatch('searchData', {
      beforeId: state.beforeId,
    });
  }
};


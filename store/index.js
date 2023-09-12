// State de vuex: variables, data
export const state = () => ({
  searchData: {
    idCompany: 'bbca1a68da3f4a2cb6e09d8fd6a69e4e',
    idDevice: '6c101760',
    endpoint: '',
    dateRange: [''],
  },
  items: [],
  selectedTab: 2,
  afterId: null,
  beforeId: null,
  perPage: 7,
  docsCount: null, // Cantidad total de documentos
});

// Setters
export const mutations = {
  setIdCompany(state, idCompany) {
    state.searchData.idCompany = idCompany;
  },
  setIdDevice(state, idDevice) {
    state.searchData.idDevice = idDevice;
  },
  setDateRange(state, { startDate, endDate }) {
    state.searchData.dateRange = [startDate, endDate];
  },
  setEndpoint(state, endpoint) {
    state.searchData.endpoint = endpoint;
  },
  setPerPage(state, perPage) {
    state.perPage = perPage;
  },
  setDocsCount(state, docsCount) {
    state.docsCount = docsCount;
  },
  setSelectedTab(state, selectedTab) {
    state.selectedTab = selectedTab;
  },
  setItems(state, items) {
    if (Array.isArray(items)) {
      state.items = items.map((item) => ({
        ...item,
        startDate: item.startDate ? new Date(item.startDate) : '',
        endDate: item.endDate ? new Date(item.endDate) : '',
      }));
    } else {
      state.items = [];
    }
  },
  setAfterId(state, afterId) {
    state.afterId = afterId;
  },
  setBeforeId(state, beforeId) {
    state.beforeId = beforeId;
  },
};

// Getters
export const getters = {
  isSearchDataComplete(state) {
    return (
      !!state.searchData.idCompany &&
      !!state.searchData.idDevice &&
      !!state.searchData.dateRange[0] &&
      !!state.searchData.dateRange[1]
    );
  },
};

// Logic
export const actions = {
  async searchData({ state, commit, getters }, additionalParams) {
    const { idCompany, idDevice, dateRange, endpoint } = state.searchData;

    commit('setItems');

    if (getters.isSearchDataComplete) {
      let url = 'https://core.dev.arisale.com.pe/log-service/api/';

      switch (state.selectedTab) {
        case 0:
          url += 'log/exceptions';
          break;
        case 1:
          url += 'log/pinpad-events';
          break;
        case 2:
          url += 'log/web-services';
          break;
      }

      const [startDate, endDate] = dateRange;

      const resultado = await this.$axios.$get(url, {
        params: {
          companyId: idCompany,
          deviceId: idDevice,
          startDate: new Date(startDate).valueOf(),
          endDate: new Date(endDate).valueOf(),
          endpoint: endpoint,
          limit: state.perPage,
          ...additionalParams,
        },
      });

      commit('setDocsCount', resultado.docsCount);
      commit('setItems', resultado.data);
      commit('setAfterId', resultado.afterId);
      commit('setBeforeId', resultado.beforeId);
    } else {
      throw new Error('Todos los campos son obligatorios');
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
  },
  async changePerPage({ commit, dispatch }, perPage) {
    commit('setPerPage', perPage);
    await dispatch('searchData');
  },
};
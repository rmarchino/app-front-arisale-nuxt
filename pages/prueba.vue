<template>
    <v-row justify="center" align="center">
      <v-col>
        <!-- Filtros -->
        <v-row>
          <v-col>
            <v-card class="" color="indigo">
              <v-row class="container__row-filter">
                <v-col cols="6">
                  <v-text-field
                    v-model="idCompany"
                    label="idCompany"
                    outlined
                    clearable
                    color="white"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="idDevice"
                    label="idDevice"
                    outlined
                    clearable
                    color="white"
                  ></v-text-field>
                </v-col>
                <!-- Rango de Fechas -->
                <v-col cols="6">
                  <v-menu 
                    ref="startDateMenu"
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    :nudge-width="200"
                  >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dateRange"
                      label="Rango de Fechas"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="dateRange" range no-title scrollable color="light-blue lighten-1">
                    <v-btn
                      color="light-blue lighten-1"
                      @click="saveDateRange"
                    >
                      Save
                    </v-btn>
                    <v-btn 
                      color="deep-orange accent-2"
                      @click="cancelDateRange"
                    >
                      Cancel
                    </v-btn> 
                  </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="endpoint"
                    label="Endpoint"
                    outlined
                    clearable
                    color="white"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="button__search">
                  <v-btn 
                    :disabled="!isSearchDataComplete" 
                    @click="search" 
                    color="pink accent-3"
                    class="search"
                  >
                    Buscar
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <!-- Tabla -->
        <v-row>
          <v-col>
            <v-card v-if="isSearchDataComplete" class="logo py-4">
              <v-tabs v-model="selectedTab" @change="search">
                <v-tabs-slider color="amber"></v-tabs-slider>
                <v-tab v-for="(tab, index) in tabs" :key="index">
                  <v-card> {{ tab.name }} </v-card>
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="selectedTab">
                <v-tab-item v-for="(tab, index) in tabs" :key="index">
                  <v-card>
                    <v-row>
                      <v-col cols="12">
                        <v-data-table
                          :headers="headers"
                          :items="items"
                          :loading="loading"
                          disable-pagination
                          class="elevation-1"
                          hide-default-footer
                        >
                          <template v-slot:item="props">
                            <tr class="custom-row">
                              <td class="custom-cell">{{ props.item.issueDate | formatIssueDate }}</td>
                              <td class="custom-cell">{{ props.item.duration | formatDuration }}</td>
                              <td class="custom-cell">{{ props.item.establishmentName }}</td>
                              <td class="custom-cell">{{ props.item.endpoint }}</td>
                              <td class="custom-cell">{{ props.item.method }}</td>
                              <td class="custom-cell">{{ props.item.responseCode }}</td>
                              <td class="custom-cell">{{ props.item.versionName }}</td>
                              <td class="custom-cell">{{ props.item.startDate | formatStartDate}}</td>
                              <td class="custom-cell">{{ props.item.endDate | formatEndDate}}</td>
                              <td class="custom-cell">
                                <SeeMore 
                                  :item="props.item"
                                />
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="container__button-flex">
                        <v-btn color="indigo" class="button__previous" @click="previousPage">Previous</v-btn>
                        <v-btn color="indigo" class="button__next" @click="nextPage">Next</v-btn>
                        <v-select
                          v-model="perPage"
                          :items=elementPagination
                          label="Elementos por página"
                          @input="changePerPage"
                          class="element__pagination"
                        ></v-select>
                        <div>Total de documentos: {{ docsCount }}</div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
</template>
  
<script>
  import { mapGetters, mapState, mapActions } from 'vuex';
  import { format } from 'date-fns';
  import SeeMore from '~/components/SeeMore.vue';
  
  export default {
    components: {
      SeeMore,
    },
    name: 'IndexPage',
    data() {
      return {
        headers: [
          { text: 'Issue Date', value: 'issueDate' },
          { text: 'Duration', value: 'duration' },
          { text: 'Name Establishment', value: 'establishmentName' },
          { text: 'Endpoint', value: 'endpoint' },
          { text: 'Method', value: 'method' },
          { text: 'Response Code', value: 'responseCode' },
          { text: 'Versión Name', value: 'versionName' },
          { text: 'StartDate', value: 'startDate' },
          { text: 'EndDate', value: 'endDate' },
          { text: 'Actions', value: '' },
        ],
        startDateMenu: false,
        endDateMenu: false,
        loading: false,
        dialog: false,
        elementPagination: [7, 10, 15, 25, 50, 100],
        tabs: [
          {
            name: 'Exceptions',
          },
          {
            name: 'Pinpad Events',
          },
          {
            name: 'Web Services',
          },
        ],
        dateRange: [], // Rango de fechas seleccionado
      };
    },
  
    filters: {
      formatStartDate(value) {
        if (!value) return '';
        return format(value, 'dd/MM/yyyy HH:mm:ss.SSS');
      },
      formatEndDate(value) {
        if (!value) return '';
        return format(value, 'dd/MM/yyyy HH:mm:ss.SSS');
      },
      formatDuration(value) {
        if (!value) return '';
        return (value / 1000) + 'seg';
      },
      formatIssueDate(value) {
        if (!value) return '';
        return format(value, 'dd/MM/yyyy HH:mm:ss.SSS');
      }
    },
  
    computed: {
      ...mapGetters(['isSearchDataComplete']),
      ...mapState(['items', 'state', 'perPage', 'docsCount']),
  
      idCompany: {
        set(val) {
          this.$store.commit('setIdCompany', val);
        },
        get() {
          return this.$store.state.searchData.idCompany;
        },
      },
  
      idDevice: {
        set(val) {
          this.$store.commit('setIdDevice', val);
        },
        get() {
          return this.$store.state.searchData.idDevice;
        },
      },
  
      startDate: {
        set(val) {
          this.dateRange[0] = val; // Actualiza la fecha de inicio del rango
        },
        get() {
          return this.dateRange[0]; // Obtiene la fecha de inicio del rango
        },
      },
  
      endDate: {
        set(val) {
          this.dateRange[1] = val; // Actualiza la fecha de fin del rango
        },
        get() {
          return this.dateRange[1]; // Obtiene la fecha de fin del rango
        },
      },
      endpoint: {
        set(val) {
          this.$store.commit('setEndpoint', val);
        },
        get() {
          return this.$store.state.searchData.endpoint;
        },
      },
      perPage: {
        get() {
          return this.$store.state.perPage;
        },
        set(val) {
          this.$store.commit('setPerPage', val);
        },
      },
      selectedTab: {
        set(val) {
          this.$store.commit('setSelectedTab', val);
        },
        get() {
          return this.$store.state.selectedTab;
        },
      },
    },
  
    methods: {
      ...mapActions(['nextPage', 'previousPage', 'changePerPage']),
  
      cancelDateRange() {
        this.startDateMenu = false;
      },
      saveDateRange() {
        this.startDateMenu = false;
  
        // Actualiza el formato del rango de fechas
        this.$store.commit('setDateRange', { startDate: this.startDate, endDate: this.endDate });
      },
      async changePerPage() {
        try {
          await this.$store.dispatch('changePerPage', this.perPage);
        } catch (error) {
          console.log('Error al cambiar la cantidad de elementos por página:', error);
        }
      },
  
      async search() {
        try {
          await this.$store.dispatch('searchData');
        } catch (error) {
          console.error('Error al obtener datos:', error);
        } finally {
          this.loading = false;
        }
      },
    },
  
    head() {
      return {
        title: 'Aplication Nuxt  App | Home',
        meta: [
          {
            hid: 'name',
            name: 'description',
            content: 'Website home Lists',
          },
        ],
        htmlAttrs: {
          lang: 'en',
        },
      };
    },
  };
</script>
  
<style scoped>
  .container__row-filter {
    padding: 2rem;
  }
  .container__button-flex {
    display: flex !important;
    flex-direction: row !important;
    justify-content: flex-end !important;
    padding: 2rem;
    gap: 1rem;
  }
  .button__search {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .search {
    width: 150px;
    margin-bottom: 50px;
  }
  .custom-cell {
    background: #cacaca !important;
    color: #000;
  }
  
  .button__previous,
  .button__next {
    font-size: small !important;
  }
  
  .element__pagination {
    padding: 5px;
  }
</style>
  
  
  
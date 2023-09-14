<template>
  <v-card>
    <v-app-bar color="#FDFEFE">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-list-item-avatar width="120px" height="90px">
        <v-img src="https://ari-s3bucket.s3.amazonaws.com/assets/logo/arisale_logotipo.png"></v-img>
      </v-list-item-avatar> 

      <v-spacer></v-spacer>

      <!-- Tabs -->
      <template v-slot:extension >
        <v-container fluid>
          <v-tabs align-with-title v-model="selectedTab" @change="search">
            <v-tab v-for="(tab, index) in tabs" :key="index">
              {{ tab.name }}
            </v-tab>  
          </v-tabs>
        </v-container>
        <v-card>
          <v-btn
            color="deep-purple accent-4"
            text
            class="button__actualizar"
          >
          <span>Actualizar</span>
          <v-icon>mdi-history</v-icon>
          </v-btn>
        </v-card>
      </template>
    </v-app-bar>

    <!-- Filtros -->
    <v-navigation-drawer v-model="drawer" temporary absolute color="#FDFEFE" width="450px">
      <h3 class="title__navbar">Búsqueda Avanzada</h3>
      <v-row class="container__filter">
        <v-col cols="12" md="3">
          <v-text-field
           v-model="idCompany"
           label="idCompany"
           outlined
           clearable
           class="company"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
           v-model="idDevice"
           label="idDevice"
           outlined
           clearable
           class="device"
          ></v-text-field>
        </v-col>

        <!-- rango de fecha -->
        <v-col cols="12">
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
              >Save</v-btn>
              <v-btn
                color="deep-orange accent-2"
                @click="cancelDateRange"
              >Cancel</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="3">
         <v-text-field
          v-model="endpoint"
          label="Endpoint"
          outlined
          clearable
          color="white"
         ></v-text-field>
        </v-col>

        <v-col cols="12" md="3">
         <v-row class="button__search">
           <v-btn
            :disabled="!isSearchDataComplete"
            @click="search" 
            color="#68c6e8"
            class="search"
            width="100%"
           >
             Buscar
           </v-btn>
         </v-row> 
        </v-col>
      </v-row> 
    </v-navigation-drawer>

    <!-- Tabla -->
    <v-container style="height: 1000px;" fluid>
      <v-tabs-items v-model="selectedTab">
        <v-tab-item v-for="(tab, index) in tabs" :key="index">
          <v-row style="background-color: #A6ACAF;">
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="items"
                :loading="loading"
                disable-pagination
                hide-default-footer
                style="background-color: #A6ACAF"
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
                    <td>
                      <SeeMore 
                        :item="props.item"
                      />
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

          <v-row style="background-color: #A6ACAF">
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
              <div class="total__doc">Total de documentos: {{ docsCount }}</div>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </v-card>
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
        drawer: false,
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
        this.dateRange = [this.startDate, this.endDate];
      },
      saveDateRange() {
        this.startDateMenu = false;
        
        // Actualiza el formato del rango de fechas
        const [start, end] = this.dateRange;
        this.startDate = start;
      this.endDate = end;

        // this.$store.commit('setDateRange', { startDate: this.startDate, endDate: this.endDate });
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
    }
  };
</script>

<style>
.title__navbar {
  margin-top: 20px;
  color: #808B96;
  padding: 1rem;
  font-weight: bold;
}
.container__filter {
  padding: 1rem;
}
.device, .company {
  font-size: 14px !important;
}
.button__search {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.button__actualizar {
  border: none !important;
}

.custom-cell {
    background: #cacaca !important;
    color: #000;
  }

.total__doc {
  color: #cacaca;
}

.container__button-flex {
    display: flex !important;
    flex-direction: row !important;
    justify-content: flex-end !important;
    padding: 2rem;
    gap: 1rem;
  }

.button__previous,
.button__next {
    font-size: small !important;
    background-color: #808B96 !important;
  }
  
.element__pagination {
    padding: 5px;
}


</style>
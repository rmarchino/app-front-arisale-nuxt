<template>
  <v-row class="text-center">
    <v-col cols="auto">
      <v-dialog
        v-model="dialog"
        width="750px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >Ver más</v-btn>
        </template>
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title class="text-center">Campos Adicionales</v-toolbar-title>
          </v-toolbar>
        </v-card>
        <v-card class="card-container">
          <v-list-item>
            <v-list-item-content class="overflow-x-auto">
              <!-- Company -->
              <v-card class="card__company">
                <h1 class="card__title">Company</h1>
                <div>
                  <h3><span>Company Business Name</span></h3>
                  <p class="card__text">{{ item.companyBusinessName }}</p>
                </div>
                <div>
                  <h3><span>Company Document Type Document Identity</span></h3>
                  <p class="card__text">{{ item.companyTypeDocumentIdentity }}</p>
                </div>
                <div>
                  <h3><span>Company Document Identity Number</span></h3>
                  <p class="card__text">{{ item.companyDocumentIdentityNumber }}</p>
                </div>
              </v-card> <!-- End-->

              <!-- Device and Local -->
              <v-card class="card__container-grid">
                <div>
                  <h1 class="card__title">Device</h1>
                  <div class="card__device">
                    <div>
                      <h3><span>Device Name</span></h3>
                      <p class="card__text">{{ item.deviceName }}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 class="card__title">Local</h1>
                  <div class="card__local">
                    <div>
                      <h3><span>Id Establishment</span></h3>
                      <p class="card__text">{{ item.idEstablishment }}</p>
                    </div>
                    <div>
                      <h3><span>Establishment Name</span></h3>
                      <p class="card__text">{{ item.establishmentName }}</p>
                    </div>
                  </div>
                </div>
              </v-card> <!-- End -->

              <!-- Request and Response -->
              <v-card class="card__container-grid">
                <div>
                  <h1 class="card__title">Request</h1>
                    <div v-show="parsedRequestBody">
                      <h3><span>Request Body</span></h3>
                      <tree-view class="texto" :data="parsedRequestBody"></tree-view>
                    </div>
                    <div v-show="parsedRequestHeader">
                      <h3><span>Request Header</span></h3>
                      <tree-view class="texto" :data="parsedRequestHeader"></tree-view>
                    </div>
                </div>
              </v-card> <!-- End -->
  



              <v-list class="card-list">
                
                <div>
                    <v-list-item-title class="mt-3 card-title">Device Name</v-list-item-title>
                    <v-list-item-subtitle class="card-subtitle">{{ item.deviceName }}</v-list-item-subtitle>
                </div>
                <div>
                    <v-list-item-title class="mt-3 card-title">Id App</v-list-item-title>
                    <v-list-item-subtitle class="card-subtitle">{{ item.idApp }}</v-list-item-subtitle>
                </div>
                <div>
                    <v-list-item-title class="mt-3 card-title">Id Channel</v-list-item-title>
                    <v-list-item-subtitle class="card-subtitle">{{ item.idChannel }}</v-list-item-subtitle>
                </div>
                <div>
                    <v-list-item-title class="mt-3 card-title">Version Code</v-list-item-title>
                    <v-list-item-subtitle class="card-subtitle">{{ item.versionCode }}</v-list-item-subtitle>
                </div>
                <div v-show="parsedResponseHeader">
                  <h3>Response Header</h3>
                  <tree-view :data="parsedResponseHeader" ></tree-view>
                </div>
                <div v-show="parsedResponseBody">
                  <h3>Response Body</h3>
                  <tree-view :data="parsedResponseBody" ></tree-view>
                </div>
              </v-list>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-dialog> 
    </v-col>
  </v-row>
</template>

<script>
import Vue from "vue";
import TreeView from "vue-json-tree-view"
Vue.use(TreeView)

export default {
    props: {
      item: Object,  // Recibe el objeto de datos como prop
    },
    data () {
      return {
        dialog: false,
        parsedRequestBody: null,
        parsedRequestHeader: null,
        parsedResponseHeader: null,
        parsedResponseBody: null,
      }
    },
    methods: {
      parseRequestBody() {
        if(typeof this.item.requestBody === 'string' && this.item.requestBody.trim() !== ''){
          try {
            const requestBodyObj = JSON.parse(this.item.requestBody);
            this.parsedRequestBody = requestBodyObj;
          } catch (error) {
            console.error('Error al analizar requestBody:', error);
            this.parsedRequestBody = null;
          }
        } else {
          this.parsedRequestBody = null;
        }
      },

      parseRequestHeader() {
        if(typeof this.item.requestHeader === 'string' && this.item.requestHeader.trim() !==''){
          const headerPairs = this.item.requestHeader.match(/\[.*?\]/g);
          if(headerPairs){
            const headerObject = {};
            for (const pair of headerPairs) {
              const [key, value] = pair.slice(1, -1).split(':');
              headerObject[key] = value;
            }
            this.parsedRequestHeader = headerObject;
          }else {
            this.parsedRequestHeader = null;
          }
        } else {
          this.parsedRequestHeader = null;
        }
      },

      parseResponseHeader() {
        if(typeof this.item.responseHeader === 'string' && this.item.responseHeader.trim() !==''){
          const headerPairs = this.item.responseHeader.match(/\[.*?\]/g);
          if(headerPairs) {
            const headerObject = {};
            for (const pair of headerPairs) {
              const [key, value] = pair.slice(1, -1).split(':');
              headerObject[key] = value;
            }
            this.parsedResponseHeader = headerObject;
          }else {
            this.parsedResponseHeader = null;
          }
        } else {
          this.parsedResponseHeader = null;
        }
      },

      parseResponseBody() {
        if(typeof this.item.responseBody === 'string' && this.item.responseBody.trim() !==''){
          try {
            const responseBodyObj = JSON.parse(this.item.responseBody);
            this.parsedResponseBody = responseBodyObj;
          } catch (error) {
            console.error('Error al analizar responseBody', error);
            this.parsedResponseBody = null;
          }
        }else {
          this.parsedResponseBody = null;
        }
      }
    },
    mounted() {
      this.parseRequestBody();
      this.parseRequestHeader();
      this.parseResponseHeader();
    }
};
</script>

<style scoped>
/** SectioN Company**/
.card__company {
  background: #ebebeb;
  padding: 1rem;
}
.card__title{
  color: #1a6fe6;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 5px;
}

h3 {
  color: #34383c;
  font-size: 16px;
}
.card__text{
  color: #34383c;
  font-size: 14px;
}

/** SectioN Device AND LOCAL**/
.card__container-grid {
  padding: 1rem;
  background: #ebebeb;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

/** SectioN Request AND Response **/
.texto {
  color: #34383c !important;
}







.card-container {
  background: #cacaca !important;
}
.card-title {
  font-size: 15px;
  color: #ffffff;
  font-weight: 700;
}

.card-subtitle {
  color: #34383c !important;
}

.card-list {
  background: #9b9a9a !important;
  padding: 1rem;
  border-radius: .50rem;
}

</style>
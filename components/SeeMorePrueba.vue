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
                <v-list class="card-list">
                  <div>
                      <v-list-item-title class="mt-3 card-title">Company BusinessName</v-list-item-title>
                      <v-list-item-subtitle class="card-subtitle">{{ item.companyBusinessName }}</v-list-item-subtitle>
                  </div>
                  <div>
                    <v-list-item-title class="mt-3 card-title">Company Document Number</v-list-item-title>
                    <v-list-item-subtitle class="card-subtitle">{{ item.companyDocumentIdentityNumber }}</v-list-item-subtitle>
                  </div>
                  <div>
                    <v-list-item-title class="mt-3 card-title">Company Type Document</v-list-item-title>
                    <v-list-item-subtitle class="card-subtitle">{{ item.companyTypeDocumentIdentity }}</v-list-item-subtitle>
                  </div>
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
                  <div>
                    <h3>Request Body</h3>
                    <tree-view :data="parsedRequestBody" ></tree-view>
                  </div>
                  <div>
                    <h3>Request Header</h3>
                    <tree-view :data="parsedRequestHeader" ></tree-view>
                  </div>
                  <div>
                    <h3>Response Header</h3>
                    <tree-view :data="parsedResponseHeader" ></tree-view>
                  </div>
                  <div>
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
  
              // Almacenar el objeto analizado en parsedRequestBody
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
              this.parsedRequestHeader = headerPairs.map(pair => pair.slice(1, -1));
            }else {
              this.parsedRequestHeader = null
            }
          } else {
            this.parsedRequestHeader = null;
          }
        },
  
        parseResponseHeader() {
          if(typeof this.item.responseHeader === 'string' && this.item.responseHeader.trim() !==''){
            const headerPairs = this.item.responseHeader.match(/\[.*?\]/g);
            if(headerPairs) {
              this.parsedResponseHeader = headerPairs.map(pair => pair.slice(1, -1));
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
              this.parsedResponseBody = responseBodyObj
              
            } catch (error) {
              console.error('Error al anlizar responseBody', error);
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
  
  // export default {
  //     props: {
  //       item: Object,
  //     },
  //     data () {
  //       return {
  //         dialog: false,
  //         parsedRequestBody: null,
  //         parsedRequestHeader: null,
  //         parsedResponseHeader: null,
  //         parsedResponseBody: null,
  //       }
  //     },
  //     methods: {
  //       parseRequestBody() {
  //         if(typeof this.item.requestBody === 'string' && this.item.requestBody.trim() !== ''){
  //           try {
  //             const requestBodyObj = JSON.parse(this.item.requestBody);
  
  //             // Almacenar el objeto analizado en parsedRequestBody
  //             this.parsedRequestBody = requestBodyObj;
  //           } catch (error) {
  //             console.error('Error al analizar requestBody:', error);
  //             this.parsedRequestBody = null;
  //           }
  //         } else {
  //           this.parsedRequestBody = null;
  //         }
  //       },
  
  //       parseRequestHeader() {
  //         if(typeof this.item.requestHeader === 'string' && this.item.requestHeader.trim() !==''){
            
  //           const headerPairs = this.item.requestHeader.match(/\[.*?\]/g);
  
  //           // Dividir los encavezados ('][')
  //           const headerPairs = this.item.requestHeader.split('] [');
  
  //           // Eliminar los corchetes y crean un objeto JSON válido
  //           const headerObject = {};
  //           for (const part of headerPairs) {
  //             const [key, value] = part.replace('[', '').split(':');
  //             headerObject[key] = value;
  //           }
  //           // Asigna el objeto JSON a parsedRequestHeader
  //           this.parsedRequestHeader = headerObject;
  //         } else {
  //           this.parsedRequestHeader = null;
  //         }
  //       },
  
  //       parseResponseHeader() {
  //         if(typeof this.item.responseHeader === 'string' && this.item.responseHeader.trim() !==''){
            
  //           // Elimina los corchetes iniciales y finales de la cadena
  //           const cleanedHeader = this.item.responseHeader.replace(/^\[|\]$/g, '');
  
  //           // Divide la cadena en pares clave-valor usando '] [' como separador
  //           const headerPairs = cleanedHeader.split('] [');
  
  //           //Crea un objeto JSON para almacenar
  //           const headerObject = {}
  
  //           // Itera a través de los pares clave-valor en `headerPairs
  //           for(const pair of headerPairs){
  
  //             const [key, value] = pair.split(':');
  
  //             // Elimina espacios en blanco alrededor de la clave y el valor
  //             const cleanedKey = key.trim();
  //             const cleanedValue = value.trim();
  
  //             // Agrega el par clave-valor al objeto `headerObject`
  //             headerObject[cleanedKey] = cleanedValue;
  //           }
  
  //           // Asigna el objeto JSON a parsedResponseHeader
  //           this.parsedResponseHeader = headerObject;
            
  //         } else {
  //           this.parsedResponseHeader = null;
  //         }
  //       },
  
  //       parseResponseBody() {
  //         if(typeof this.item.responseBody === 'string' && this.item.responseBody.trim() !==''){
  //           try {
  //             this.parsedResponseBody = JSON.parse(this.item.responseBody);
  //           } catch (error) {
  //             console.error('Error al anlizar responseBody', error);
  //             this.parsedResponseBody = null;
  //           }
  //         }else {
  //           this.parsedResponseBody = null;
  //         }
  //       }
  //     },
  //     mounted() {
  //       this.parseRequestBody();
  //       this.parseRequestHeader();
  //       this.parseResponseHeader();
  //     }
  // };
  </script>
  
  <style scoped>
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
  
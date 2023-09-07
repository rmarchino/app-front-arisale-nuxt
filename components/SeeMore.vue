<template>
  <v-row class="text-center">
    <v-col cols="auto">
      <v-dialog
        v-model="dialog"
        width="800px"
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
            <v-list-item-content>
              <v-list class="card-list">
                <div>
                  <v-list-item-title class="mt-3 mb-3 card-title">- Company Business Name</v-list-item-title>
                  <v-list-item-subtitle class="card-subtitle">{{ item.companyBusinessName }}</v-list-item-subtitle>
                </div>
                <div>
                  <v-list-item-title class="mt-3 mb-3 card-title">- Company Type Document</v-list-item-title>
                  <v-list-item-subtitle class="card-subtitle">{{ item.companyTypeDocumentIdentity }}</v-list-item-subtitle>
                </div>
                <div>
                  <v-list-item-title class="mt-3 mb-3 card-title">- Company Document Number</v-list-item-title>
                  <v-list-item-subtitle class="card-subtitle">{{ item.companyDocumentIdentityNumber }}</v-list-item-subtitle>
                </div>
                <div>
                  <v-list-item-title class="mt-3 mb-3 card-title">- Version Code</v-list-item-title>
                  <v-list-item-subtitle class="card-subtitle">{{ item.versionCode }}</v-list-item-subtitle>
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


export default {
    props: {
      item: Object,  // Recibe el objeto de datos como prop

    },
    data () {
      return {
        dialog: false,
      }
    }
};
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
  color: #000 !important;
}

.card-list {
  background: #9b9a9a !important;
  padding: 1rem;
  border-radius: .50rem;
}

</style>

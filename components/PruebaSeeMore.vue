<template>
    <v-row justify="center">
      <v-card>
        <v-row>
          <v-col cols="auto">
            <v-dialog
              transition="dialog-bottom-transition"
              width="800px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                >Ver más</v-btn>
              </template>

                <!-- Table -->
              <template v-slot:default="dialog">
                <v-data-table
                  :headers="headers"
                  :items="items"
                  hide-default-footer
                  class="elevation-1"
                >
                  <template>
                    <tr>
                      <td class="custom-cell">Ejemplo 1</td>
                      <td class="custom-cell">Ejemplo 2</td>
                      <td class="custom-cell">Ejemplo 3</td>
                      <td class="custom-cell">Ejemplo 4</td>
                      <td class="custom-cell">Ejemplo 5</td>
                      <td class="custom-cell">Ejemplo 6</td>
                      <td class="custom-cell">Ejemplo 7</td>
                    </tr>
                  </template>
                </v-data-table>

                <!-- Button -->
                <v-row>
                  <v-col cols="auto">
                    <v-card-actions class="justify-end ">
                        <v-btn
                          class="ma2"
                          color="red"
                          @click="dialog.value = false"
                        >
                          Cancel
                          <v-icon 
                            dark
                            right
                          >
                          mdi-minus-circle
                          </v-icon>
                        </v-btn>
                    </v-card-actions>
                  </v-col>
                </v-row>
              </template>
            </v-dialog>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
</template>


<script>
  export default {
    data () {
      return {
        headers: [
           { text: 'Columna1', value: '' },
           { text: 'Columna2', value: '' },
           { text: 'Columna3', value: '' },
           { text: 'Columna4', value: '' },
           { text: 'Columna5', value: '' },
           { text: 'Columna6', value: '' },
           { text: 'Columna7', value: '' },
        ],
        dialog: false,
      }
    },
  }
</script>


<style scoped>
.custom-cell{
  background: #cacaca;
  color: #000;
}
</style>
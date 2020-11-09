<template>
  <div>
    <v-data-table
      v-for="(table, index) in tables"
      :key="index"
      :headers="table.headers"
      hide-default-header
      :items="table.items"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>
            {{table.id.split('_').join('-')}}
            <span class="pl-1 pr-1">-</span>  
            {{$moment(table.id.split('_').reverse().join('-')).endOf('month').format('DD-MM-YYYY')}}
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2 mr-1 ml-1"
                v-bind="attrs"
                @click="showAddRow(table)"
              >
                + строка
              </v-btn>
              <v-btn
                color="success"
                dark
                class="mb-2 mr-1 ml-1"
                v-bind="attrs"
                @click="showAddColumn(table)"
              >
                + столбец
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                      v-for="item in addColumnTable"
                      :key="item.label"
                    >
                      <v-text-field
                        v-model="item.value"
                        :label="item.label"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="warning"
                  @click="dialog = false"
                >
                  Отмена
                </v-btn>
                <v-btn
                  color="success"
                  @click="save"
                >
                  Сохранить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:header="{ props: { headers } }">
        <tr>
          <th
            v-for="header in headers"
            :key="header.text"
            class="text-left pl-4"
          >
            {{ header.text }} <span v-if="header.value == 'startNumber'">{{table.id.split('_').join('-')}}</span>
            
            <v-btn 
              v-if="header.value != 'actions'"
              icon
              small
              color="red"
              @click="removeHeaderItem(header, table.id)"
            >
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </th>
        </tr>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item, table)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item, table)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-model="addColumnDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Добавление столбца</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-menu
                  ref="dateMenu"
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateFormatted"
                      label="Дата"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    @input="dateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="item in addColumnTable"
                :key="item.label"
              >
                <v-text-field
                  v-model="item.value"
                  :label="item.label"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="warning"
            @click="addColumnDialog = false"
          >
            Отмена
          </v-btn>
          <v-btn
            color="success"
            @click="addColumn"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script>
  import firebase from 'firebase/app'

  export default {
    data: () => ({
      dialog: false,
      addColumnDialog: false,
      dateMenu: false,
      addColumnTable: [],
      addColumnTableId: null,
      date: null,
      dateFormatted: null,
      tables: [],
      editItemIndex: null,
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    }),

    methods: {
      async initialize () {
        await this.getCosts()
      },

      async getCosts(){
        await this.$db.collection('costs')
              .get()
              .then((doc) => {
                doc.docs.forEach(elem => {
                  this.tables = []
                  this.tables.push({
                    ...elem.data(),
                    id: elem.id
                  })
                })
              })
      },

      editItem (item, table) {
        this.editItemIndex = table.items.findIndex(elem => elem.name == item.name)
        this.addColumnTable = []
        table.headers.forEach(elem => {
          if(elem.value != 'actions'){
            this.addColumnTable.push({
              label: elem.text,
              value: item[elem.value],
              name: elem.value
            })
          }
        })
        
        this.addColumnTableId = table.id
        this.dialog = true
      },

      async deleteItem (item, table) {
        let res = await this.$confirm("Удалить строку?");
        if(res){
          let neededTable = this.tables.findIndex(elem => elem.id == table.id)
          this.tables[neededTable].items = this.tables[neededTable].items.filter(elem => elem.name != item.name)

          await this.$db.collection('costs')
              .doc(this.addColumnTableId)
              .update({
                items: this.tables[neededTable].items,
              })
          await this.getCosts()
        }
        
      },

      async save () {
        let neededTable = this.tables.find(elem => elem.id == this.addColumnTableId)
        if(this.editItemIndex || this.editItemIndex == 0){
            this.addColumnTable.forEach(elem => {
              neededTable.items[this.editItemIndex][elem.name] = elem.value
            })
        }else{
          let itemToSave = {}
          this.addColumnTable.forEach(elem => {
            itemToSave[elem.name] = elem.value
          })
          neededTable.items.push(itemToSave)
        }
        
        await this.$db.collection('costs')
              .doc(this.addColumnTableId)
              .update({
                items: neededTable.items,
              })
        await this.getCosts()
        this.dialog = false
      },

      showAddRow(table){
        this.editItemIndex = null
        this.addColumnTable = []
        table.headers.forEach(elem => {
          if(elem.value != 'actions'){
            this.addColumnTable.push({
              label: elem.value == 'startNumber' ? `${elem.text} ${table.id.split('_').join('-')}` : elem.text,
              value: '',
              name: elem.value
            })
          }
        })
        
        this.addColumnTableId = table.id
        this.dialog = true
      },

      showAddColumn(table){
        this.addColumnTable = []
        table.items.forEach(elem => {
          this.addColumnTable.push({
            label: elem.name,
            value: 0
          })
        })
        this.addColumnTableId = table.id
        this.addColumnDialog = true
      },

      async addColumn(){
        let neededTable = this.tables.find(elem => elem.id == this.addColumnTableId)
        neededTable.items.forEach(elem => {
          let elemToChange = this.addColumnTable.find(item => item.label == elem.name)
          elem[this.dateFormatted.split('-').join('_')] = elemToChange.value
          elem.presentNumber += Number(elemToChange.value)
        })

        await this.$db.collection('costs')
              .doc(this.addColumnTableId)
              .update({
                headers: firebase.firestore.FieldValue.arrayUnion({
                  sortable: false,
                  text: `Заказ ${this.dateFormatted}`,
                  value: this.dateFormatted.split('-').join('_')
                }),
                items: neededTable.items,
              })
        await this.getCosts()
        this.addColumnDialog = false
      },
      
      async removeHeaderItem(header, id){
        let res = await this.$confirm("Удалить столбец?");
        if(res){
          let neededTable = this.tables.findIndex(elem => elem.id == id)
          let neededHeaderIndex = this.tables[neededTable].headers.findIndex(item => item.value == header.value)
          this.tables[neededTable].headers.splice(neededHeaderIndex, 1)
          this.tables[neededTable].items.forEach(elem => {
            elem.presentNumber -= Number(elem[header.value])
            delete elem[header.value]
          })

          await this.$db.collection('costs')
                .doc(id)
                .update({
                  headers: this.tables[neededTable].headers,
                  items: this.tables[neededTable].items,
                })
        }
      }
    },

    computed: {
      formTitle () {
        return this.editItemIndex == null ? 'Новая строка' : 'Редактировать строку'
      },
    },

    watch: {
      date(val){
        this.dateFormatted = this.$moment(val).format('DD-MM-YYYY')
      }
    },

    async created () {
      this.date = new Date().toISOString().substr(0, 10),
      this.dateFormatted = this.$moment().format('DD-MM-YYYY'),
      
      await this.initialize()
    },

    updated(){
      console.log('updated')
    }

  }
</script>

<style lang="scss" scoped>

</style>
<template>
  <div>
    <v-progress-circular
      v-show="loading"
      indeterminate
      color="green"
      class="progress-circular"
    ></v-progress-circular>
    <v-expansion-panels accordion multiple>
      <v-expansion-panel
        v-for="(table, index) in tables"
        :key="index"
      >
        <v-expansion-panel-header>
          {{$moment(table.id.split('_').reverse().join('-')).locale('ru').format('MMMM - YYYY').toUpperCase()}}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="table.headers"
            hide-default-header
            :items="table.items"
            sort-by="calories"
            class="elevation-1"
            :class="{'mt-4': index > 0}"
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
                <v-btn
                  icon
                  small
                  color="red"
                  @click="removeMonth(table.id)"
                  title="Удалить таблицу"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
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
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
    
    <v-form
      v-show="newMonthTemplate"
      ref="newMonthForm"
      v-model="valid"
      lazy-validation
    >
      <v-row >
        <v-col xs="6" sm="2" md="1">
          <v-select
            v-model="newMonthNumber"
            :items="[1,2,3,4,5,6,7,8,9,10,11,12]"
            label="Месяц"
            :rules="newMonthRules"
            required
          />
        </v-col>
        <v-col xs="6" sm="2" md="1">
          <v-select
            v-model="newMonthYearNumber"
            :items="years"
            label="Год"
            :rules="newMonthRules"
            required
          />
        </v-col>
        <v-col xs="6" sm="3" md="2">
          <v-btn 
            color="success"
            class="mt-4"
            @click="addNewMonth"
          >
            Сохранить
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    
    <v-btn 
      color="success"
      class="mt-4"
      @click="newMonthTemplate = !newMonthTemplate"
    >
      {{ newMonthText }}
    </v-btn>
  </div>

</template>

<script>
  import firebase from 'firebase/app'

  export default {
    data: () => ({
      valid: true,
      newMonthRules: [
        v => !!v || 'Нужно выбрать'
      ],
      newMonthTemplate: false,
      newMonthNumber: null,
      newMonthYearNumber: null,
      years: [],
      loading: false,
      dialog: false,
      addColumnDialog: false,
      dateMenu: false,
      addColumnTable: [],
      addColumnTableId: null,
      date: null,
      dateFormatted: null,
      tables: [],
      editItemIndex: null,
    }),

    methods: {
      async initialize () {
        this.loading = true
        await this.getCosts()
        this.loading = false
      },

      async getCosts(){
        await this.$db.collection('costs')
              .get()
              .then((doc) => {
                let localTables = []
                doc.docs.forEach(elem => {
                  localTables.push({
                    ...elem.data(),
                    id: elem.id
                  })
                })
                this.tables = JSON.parse(JSON.stringify(localTables))
              })
        this.tables.sort((a, b) =>{
          return  Number(b.id.split('_')[2]) - Number(a.id.split('_')[1])
        })
        this.tables.sort((a, b) =>{
          return Number(a.id.split('_')[2]) - Number(b.id.split('_')[2])
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
          this.loading = true
          let neededTable = this.tables.findIndex(elem => elem.id == table.id)
          this.tables[neededTable].items = this.tables[neededTable].items.filter(elem => elem.name != item.name)

          await this.$db.collection('costs')
              .doc(this.addColumnTableId)
              .update({
                items: this.tables[neededTable].items,
              })
          await this.getCosts()
          this.loading = false
        }
        
      },

      async save () {
        this.loading = true
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
        this.loading = false
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
        this.loading = true
        let neededTable = this.tables.find(elem => elem.id == this.addColumnTableId)
        neededTable.items.forEach(elem => {
          let elemToChange = this.addColumnTable.find(item => item.label == elem.name)
          elem[this.dateFormatted.split('-').join('_')] = elemToChange.value
          elem.presentNumber = Number(elem.presentNumber) + Number(elemToChange.value)
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
        this.loading = false
      },
      
      async removeHeaderItem(header, id){
        let res = await this.$confirm("Удалить столбец?");
        if(res){
          this.loading = true
          let neededTable = this.tables.findIndex(elem => elem.id == id)
          let neededHeaderIndex = this.tables[neededTable].headers.findIndex(item => item.value == header.value)
          this.tables[neededTable].headers.splice(neededHeaderIndex, 1)
          this.tables[neededTable].items.forEach(elem => {
            elem.presentNumber = Number(elem.presentNumber) - Number(elem[header.value])
            delete elem[header.value]
          })

          await this.$db
                .collection('costs')
                .doc(id)
                .update({
                  headers: this.tables[neededTable].headers,
                  items: this.tables[neededTable].items,
                })
          this.loading = false
        }
      },

      async addNewMonth(){
        if(this.$refs.newMonthForm.validate()){
          this.loading = true
          let baseCosts = (await this.$db
                .collection('baseCosts')
                .doc('3O53Q1e572GtN7ujVz79')
                .get()).data()
          await this.$db
                .collection('costs')
                .doc(this.$moment(`${this.newMonthYearNumber}-${this.newMonthNumber}-01`).format('DD_MM_YYYY'))
                .set(baseCosts)
          await this.getCosts()
          this.$notify({
            group: 'foo',
            type: 'success',
            text: `Добавлен ${this.$moment(`${this.newMonthYearNumber}-${this.newMonthNumber}-01`)
                                  .locale('ru')
                                  .format('MMMM - YYYY')
                                  .toUpperCase()
                            }`
          });
          this.loading = false
          this.showNewMonthTemplate(false)
        }
      },

      async removeMonth(id){
        let res = await this.$confirm("Удалить месяц?");
        if(res){
          this.loading = true
          await this.$db.collection("costs").doc(id).delete()
          await this.getCosts()
          this.$notify({
            group: 'foo',
            type: 'success',
            text: `Удален ${this.$moment(id.split('_').reverse().join('-'))
                                  .locale('ru')
                                  .format('MMMM - YYYY')
                                  .toUpperCase()
                            }`
          });
          this.loading = false
        }
      },

      showNewMonthTemplate(arg){
        this.newMonthTemplate = arg
      }
    },

    computed: {
      formTitle () {
        return this.editItemIndex == null ? 'Новая строка' : 'Редактировать строку'
      },
      newMonthText(){
        return this.newMonthTemplate ? 'Закрыть' : '+ месяц'
      }
    },

    watch: {
      date(val){
        this.dateFormatted = this.$moment(val).format('DD-MM-YYYY')
      }
    },

    async created () {
      for (let index = 0; index < 5; index++) {
        this.years.push(this.$moment().year() + index) 
      }
      this.date = new Date().toISOString().substr(0, 10),
      this.dateFormatted = this.$moment().format('DD-MM-YYYY'),
      
      await this.initialize()
    },

  }
</script>

<style lang="scss" scoped>
.progress-circular{
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
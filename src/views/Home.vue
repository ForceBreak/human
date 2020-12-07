<template>
  <div class="home">
    <v-container>
      <v-row>
        <v-col xs="12" sm=4>
          <v-card
            color="#385F73"
            dark
          >
            <v-card-title class="headline">
              Разные остатки
            </v-card-title>

            <v-card-actions>
              <v-btn 
                text
                to="/stuff"
              >
                Перейти
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col xs="12" sm=4>
          <v-card
            color="#385F73"
            dark
          >
            <v-card-title class="headline">
              Thalgo Домашняя
            </v-card-title>

            <v-card-actions>
              <v-btn 
                text
                to="/thalgo-home"
              >
                Перейти
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col xs="12" sm=4>
          <v-card
            color="#385F73"
            dark
          >
            <v-card-title class="headline">
              Биолоджик Франция
            </v-card-title>

            <v-card-actions>
              <v-btn 
                text
                to="/biologic-home"
              >
                Перейти
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
      
  }
</script>

<style lang="scss" scoped>

</style>
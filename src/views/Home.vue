<template>
  <div class="home">
    <v-container>
      <v-row>
        <v-col xs="12">
          <Costs/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Costs from '@/components/Costs.vue'

export default {
  name: 'Home',
  components: {
    Costs
  }
}
</script>

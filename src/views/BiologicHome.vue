<template>
  <div class="ThalgoFrance">
    <v-container>
      <v-row>
        <v-col xs="12">
          <h1 class="mb-4">{{ $route.name }}</h1>
          <CostsBiologicHome />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  // @ is an alias to /src
  import CostsBiologicHome from '@/components/CostsBiologicHome.vue'
  export default {
    name: 'ThalgoHome',
    components: {
      CostsBiologicHome 
    },
  }
</script>

<style lang="scss" scoped>

</style>
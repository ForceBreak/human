<template>
  <div class="ThalgoFrance">
    <v-container>
      <v-row>
        <v-col xs="12">
          <h1 class="mb-4">{{ $route.name }}</h1>
          <CostsThalgoHome />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  // @ is an alias to /src
  import CostsThalgoHome from '@/components/CostsThalgoHome.vue'
  export default {
    name: 'ThalgoHome',
    components: {
      CostsThalgoHome
    },
  }
</script>

<style lang="scss" scoped>

</style>
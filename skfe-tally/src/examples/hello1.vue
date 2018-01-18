<template>
    <div>
        <h1>{{text1}}</h1>
        <img src="../assets/fdmh1.png">
        <hr>
        <pre>{{procEnv}}</pre>
    </div>
</template>

<script>
  import Conf from '../conf'

  export default {
    data: () => ({
      text1: 'Hello World',
      procEnv: JSON.stringify(Conf, 0, 2)
    }),
    created () {
      console.log(process)
      console.log(process.ENV0)
    }
  }
</script>
<style scoped>
</style>

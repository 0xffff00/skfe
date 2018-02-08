<template>
    <div>
        <Input v-model="url"></Input>
        <Button @click="gogogo">GET</Button>
        <pre>{{res}}</pre>
    </div>
</template>
<script>
  import RestApi from '../libs/sk-rest-api'

  export default {
    data: () => ({
      url: '',
      res: ''
    }),
    methods: {
      gogogo () {
        const self = this
        RestApi.of(self.url).getting({})(resp2 => {
          self.res = JSON.stringify(resp2, null, 2)
        })
      }
    }
  }
</script>
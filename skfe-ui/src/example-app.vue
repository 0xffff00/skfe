<template>
    <div>
        <Menu active-name="1" mode="horizontal" theme="primary">
            <router-link to="/time-grid">
                <MenuItem name="1">时间格子</MenuItem>
            </router-link>
            <router-link to="/rest-api">
                <MenuItem name="1">REST API</MenuItem>
            </router-link>
            <Submenu name="3">
                <template slot="title">OTHERS</template>
                <MenuGroup title="使用">
                    <MenuItem name="3">用户留存1</MenuItem>
                    <MenuItem name="4">流失用户</MenuItem>
                </MenuGroup>
            </Submenu>
        </Menu>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
  import RandomTimeGrid from './views/random-time-grid.vue'
  import RestApiTest from './views/rest-api-test.vue'

  export default {
    data: () => ({}),
    created () {

    },
    components: {RandomTimeGrid, RestApiTest}
  }
</script>
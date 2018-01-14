<template>
    <div>
        <div id="skfe-app-menu0">
            <Menu active-name="1" mode="horizontal" theme="light" v-if="menuVisible">
                <a href="/bills/0/edit" target="_blank">
                    <MenuItem name="3waa">新建对账单</MenuItem>
                </a>
                <router-link to="/bills/manage">
                    <MenuItem name="3aa">账单管理</MenuItem>
                </router-link>
                <router-link to="/bills/overview">
                    <MenuItem name="as">账单总览</MenuItem>
                </router-link>
                <Submenu name="3">
                    <template slot="title">
                        DICT(DEV only)
                    </template>
                    <MenuGroup title="other1" mode="horizontal">
                        <router-link to="/eg/editor-demo">
                            <MenuItem name="3aa">editor-demo</MenuItem>
                        </router-link>
                        <MenuItem name="3">dict1</MenuItem>
                        <MenuItem name="4">流vccc</MenuItem>
                    </MenuGroup>
                    <MenuGroup title="other2" mode="horizontal">
                        <MenuItem name="13">111</MenuItem>
                        <MenuItem name="24">222</MenuItem>
                    </MenuGroup>
                </Submenu>

            </Menu>
        </div>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
  export default {
    data: () => ({}),
    computed: {
      menuVisible () {
        return !this.$route.meta.noMenu
      }
    },
    created () {

    }
  }
</script>

<style scoped lang="less">
    @media screen {
        #skfe-app-menu0 {
            display: block;
        }

    }

    @media print {
        #skfe-app-menu0 {
            display: none;
        }
    }
</style>

<template>
    <div id="skfe-app">
        <Layout>
            <div id="skfe-app-menu0">
                <Sider collapsible :collapsed-width="48" v-model="ui.siderCollapsed"
                       :style="{minHeight: '100vh'}">
                    <Menu active-name="1-2" theme="dark" width="auto" :class="">
                        <a href="/bills/0/edit" target="_blank">
                            <MenuItem name="3waa">
                                <Icon type="plus"></Icon>
                                新建对账单
                            </MenuItem>
                        </a>
                        <router-link to="/bills/overview">
                            <MenuItem name="3aa">
                                <Icon type="person-stalker"></Icon>
                                所有客户
                            </MenuItem>
                        </router-link>
                        <router-link to="/bills/manage">
                            <MenuItem name="as">
                                <Icon type="soup-can"></Icon>
                                管理
                            </MenuItem>
                        </router-link>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="social-freebsd-devil"></Icon>
                                DEV only
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
                </Sider>
            </div>
            <Layout>
                <Content :class="['skfe-app-con']">
                    <!--<Breadcrumb :style="{margin: '16px 0'}">-->
                    <!--<BreadcrumbItem>Home</BreadcrumbItem>-->
                    <!--<BreadcrumbItem>Components</BreadcrumbItem>-->
                    <!--<BreadcrumbItem>Layout</BreadcrumbItem>-->
                    <!--</Breadcrumb>-->

                    <router-view></router-view>


                </Content>
                <Footer :style="{textAlign:'center'}">
                    © 2018 threebody.party
                </Footer>

            </Layout>
        </Layout>
    </div>
</template>
<script>
  export default {
    data: () => ({
      ui: {
        siderCollapsed: false
      }
    }),
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

    .skfe-app-con{
        background: white;
        margin: 5px;
        padding: 5px;
        box-shadow: black;
    }
    @media print {
        #skfe-app-menu0 {
            display: none;
        }
    }
</style>

<template>
    <div id="skfe-app">
        <Layout>
            <div id="skfe-app-menu0">
                <Sider collapsible :collapsed-width="48" v-model="ui.siderCollapsed"
                       :style="{minHeight: '100vh',position:'fixed'}">
                    <Menu active-name="1-2" theme="dark" width="auto" :class="">
                        <router-link to="/">
                            <MenuItem name="home">
                                <Icon type="home"></Icon>
                                首页
                            </MenuItem>
                        </router-link>
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
                        <router-link to="/buyers/NA/deals">
                            <MenuItem name="as">
                                <Icon type="soup-can"></Icon>
                                明细查阅
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
            <div id="skfe-app-main">
                <Layout>
                    <Content id="skfe-app-content">
                        <!--<Breadcrumb :style="{margin: '16px 0'}">-->
                        <!--<BreadcrumbItem>Home</BreadcrumbItem>-->
                        <!--<BreadcrumbItem>Components</BreadcrumbItem>-->
                        <!--<BreadcrumbItem>Layout</BreadcrumbItem>-->
                        <!--</Breadcrumb>-->

                        <router-view></router-view>


                    </Content>
                    <Footer id="skfe-app-footer">
                        © 2018 threebody.party
                    </Footer>

                </Layout>
            </div>
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

    @menu-width: 200px;
    #skfe-app-menu0 {
        width: @menu-width;
    }

    #skfe-app-main {
        min-height: 100vh;
    }

    #skfe-app-content {
        background: white;
        margin: 5px;
        padding: 5px;

    }

    #skfe-app-footer {
        text-align: center;
        background: transparent;
    }

    @media screen {
        #skfe-app-content {
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }

    }

    @media print {
        #skfe-app-content {

        }

        #skfe-app-menu0 {
            display: none;
        }

        #skfe-app-footer {
            display: none;
        }
    }
</style>

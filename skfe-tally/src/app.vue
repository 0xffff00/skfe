<template>
    <div>
        <Menu active-name="1" mode="horizontal" theme="light">
            <router-link to="/eg/time-grid-demo">
                <MenuItem name="1">aaa</MenuItem>
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
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
  export default {
    data: () => ({}),
    created () {

    }
  }
</script>
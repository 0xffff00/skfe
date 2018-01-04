<template>
    <div>
        <Menu active-name="1" mode="horizontal" theme="dark">
            <router-link to="/time-grid">
                <MenuItem name="1">时间格子</MenuItem>
            </router-link>
            <Submenu name="3">
                <template slot="title">
                    DICT(DEV only)
                </template>
                <MenuGroup title="other1" mode="horizontal">
                    <router-link to="/words/复旦大学/edit">
                        <MenuItem name="3">复旦大学</MenuItem>
                    </router-link>
                    <router-link to="/WordViewerDemo">
                        <MenuItem name="3">WordViewerDemo</MenuItem>
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
  import TimeGridDemo from './example/time-grid-demo.vue'
  import WordViewerDemo from './example/word-viewer-demo.vue'

  export default {
    data: () => ({}),
    created () {

    },
    components: {TimeGridDemo, WordViewerDemo}
  }
</script>
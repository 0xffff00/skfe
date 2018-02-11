<template>
    <div>
        <Menu active-name="1" mode="horizontal" theme="dark">
            <router-link to="/eg/time-grid-demo">
                <MenuItem name="1">时间格子</MenuItem>
            </router-link>
            <router-link to="/eg/words-overview">
                <MenuItem name="2">词汇总览</MenuItem>
            </router-link>
            <router-link to="/eg/remote-search">
                <MenuItem name="2">搜索控件示例</MenuItem>
            </router-link>



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
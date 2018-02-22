<template>
    <span>
        <Button size="small" :style="{minWidth:'120px'}" @click="modalVisible=true">
            {{value || (未选择)}}
        </Button>

        <Modal title="请选择一个客户" v-model="modalVisible" closable>
            <h4>输入新客户名：</h4>
            <Input v-model="value"></Input>
            <h4>或选择一个已存在的客户：</h4>
            <div>
                <Button size="small" v-for="b in allBuyers" :key="b.hanzi" @click="selectBuyer(b.hanzi)">
                    {{b.hanzi}}
                </Button>
            </div>
        </Modal>
    </span>
</template>
<script>
  export default {
    data: () => ({
      modalVisible: false
    }),
    props: {
      value: {type: String},
      allBuyers: {type: Array}
    }
  }
</script>
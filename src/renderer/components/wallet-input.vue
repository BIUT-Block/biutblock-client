<template>
  <input 
    :type="type" 
    :placeholder="placeholder" 
    :maxlength="maxlength" 
    :value="value" 
    ref="input"
    @input="$emit('input', $event.target.value)"/>
</template>

<script>
export default {
  name: 'walletInput',
  components: {

  },
  props: ['type', 'placeholder', 'value', 'maxlength'],
  data () {
    return {

    }
  },
  computed: {
    
  },
  created () {

  },
  mounted () {

  },
  destroyed () {},
  methods: {
    
  },
}
</script>

<style scoped>
  input {color: #F2F5FF;font-size: 14px;font-weight: 500;border:none;border-bottom: 1px solid #465299;height: 35px;
    line-height: 35px;width: 100%;font-family: Lato-Medium;background: none;}
</style>
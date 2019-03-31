<template>
  <input  :type="type" 
          :placeholder="placeholder" 
          :maxlength="maxlength" 
          :value="value" 
          ref="input"
          @input="$emit('input', $event.target.value)"
          onkeyup="this.value=this.value.replace(/\s+/g,'')"/>
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
  input {color: #252F33;font-size: 14px;font-weight: 500;border:none;border-bottom: 1px solid #E6E6E6;height: 35px;
    line-height: 35px;width: 100%;font-family: Lato-Medium;}
</style>
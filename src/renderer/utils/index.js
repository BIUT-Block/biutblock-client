import Vue from 'vue'
import VueI8n from 'vue-i18n'
import Cookies from 'js-cookie'
import enLocale from './en'
import zhLocale from './zh'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'

const messages = {
  en: Object.assign(enLocale, elementEnLocale),
  zh: Object.assign(zhLocale, elementZhLocale)
}

Vue.use(VueI8n)

export default new VueI8n({
  locale: Cookies.get('LANG') || 'en',
  messages
})

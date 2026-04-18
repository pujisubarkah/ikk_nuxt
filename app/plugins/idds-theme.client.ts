import { defineNuxtPlugin } from '#app'
import { setBrandTheme } from '@idds/vue'

export default defineNuxtPlugin(() => {
  setBrandTheme('lan')
})

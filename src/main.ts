import { createApp } from 'vue'
import App from './App.vue'
import { createTheme } from './theme/theme.class'
import router from './router'
import { elementPlusInit } from './plugins/elementPlus'
import { createVueInit } from '@/utils/vue/index'
import { directs } from '@/utils/vue/directs'
import { createPreloadCdn } from '@/plugins/preloadCdn.class'
import { createPlayProgress } from '@/class/playProgress.class'

createPreloadCdn()
createTheme()
createPlayProgress().getStore()

const app = createApp(App)
elementPlusInit(app)
createVueInit(app).useDirects(directs).useComps()
app.use(router).mount('#app')

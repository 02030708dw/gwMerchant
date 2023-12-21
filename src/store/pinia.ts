import { createPinia } from 'pinia'
import piniaPluginPersistence from 'pinia-plugin-persistedstate'
const pinia=createPinia()
pinia.use(piniaPluginPersistence)
export default pinia
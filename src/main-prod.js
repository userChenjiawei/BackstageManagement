import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/css/global.css";
import App from "./App.vue";
import "./assets/fonts/iconfont.css";
import moment from "moment";
// import { quillEditor } from 'vue-quill-editor'
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
import router from "./router/index.js";
import axios from "./components/API/axios";
import ZkTable from "vue-table-with-tree-grid";
import { antiShake } from "./components/plugins/fangzhou";
import { jieliu } from "./components/plugins/jieliu";
import VueParticles from "vue-particles";
const app = createApp(App);
moment.locale("zh-cn");
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$http = axios;
app.config.globalProperties.$fangdou = antiShake;
app.config.globalProperties.$jieliu = jieliu;
app.component("tree-Table", ZkTable);
// app.component('quill-editor', quillEditor)
app.use(router);
app.use(ElementPlus);
app.use(VueParticles);
app.mount("#app");

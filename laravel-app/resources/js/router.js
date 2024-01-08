import { createRouter, createWebHistory } from "vue-router";
import Wav from "../views/Wav.vue";
import Vtt from "../views/Vtt.vue";

const routes = [
    {
        path: "/",
        component: Wav,
        name: "wav",
    },
    {
        path: "/vtt",
        component: Vtt,
        name: "vtt",
    },

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

export default router;

<template>
    <v-app>
        <Header />
        <v-main style="background-color: #FFFAFA;">

            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import Header from "./Header.vue";
export default {
    components: {
        Header,
    },
};
</script>

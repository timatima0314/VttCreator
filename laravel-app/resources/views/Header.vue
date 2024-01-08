<template>
    <header class="header">
    <v-container>

            <div class="container">
                <h1>VttCreator</h1>
                <nav>
                    <ul class="nav__list">
                        <li class="nav__list-item">
                            <v-btn>
                                <router-link to="/">Wav</router-link>
                            </v-btn>
                        </li>
                        <li class="nav__list-item">
                            <v-btn>
                                <router-link to="/vtt">Vtt</router-link>
                            </v-btn>
                        </li>
                    </ul>
                </nav>
            </div>
        </v-container>
        </header>
</template>
<style scoped>
.header {
    width: 100%;
    height: 5rem;
    background-color: black;
    color: #fff;
}
.container {
    /* width: 1280px; */
    height: inherit;
    /* margin: 0 auto; */
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.nav__list {
    display: flex;
    list-style-type: none;
}
.nav__list-item {
    margin-right: 1rem;
}
a{
    text-decoration: none;
    color: #000;
}
</style>

import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const osTheme = window.matchMedia("(prefers-color-scheme: dark)");
const theme = osTheme.matches ? 'dark' : 'light';

export default new Vuetify({
    theme: {
        dark: theme
    },
});

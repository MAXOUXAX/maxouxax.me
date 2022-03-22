import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const osTheme = window.matchMedia("(prefers-color-scheme: dark)");
const theme = osTheme.matches ? 'dark' : 'light';

const colorPalette = {
    primary: '#1e3799',
    secondary: '#4a69bd',
    accent: '#6a89cc',
    error: '#eb2f06',
    info: '#82ccdd',
    success: '#78e08f',
    warning: '#fa983a'
}

export default new Vuetify({
    theme: {
        dark: theme,
        themes: {
            light: colorPalette,
            dark: colorPalette
        }
    },
});

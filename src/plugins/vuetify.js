import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import store from '@/store';

Vue.use(Vuetify);

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
        dark: store.state.theme,
        themes: {
            light: colorPalette,
            dark: colorPalette
        }
    },
});

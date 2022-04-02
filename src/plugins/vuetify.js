import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import store from '@/store';

Vue.use(Vuetify);

const colorPalette = {
    primary: '#4a69bd',
    secondary: '#6a89cc',
    accent: '#60a3bc',
    error: '#eb2f06',
    info: '#b8e994',
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

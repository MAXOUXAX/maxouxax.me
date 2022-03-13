import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const osTheme = window.matchMedia("(prefers-color-scheme: dark)");
const theme = osTheme.matches ? 'dark' : 'light';

export default new Vuetify({
    theme: {
        dark: theme,
        themes: {
            light: {
                primary: '#1976D2',
                secondary: '#e67e22',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107'
            },
            dark: {
                primary: '#1976D2',
                secondary: '#e67e22',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107'
            }
        }
    },
});

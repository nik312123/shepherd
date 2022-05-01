const {defineConfig} = require('@vue/cli-service');

module.exports = defineConfig({
    transpileDependencies: true,
    pwa: {
        name: 'Shepherd',
        themeColor: '#1A2434',
    }
});

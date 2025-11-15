const { defineConfig } = require('vitest/config')
const react = require('@vitejs/plugin-react')
const path = require('path') 

module.exports = defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Biar ga perlu import 'describe', 'it', 'expect'
    environment: 'jsdom', // Pake JSDOM buat simulasi browser
    setupFiles: './vitest.setup.js', // Ini file setup yang udah kita buat
    include: ['**/*.test.{js,jsx}'], // Pola file tes
  },
  // Ini blok penting buat benerin alias '@/'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

// 配置 axios 基础 URL
const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'
})

// 默认配置
const defaultConfig = {
  remoteConfig: [
    {
      label: "universal",
      options: [
        {
          label: "No-Urltest",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/no-urltest.ini"
        },
        {
          label: "Urltest",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/urltest.ini"
        }
      ]
    },
    {
      label: "customized",
      options: [
        {
          label: "Maying",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/maying.ini"
        },
        {
          label: "Ytoo",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ytoo.ini"
        },
        {
          label: "FlowerCloud",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/flowercloud.ini"
        },
        {
          label: "Nexitally",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/nexitally.ini"
        },
        {
          label: "SoCloud",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/socloud.ini"
        },
        {
          label: "ARK",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ark.ini"
        },
        {
          label: "ssrCloud",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ssrcloud.ini"
        }
      ]
    },
    {
      label: "Special",
      options: [
        {
          label: "NeteaseUnblock(仅规则，No-Urltest)",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/netease.ini"
        },
        {
          label: "Basic(仅GEOIP CN + Final)",
          value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/basic.ini"
        }
      ]
    }
  ],
  backendConfig: [
    { value: "http://127.0.0.1:25500/sub?" },
    { value: "https://sub.xeton.dev/sub?" },
    { value: "https://api.dler.io/sub?" }
  ]
}

export default new Vuex.Store({
  state: {
    remoteConfig: defaultConfig.remoteConfig,
    backendConfig: defaultConfig.backendConfig
  },
  mutations: {
    UPDATE_REMOTE_CONFIG(state, config) {
      state.remoteConfig = config
      // 保存到配置文件
      this.commit('SAVE_CONFIG_TO_FILE')
    },
    UPDATE_BACKEND_CONFIG(state, config) {
      state.backendConfig = config
      // 保存到配置文件
      this.commit('SAVE_CONFIG_TO_FILE')
    },
    SAVE_CONFIG_TO_FILE(state) {
      const config = {
        remoteConfig: state.remoteConfig,
        backendConfig: state.backendConfig
      }
      
      // 保存到 localStorage 作为备份
      localStorage.setItem('remoteConfig', JSON.stringify(state.remoteConfig))
      localStorage.setItem('backendConfig', JSON.stringify(state.backendConfig))
      
      // 保存到配置文件
      apiClient.post('/api/save-config', config).catch(err => {
        console.error('保存配置文件失败:', err)
      })
    },
    INIT_REMOTE_CONFIG(state) {
      // 优先从配置文件加载
      apiClient.get('/api/load-config')
        .then(response => {
          const config = response.data
          if (config.remoteConfig && Array.isArray(config.remoteConfig)) {
            state.remoteConfig = config.remoteConfig
          }
          if (config.backendConfig && Array.isArray(config.backendConfig)) {
            state.backendConfig = config.backendConfig
          }
        })
        .catch(() => {
          // 配置文件加载失败，尝试从 localStorage 加载
          try {
            const savedConfig = localStorage.getItem('remoteConfig')
            if (savedConfig) {
              const config = JSON.parse(savedConfig)
              if (Array.isArray(config)) {
                state.remoteConfig = config
              }
            }

            const savedBackendConfig = localStorage.getItem('backendConfig')
            if (savedBackendConfig) {
              const backendConfig = JSON.parse(savedBackendConfig)
              if (Array.isArray(backendConfig)) {
                state.backendConfig = backendConfig
              }
            }
          } catch (error) {
            console.error('初始化配置失败:', error)
          }
        })
    }
  }
}) 
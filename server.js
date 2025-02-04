const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()

// 配置文件路径
const CONFIG_FILE = '/data/config.json'

// 开发环境启用 CORS
if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
}

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.json())

// 加载配置
app.get('/api/load-config', (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
      res.json(config)
    } else {
      res.json({})
    }
  } catch (error) {
    console.error('读取配置文件失败:', error)
    res.status(500).json({ error: '读取配置文件失败' })
  }
})

// 保存配置
app.post('/api/save-config', (req, res) => {
  try {
    // 确保目录存在
    const dir = path.dirname(CONFIG_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    // 写入配置文件
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(req.body, null, 2))
    res.json({ success: true })
  } catch (error) {
    console.error('保存配置文件失败:', error)
    res.status(500).json({ error: '保存配置文件失败' })
  }
})

// 处理 Vue Router 的历史模式
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({ error: '服务器内部错误' })
})

// 启动服务器
const PORT = process.env.PORT || 8088
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})

// 优雅退出处理
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

function gracefulShutdown() {
  console.log('Received shutdown signal, closing server...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })

  // 如果 10 秒内没有完成关闭，强制退出
  setTimeout(() => {
    console.error('Could not close server in time, forcefully shutting down')
    process.exit(1)
  }, 10000)
} 
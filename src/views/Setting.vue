<template>
  <div class="setting-container">
    <el-card class="setting-card">
      <div slot="header">
        <span>远程配置管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleAdd">添加配置组</el-button>
      </div>

      <el-container class="setting-content">
        <!-- 左侧树形结构 -->
        <el-aside width="250px" class="tree-aside">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="远程配置" name="remote">
              <el-tree
                :data="treeData"
                :props="defaultProps"
                @node-click="handleNodeClick"
                highlight-current
                :expand-on-click-node="false"
                node-key="id"
                default-expand-all>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span class="tree-actions">
                    <el-button
                      type="text"
                      size="mini"
                      @click.stop="() => handleAddChild(data)"
                      v-if="!data.isLeaf">
                      <i class="el-icon-plus"></i>
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click.stop="() => handleDeleteNode(node, data)">
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </el-tab-pane>
            <el-tab-pane label="后端地址" name="backend">
              <div class="backend-list">
                <div v-for="(backend, index) in backendList" :key="index" class="backend-item">
                  <el-input 
                    v-model="backend.value" 
                    size="small"
                    placeholder="后端地址">
                    <el-button 
                      slot="append" 
                      icon="el-icon-delete"
                      @click="handleDeleteBackend(index)">
                    </el-button>
                  </el-input>
                </div>
                <el-button 
                  type="text" 
                  icon="el-icon-plus"
                  @click="handleAddBackend"
                  style="margin-top: 10px">
                  添加后端地址
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-aside>

        <!-- 右侧表单 -->
        <el-main class="form-main">
          <template v-if="activeTab === 'remote'">
            <el-form v-if="currentNode" :model="currentNode" label-width="100px">
              <el-form-item label="名称">
                <el-input v-model="currentNode.label"></el-input>
              </el-form-item>
              <el-form-item label="链接" v-if="currentNode.isLeaf">
                <el-input v-model="currentNode.value" type="textarea" :rows="4"></el-input>
              </el-form-item>
            </el-form>
            <div v-else class="empty-tip">
              请选择左侧节点进行编辑
            </div>
          </template>
          <template v-else>
            <div class="backend-tip">
              <h3>后端地址说明</h3>
              <p>1. 后端地址必须以 /sub? 结尾</p>
              <p>2. 建议自行搭建后端服务</p>
              <p>3. 公共后端可能会有限制</p>
            </div>
          </template>
        </el-main>
      </el-container>

      <div class="setting-footer">
        <el-button @click="$router.push('/')" style="margin-right: 10px">返回</el-button>
        <el-button type="primary" @click="handleSave">保存配置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Setting',
  data() {
    return {
      activeTab: 'remote',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentNode: null,
      treeData: [],
      backendList: []
    }
  },
  computed: {
    ...mapState(['remoteConfig', 'backendConfig'])
  },
  created() {
    this.$nextTick(() => {
      this.initTreeData()
      this.backendList = Array.isArray(this.backendConfig) 
        ? JSON.parse(JSON.stringify(this.backendConfig))
        : []
    })
  },
  methods: {
    ...mapMutations(['UPDATE_REMOTE_CONFIG', 'UPDATE_BACKEND_CONFIG']),
    
    // 初始化树形数据
    initTreeData() {
      this.treeData = this.remoteConfig.map((group, groupIndex) => {
        return {
          id: 'group_' + groupIndex,
          label: group.label,
          children: group.options.map((option, optionIndex) => ({
            id: `group_${groupIndex}_option_${optionIndex}`,
            label: option.label,
            value: option.value,
            isLeaf: true
          }))
        }
      })
    },

    // 处理节点点击
    handleNodeClick(data) {
      this.currentNode = JSON.parse(JSON.stringify(data))
    },

    // 添加配置组
    handleAdd() {
      const newGroup = {
        id: 'group_' + this.treeData.length,
        label: '新配置组',
        children: []
      }
      this.treeData.push(newGroup)
      this.currentNode = newGroup
    },

    // 添加子节点
    handleAddChild(data) {
      const newChild = {
        id: `${data.id}_option_${data.children.length}`,
        label: '新配置项',
        value: '',
        isLeaf: true
      }
      data.children.push(newChild)
      this.currentNode = newChild
    },

    // 删除节点
    handleDeleteNode(node, data) {
      this.$confirm('确认删除该节点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
        if (this.currentNode && this.currentNode.id === data.id) {
          this.currentNode = null
        }
        this.$message.success('删除成功')
      }).catch(() => {})
    },

    // 添加后端地址
    handleAddBackend() {
      if (!Array.isArray(this.backendList)) {
        this.backendList = []
      }
      this.backendList.push({
        value: ''
      })
    },

    // 删除后端地址
    handleDeleteBackend(index) {
      if (!Array.isArray(this.backendList)) {
        return
      }
      this.$confirm('确认删除该后端地址?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.backendList.splice(index, 1)
        this.$message.success('删除成功')
      }).catch(() => {})
    },

    // 保存配置
    handleSave() {
      // 验证并保存远程配置
      const config = this.treeData.map(group => ({
        label: group.label,
        options: group.children.map(option => ({
          label: option.label,
          value: option.value
        }))
      }))

      // 验证配置
      let valid = true
      config.forEach(group => {
        if (!group.label) {
          valid = false
          this.$message.error('配置组名称不能为空')
          return false
        }
        group.options.forEach(option => {
          if (!option.label || !option.value) {
            valid = false
            this.$message.error('配置项名称和链接不能为空')
            return false
          }
        })
      })

      // 验证后端地址
      if (!Array.isArray(this.backendList)) {
        this.backendList = []
      }
      
      valid = true
      this.backendList.forEach(backend => {
        if (!backend.value) {
          valid = false
          this.$message.error('后端地址不能为空')
          return false
        }
        if (!backend.value.endsWith('/sub?')) {
          valid = false
          this.$message.error('后端地址必须以 /sub? 结尾')
          return false
        }
      })

      if (!valid) return

      // 更新 store
      this.UPDATE_REMOTE_CONFIG(config)
      this.UPDATE_BACKEND_CONFIG(this.backendList)
      
      // 保存到 localStorage
      localStorage.setItem('remoteConfig', JSON.stringify(config))
      localStorage.setItem('backendConfig', JSON.stringify(this.backendList))
      
      this.$message.success('保存成功')
      
      // 保存后返回主页
      this.$router.push('/')
    }
  },
  watch: {
    // 监听当前节点变化，自动更新树形数据
    currentNode: {
      deep: true,
      handler(newVal) {
        if (!newVal) return
        
        const updateNode = (nodes) => {
          for (let node of nodes) {
            if (node.id === newVal.id) {
              Object.assign(node, newVal)
              return true
            }
            if (node.children && node.children.length) {
              if (updateNode(node.children)) return true
            }
          }
          return false
        }
        
        updateNode(this.treeData)
      }
    }
  }
}
</script>

<style scoped>
.setting-container {
  padding: 20px;
  height: 100%;
}

.setting-card {
  height: calc(50vh - 40px);
  display: flex;
  flex-direction: column;
}

.setting-content {
  flex: 1;
  overflow: hidden;
}

.tree-aside {
  border-right: 1px solid #e6e6e6;
  overflow-y: auto;
}

.form-main {
  padding: 20px;
  overflow-y: auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.tree-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.custom-tree-node:hover .tree-actions {
  opacity: 1;
}

.empty-tip {
  color: #909399;
  text-align: center;
  margin-top: 100px;
}

.setting-footer {
  text-align: center;
  padding: 10px 0;
  border-top: 1px solid #e6e6e6;
}

.backend-list {
  padding: 10px;
}

.backend-item {
  margin-bottom: 10px;
}

.backend-tip {
  color: #606266;
  line-height: 1.8;
}

.backend-tip h3 {
  margin-bottom: 15px;
}
</style> 
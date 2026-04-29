1. <template>
  <div class="help-container">
    <div class="help-content">
      <div class="help-header">
        <h1><el-icon><QuestionFilled /></el-icon> 使用说明</h1>
        <p class="subtitle">孚盟工作平台系统操作指南</p>
      </div>

      <!-- 支持的功能 -->
      <section class="section supported">
        <h2><el-icon color="#67C23A"><CircleCheckFilled /></el-icon> 支持的功能</h2>
        
        <div class="feature-group">
          <h3><el-icon><FolderOpened /></el-icon> 系统管理</h3>
          <ul>
            <li><strong>查看系统列表</strong> - 在"全部系统"中浏览所有预定义和自定义系统</li>
            <li><strong>添加自定义系统</strong> - 点击"添加系统"按钮，创建个人工作系统入口</li>
            <li><strong>编辑系统信息</strong> - 修改系统名称、地址、描述、图标、颜色等属性</li>
            <li><strong>删除自定义系统</strong> - 可以删除自己添加的系统（预定义系统不可删除）</li>
            <li><strong>分类浏览</strong> - 通过顶部标签页按分类查看系统</li>
            <li><strong>搜索系统</strong> - 使用搜索框快速查找系统名称或描述</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3><el-icon><Star /></el-icon> 收藏功能</h3>
          <ul>
            <li><strong>收藏系统</strong> - 点击卡片右上角的星标，将系统添加到常用系统</li>
            <li><strong>取消收藏</strong> - 再次点击星标即可取消收藏</li>
            <li><strong>常用系统区</strong> - 收藏的系统会在顶部常用区域显示</li>
            <li><strong>默认收藏</strong> - 新用户默认收藏常用的几个系统</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3><el-icon><Download /></el-icon> 导入导出</h3>
          <ul>
            <li><strong>导出为JSON</strong> - 导出所有系统为简单JSON格式</li>
            <li><strong>导出为浏览器收藏夹</strong> - 导出为Chrome/Edge兼容的收藏夹格式</li>
            <li><strong>导入JSON</strong> - 支持导入简单JSON格式的系统列表</li>
            <li><strong>导入浏览器收藏夹</strong> - 支持导入Chrome/Edge导出的书签JSON文件</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3><el-icon><MagicStick /></el-icon> 界面设置</h3>
          <ul>
            <li><strong>多主题切换</strong> - 支持浅色、深色等多种主题模式</li>
            <li><strong>响应式布局</strong> - 自动适配桌面和移动设备</li>
            <li><strong>URL悬停提示</strong> - 鼠标悬停在系统卡片上时显示完整URL</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3><el-icon><Connection /></el-icon> 系统分类</h3>
          <ul>
            <li v-for="cat in categoryList" :key="cat">
              <strong>{{ cat }}</strong> - 系统分类
            </li>
          </ul>
        </div>
      </section>

      <!-- 不支持的功能 -->
      <section class="section unsupported">
        <h2><el-icon color="#F56C6C"><CircleCloseFilled /></el-icon> 暂不支持的功能</h2>
        
        <div class="feature-group">
          <h3><el-icon><Warning /></el-icon> 系统管理</h3>
          <ul>
            <li><strong>删除预定义系统</strong> - 平台预置的系统不支持删除，防止误操作</li>
            <li><strong>修改预定义系统</strong> - 预定义系统的属性（URL等）不可修改</li>
            <li><strong>自定义分类</strong> - 目前不支持创建新的系统分类</li>
            <li><strong>拖动排序</strong> - 目前不支持手动拖动系统调整顺序</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3><el-icon><Lock /></el-icon> 数据管理</h3>
          <ul>
            <li><strong>数据云同步</strong> - 数据存储在本地浏览器，不支持多设备同步</li>
            <li><strong>批量导入</strong> - 不支持从Excel或其他格式批量导入</li>
            <li><strong>数据备份</strong> - 不支持自动备份，需手动导出JSON备份</li>
            <li><strong>导入到常用</strong> - 导入的系统不会自动添加到常用列表</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3><el-icon><Monitor /></el-icon> 高级功能</h3>
          <ul>
            <li><strong>系统状态监测</strong> - 不支持检测系统是否在线</li>
            <li><strong>快捷键</strong> - 不支持键盘快捷键操作</li>
            <li><strong>深色模式自动切换</strong> - 不支持根据系统时间自动切换主题</li>
            <li><strong>多语言</strong> - 仅支持简体中文界面</li>
          </ul>
        </div>
      </section>

      <!-- 导入格式示例 -->
      <section class="section format-example">
        <h2><el-icon><Document /></el-icon> 导入格式示例</h2>
        
        <div class="format-tabs">
          <el-tabs v-model="activeFormat">
            <el-tab-pane label="简单JSON格式" name="simple">
              <pre class="code-block">{{ simpleJsonExample }}</pre>
            </el-tab-pane>
            <el-tab-pane label="Chrome收藏夹格式" name="chrome">
              <pre class="code-block">{{ chromeJsonExample }}</pre>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="tips">
          <el-alert type="info" :closable="false">
            <template #title>
              <strong>导入提示：</strong>
              <ul class="tips-list">
                <li>支持的文件格式：<code>.json</code></li>
                <li>导入后系统默认添加到"导入"分类</li>
                <li>导入的系统不会自动加入常用系统</li>
                <li>如导入失败，请检查JSON格式是否正确</li>
              </ul>
            </template>
          </el-alert>
        </div>
      </section>

      <!-- 快捷操作 -->
      <section class="section shortcuts">
        <h2><el-icon><Pointer /></el-icon> 常用操作</h2>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span><el-icon><Plus /></el-icon> 添加系统</span>
                </div>
              </template>
              <p>点击顶部"添加系统"按钮，填写系统名称、URL、描述等信息即可添加新的系统入口。</p>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span><el-icon><Star /></el-icon> 收藏系统</span>
                </div>
              </template>
              <p>将鼠标移到系统卡片右上角，点击星形图标即可将系统添加到常用列表。</p>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span><el-icon><Download /></el-icon> 导出备份</span>
                </div>
              </template>
              <p>点击"导出"按钮，可以选择JSON格式或浏览器收藏夹格式进行数据备份。</p>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span><el-icon><Upload /></el-icon> 导入数据</span>
                </div>
              </template>
              <p>点击"导入"按钮，选择符合格式的JSON文件，即可批量导入系统数据。</p>
            </el-card>
          </el-col>
        </el-row>
      </section>

      <!-- 返回按钮 -->
      <div class="back-btn">
        <el-button type="primary" size="large" @click="$router.push('/')">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  QuestionFilled, CircleCheckFilled, CircleCloseFilled, Warning, Lock,
  FolderOpened, Star, Connection, Document, Pointer, Plus,
  Download, Upload, ArrowLeft, MagicStick
} from '@element-plus/icons-vue'
import { useSystemStore } from '@/stores/system'

const store = useSystemStore()
const activeFormat = ref('simple')

// 动态获取分类列表（排除"全部"）
const categoryList = computed(() => {
  return store.categories.filter(c => c !== '全部')
})

const simpleJsonExample = `[
  {
    "name": "系统名称",
    "url": "https://example.com"
  },
  {
    "name": "另一个系统",
    "url": "https://another.com"
  }
]`

const chromeJsonExample = `{
  "version": 1,
  "children": [
    {
      "name": "文件夹名称",
      "type": "folder",
      "children": [
        {
          "name": "链接名称",
          "url": "https://example.com",
          "type": "url"
        }
      ]
    }
  ]
}`
</script>

<style scoped>
.help-container {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.help-content {
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.help-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
}

.help-header h1 {
  font-size: 32px;
  color: #303133;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.help-header .subtitle {
  color: #909399;
  font-size: 16px;
  margin-top: 10px;
}

.section {
  margin-bottom: 40px;
}

.section h2 {
  font-size: 20px;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-group {
  margin-bottom: 20px;
}

.feature-group h3 {
  font-size: 16px;
  color: #606266;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-group ul {
  list-style: none;
  padding-left: 20px;
}

.feature-group li {
  color: #606266;
  line-height: 2;
  position: relative;
}

.feature-group li::before {
  content: "•";
  position: absolute;
  left: -15px;
  color: #409EFF;
}

.feature-group li strong {
  color: #303133;
}

.supported .feature-group li::before {
  color: #67C23A;
}

.unsupported .feature-group li::before {
  color: #F56C6C;
}

.format-example .code-block {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  border: 1px solid #e4e7ed;
  max-height: 300px;
}

.tips {
  margin-top: 20px;
}

.tips-list {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.tips-list li {
  line-height: 2;
}

.tips-list code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  color: #409EFF;
}

.shortcuts .el-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.back-btn {
  text-align: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .help-content {
    padding: 20px;
  }

  .help-header h1 {
    font-size: 24px;
  }

  .shortcuts .el-col {
    margin-bottom: 16px;
  }
}
</style>

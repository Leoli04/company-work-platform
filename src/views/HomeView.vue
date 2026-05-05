<template>
  <div class="home-container" v-loading="store.isLoading" element-loading-text="加载中...">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <el-icon :size="32" color="#fff"><Platform /></el-icon>
          <h1>工作平台</h1>
        </div>
        <div class="header-actions">
          <el-dropdown @command="handleExport" trigger="click">
            <el-button type="success" plain>
              <el-icon><Download /></el-icon>
              导出
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="json">JSON 格式</el-dropdown-item>
                <el-dropdown-item command="chrome">Chrome/Edge 收藏夹</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown @command="handleThemeChange" trigger="click">
            <el-button type="info" plain>
              <el-icon><MagicStick /></el-icon>
              主题
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(theme, key) in themes"
                  :key="key"
                  :command="key"
                  :class="{ 'is-active': currentThemeKey === key }"
                >
                  <el-icon><Check v-if="currentThemeKey === key" /></el-icon>
                  {{ theme.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="primary" :icon="Plus" @click="handleAdd">
            添加系统
          </el-button>
          <el-link type="info" :underline="false" class="header-help-link" @click="$router.push('/help')">
            <el-icon><QuestionFilled /></el-icon>
            使用说明
          </el-link>
        </div>
      </div>
    </header>

    <!-- 搜索和筛选 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索系统名称..."
        :prefix-icon="Search"
        clearable
        class="search-input"
        size="large"
      />
      <!-- 特殊Tab行：全部、预定义、我添加 -->
      <div class="special-tabs">
        <el-tag
          v-for="cat in categories"
          :key="cat"
          :type="selectedCategory === cat ? 'primary' : 'info'"
          effect="dark"
          class="category-tag"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </el-tag>
      </div>
      <!-- 预定义分类Tab行（全部/预定义时显示） -->
      <div v-if="selectedCategory === '全部' || selectedCategory === '预定义'" class="category-tabs default-categories">
        <span class="category-label">系统分类：</span>
        <el-tag
          v-for="cat in store.defaultCategoryTabs"
          :key="cat"
          :type="selectedDefaultCategory === cat ? 'primary' : 'info'"
          effect="dark"
          class="category-tag"
          :class="{ 'is-drag-over': dragOverTab === cat }"
          @click="handleSelectDefaultCategory(cat)"
          @dragstart="handleTabDragStart($event, cat, index)"
          @dragover.prevent="handleTabDragOver($event, cat)"
          @dragleave="handleTabDragLeave"
          @drop="handleTabDrop($event, cat)"
          @dragend="handleTabDragEnd"
        >
          {{ cat }}
        </el-tag>
      </div>
      <!-- 自定义分类Tab行（全部/我添加时显示） -->
      <div v-if="selectedCategory === '全部' || selectedCategory === '我添加'" class="category-tabs custom-categories">
        <span class="category-label">我的分类：</span>
        <div
          v-for="(cat, index) in store.customCategoryTabs"
          :key="cat"
          class="category-tag-wrapper"
        >
          <el-tag
            :type="selectedSubCategory === cat ? 'primary' : 'info'"
            effect="dark"
            class="category-tag"
            :class="{ 'is-drag-over': dragOverTab === cat, 'is-selected': selectedSubCategory === cat }"
            @click="handleSelectMyCategory(cat)"
            @dragstart="handleTabDragStart($event, cat, index, true)"
            @dragover.prevent="handleTabDragOver($event, cat)"
            @dragleave="handleTabDragLeave"
            @drop="handleTabDrop($event, cat)"
            @dragend="handleTabDragEnd"
          >
            {{ cat }}
            <el-dropdown trigger="click" @command="(cmd) => handleCategoryCommand(cmd, cat)" @click.stop>
              <span class="category-arrow-wrapper" @click.stop>
                <el-icon class="category-arrow"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">
                    <el-icon><Edit /></el-icon>
                    编辑分类
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    <el-icon><Delete /></el-icon>
                    删除分类
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tag>
        </div>
        <el-tag
          type="success"
          effect="plain"
          class="category-tag add-cat-btn"
          @click="showAddCategoryDialog = true"
        >
          <el-icon><Plus /></el-icon>
          添加分类
        </el-tag>
      </div>
      <!-- 系统分类Tab行（仅"我添加"时显示，用于归类自定义系统） -->
      <div v-if="selectedCategory === '我添加' && store.customSystemsCategoryTabs.length > 0" class="category-tabs custom-systems-categories">
        <span class="category-label">系统分类：</span>
        <el-tag
          v-for="cat in store.customSystemsCategoryTabs"
          :key="cat"
          :type="selectedCustomSubCategory === cat ? 'primary' : 'info'"
          effect="dark"
          class="category-tag"
          @click="handleSelectSystemCategory(cat)"
        >
          {{ cat }}
        </el-tag>
      </div>
    </div>

    <!-- 添加分类对话框 -->
    <el-dialog v-model="showAddCategoryDialog" title="添加分类" width="400px">
      <el-form :model="newCategoryForm" :rules="categoryRules" ref="categoryFormRef">
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="newCategoryForm.name"
            placeholder="请输入分类名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddCategoryDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddCategory">确定</el-button>
      </template>
    </el-dialog>

    <!-- 删除分类对话框 -->
    <el-dialog v-model="showDeleteCategoryDialog" title="删除分类" width="400px">
      <p>确定要删除分类「<strong>{{ categoryToDelete }}</strong>」吗？</p>
      <p v-if="getCategorySystemCount(categoryToDelete) > 0" style="color: #E6A23C; font-size: 13px; margin-top: 10px;">
        <el-icon><Warning /></el-icon> 该分类下有 {{ getCategorySystemCount(categoryToDelete) }} 个系统，删除后这些系统将变为未分类状态
      </p>
      <p v-else style="color: #909399; font-size: 13px; margin-top: 10px;">
        该分类下没有系统，删除后无法恢复。
      </p>
      <template #footer>
        <el-button @click="showDeleteCategoryDialog = false">取消</el-button>
        <el-button type="danger" @click="handleDeleteCategory">删除</el-button>
      </template>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog v-model="showEditCategoryDialog" title="编辑分类" width="400px">
      <el-form :model="editCategoryForm" :rules="categoryRules" ref="editCategoryFormRef">
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="editCategoryForm.name"
            placeholder="请输入分类名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditCategoryDialog = false">取消</el-button>
        <el-button type="primary" @click="handleEditCategory">确定</el-button>
      </template>
    </el-dialog>

    <!-- 收藏区域 -->
    <div v-if="favoriteSystems.length > 0 && !searchQuery" class="section favorites-section">
      <div class="favorites-header">
        <h2 class="section-title favorites-title">
          <el-icon class="star-icon"><StarFilled /></el-icon>
          <span>常用系统</span>
          <el-tag type="warning" size="small" effect="dark">{{ favoriteSystems.length }}</el-tag>
        </h2>
        <div class="favorites-actions">
          <span class="favorites-tip">点击卡片右上角星标可取消收藏</span>
          <el-button text @click="favoritesCollapsed = !favoritesCollapsed">
            {{ favoritesCollapsed ? '展开' : '收起' }}
            <el-icon>
              <ArrowUp v-if="!favoritesCollapsed" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>
      </div>
      <div v-show="!favoritesCollapsed" class="systems-grid favorites-grid">
        <SystemCard
          v-for="system in favoriteSystems"
          :key="system.id"
          :system="system"
          :compact="true"
          @open="openSystem"
          @toggle-favorite="toggleFavorite"
          @edit="handleEdit"
          @delete="handleDelete"
          @hover="onCardHover"
        />
      </div>
    </div>

    <!-- 全部系统 -->
    <div class="section all-systems">
      <h2 class="section-title">
        <el-icon><Grid /></el-icon>
        {{ searchQuery ? '搜索结果' : '全部系统' }}
        <span class="count">({{ filteredSystems.length }})</span>
      </h2>

      <!-- 全部模式：按分类分组显示 -->
      <div v-if="selectedCategory === '全部' && !searchQuery && !selectedDefaultCategory && !selectedSubCategory">
        <div
          v-for="(systems, category) in groupedSystems"
          :key="category"
          class="category-group"
          :class="{ 'drag-over': dragOverCategory === category }"
          @dragover.prevent="handleDragOver($event, category)"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, category)"
        >
          <div class="category-header">
            <span class="category-name">{{ category }}</span>
            <span class="category-count">{{ systems.length }} 个系统</span>
          </div>
          <div class="systems-grid">
            <SystemCard
              v-for="system in systems"
              :key="system.id"
              :system="system"
              :draggable="system.isCustom"
              @open="openSystem"
              @toggle-favorite="toggleFavorite"
              @edit="handleEdit"
              @delete="handleDelete"
              @hover="onCardHover"
              @dragstart="handleDragStart($event, system)"
              @dragend="handleDragEnd"
            />
          </div>
        </div>
      </div>

      <!-- 分类模式或搜索模式：平铺显示 -->
      <div v-else-if="filteredSystems.length > 0" class="systems-grid">
        <SystemCard
          v-for="system in filteredSystems"
          :key="system.id"
          :system="system"
          @open="openSystem"
          @toggle-favorite="toggleFavorite"
          @edit="handleEdit"
          @delete="handleDelete"
          @hover="onCardHover"
        />
      </div>
      <el-empty v-else description="未找到匹配的系统" />
    </div>

    <!-- 添加/编辑弹窗 -->
    <SystemDialog
      v-model:visible="dialogVisible"
      :system="currentSystem"
      :is-edit="isEdit"
      @submit="handleSubmit"
    />

    <!-- URL 悬停提示 -->
    <transition name="fade">
      <div v-if="hoveredUrl" class="url-tooltip">
        <el-icon><Link /></el-icon>
        <span>{{ hoveredUrl }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Platform, StarFilled, Grid, MagicStick, Check, ArrowUp, ArrowDown, Download, QuestionFilled } from '@element-plus/icons-vue'
import SystemCard from '@/components/SystemCard.vue'
import SystemDialog from '@/components/SystemDialog.vue'
import { useSystemStore } from '@/stores/system'
import { useThemeStore } from '@/stores/theme'

const store = useSystemStore()
const themeStore = useThemeStore()
const hoveredUrl = ref('')
const dragOverCategory = ref('')
const draggedSystem = ref(null)

// 分类拖拽相关
const dragOverTab = ref('')
const draggedTab = ref(null)
const draggedTabIndex = ref(-1)
const draggedTabIsCustom = ref(false)

// 添加分类相关
const showAddCategoryDialog = ref(false)
const showDeleteCategoryDialog = ref(false)
const showEditCategoryDialog = ref(false)
const categoryToDelete = ref('')
const categoryToEdit = ref('')
const newCategoryForm = ref({ name: '' })
const editCategoryForm = ref({ name: '' })
const categoryFormRef = ref(null)
const editCategoryFormRef = ref(null)

const categoryRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

const themes = themeStore.themes
const currentThemeKey = computed(() => themeStore.currentThemeKey)

// 监听卡片悬停
function onCardHover(url) {
  hoveredUrl.value = url
}

function handleThemeChange(themeKey) {
  themeStore.setTheme(themeKey)
  ElMessage.success(`已切换到${themes[themeKey].name}主题`)
}

function handleExport(type) {
  if (type === 'json') {
    const content = store.exportAsJson()
    store.downloadFile(content, '工作平台.json')
    ElMessage.success('JSON 格式导出成功')
  } else if (type === 'chrome') {
    const content = store.exportAsBrowserBookmarks()
    store.downloadFile(content, '工作平台_收藏夹.json')
    ElMessage.success('Chrome/Edge 收藏夹导出成功')
  }
}

const searchQuery = ref('')
const selectedCategory = ref('全部')
const selectedSubCategory = ref('') // 用于"我的分类"
const selectedDefaultCategory = ref('') // 用于"全部/预定义"模式下的"系统分类"
const selectedCustomSubCategory = ref('') // 用于"我添加"模式下的"系统分类"
const dialogVisible = ref(false)
const currentSystem = ref(null)
const isEdit = ref(false)
const favoritesCollapsed = ref(false)

const categories = computed(() => store.categories)
const favoriteSystems = computed(() => store.favoriteSystems)

// 分类标签拖拽排序
function handleTabDragStart(event, cat, index, isCustom = false) {
  draggedTab.value = cat
  draggedTabIndex.value = index
  draggedTabIsCustom.value = isCustom
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', cat)
}

function handleTabDragOver(event, cat) {
  if (draggedTab.value && draggedTab.value !== cat && cat !== '全部' && cat !== '预定义' && cat !== '我添加') {
    dragOverTab.value = cat
  }
}

function handleTabDragLeave() {
  dragOverTab.value = ''
}

function handleTabDrop(event, targetCat) {
  event.preventDefault()
  // 不允许拖拽到特殊tab
  if (!draggedTab.value || targetCat === '全部' || targetCat === '预定义' || targetCat === '我添加') {
    handleTabDragEnd()
    return
  }

  if (draggedTabIsCustom.value) {
    // 自定义分类拖拽排序
    const currentOrder = [...store.customCategories]
    const fromIndex = currentOrder.indexOf(draggedTab.value)
    const toIndex = currentOrder.indexOf(targetCat)

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      currentOrder.splice(fromIndex, 1)
      currentOrder.splice(toIndex, 0, draggedTab.value)
      // 只保存自定义分类顺序
      localStorage.setItem('fuma_work_platform_custom_category_order', JSON.stringify(currentOrder))
      ElMessage.success('分类顺序已保存')
    }
  } else {
    // 预定义分类拖拽排序
    const currentOrder = store.getCategoryOrder()
    const fromIndex = currentOrder.indexOf(draggedTab.value)
    const toIndex = currentOrder.indexOf(targetCat)

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      currentOrder.splice(fromIndex, 1)
      currentOrder.splice(toIndex, 0, draggedTab.value)
      store.updateCategoryOrder(currentOrder)
      ElMessage.success('分类顺序已保存')
    }
  }

  handleTabDragEnd()
}

function handleTabDragEnd() {
  draggedTab.value = null
  draggedTabIndex.value = -1
  draggedTabIsCustom.value = false
  dragOverTab.value = ''
}

// 选择系统分类（清除我的分类选中）
function handleSelectSystemCategory(cat) {
  selectedCustomSubCategory.value = cat
  selectedSubCategory.value = ''
}

// 选择默认分类（清除我的分类选中）
function handleSelectDefaultCategory(cat) {
  if (selectedDefaultCategory.value === cat) {
    selectedDefaultCategory.value = ''
  } else {
    selectedDefaultCategory.value = cat
    selectedSubCategory.value = ''
  }
}

// 选择我的分类（清除系统分类选中）
function handleSelectMyCategory(cat) {
  if (selectedSubCategory.value === cat) {
    selectedSubCategory.value = ''
  } else {
    selectedSubCategory.value = cat
    selectedDefaultCategory.value = ''
    selectedCustomSubCategory.value = ''
  }
}

// 添加分类
function handleAddCategory() {
  categoryFormRef.value?.validate((valid) => {
    if (valid) {
      const result = store.addCustomCategory(newCategoryForm.value.name)
      if (result.success) {
        ElMessage.success('分类添加成功')
        showAddCategoryDialog.value = false
        newCategoryForm.value.name = ''
      } else {
        ElMessage.error(result.error)
      }
    }
  })
}

// 处理分类操作（编辑/删除）
function handleCategoryCommand(command, cat) {
  if (command === 'edit') {
    categoryToEdit.value = cat
    editCategoryForm.value.name = cat
    showEditCategoryDialog.value = true
  } else if (command === 'delete') {
    categoryToDelete.value = cat
    showDeleteCategoryDialog.value = true
  }
}

// 编辑分类
function handleEditCategory() {
  if (!editCategoryFormRef.value) {
    showEditCategoryDialog.value = false
    return
  }
  
  editCategoryFormRef.value.validate((valid) => {
    if (valid) {
      const oldName = categoryToEdit.value
      const newName = editCategoryForm.value.name.trim()
      
      if (newName === oldName) {
        showEditCategoryDialog.value = false
        return
      }
      
      const result = store.updateCustomCategory(oldName, newName)
      if (result.success) {
        ElMessage.success('分类修改成功')
        showEditCategoryDialog.value = false
        if (selectedSubCategory.value === oldName) {
          selectedSubCategory.value = newName
        }
      } else {
        ElMessage.error(result.error)
      }
    }
  })
}

// 删除分类
function handleDeleteCategory() {
  const result = store.deleteCustomCategory(categoryToDelete.value)
  if (result.success) {
    ElMessage.success('分类已删除')
    if (selectedSubCategory.value === categoryToDelete.value) {
      selectedSubCategory.value = ''
    }
  } else {
    ElMessage.error(result.error)
  }
  setTimeout(() => {
    showDeleteCategoryDialog.value = false
  }, 100)
}

// 获取某分类下的系统数量
function getCategorySystemCount(categoryName) {
  return store.systems.filter(s => s.category === categoryName && s.isCustom).length
}

// 按分类分组的系统
const groupedSystems = computed(() => {
  const groups = {}
  store.systems.forEach(system => {
    if (!groups[system.category]) {
      groups[system.category] = []
    }
    groups[system.category].push(system)
  })
  return groups
})

const filteredSystems = computed(() => {
  let result = store.systems
  
  // 根据主分类筛选
  if (selectedCategory.value === '预定义') {
    result = result.filter(s => !s.isCustom)
    // 根据子分类筛选
    if (selectedDefaultCategory.value) {
      result = result.filter(s => s.category === selectedDefaultCategory.value)
    }
  } else if (selectedCategory.value === '我添加') {
    result = result.filter(s => s.isCustom)
    // 互斥筛选：我的分类 OR 系统分类
    if (selectedSubCategory.value) {
      result = result.filter(s => s.category === selectedSubCategory.value)
    } else if (selectedCustomSubCategory.value) {
      result = result.filter(s => s.category === selectedCustomSubCategory.value)
    }
  } else if (selectedCategory.value === '全部') {
    // 互斥筛选：系统分类 OR 我的分类
    if (selectedDefaultCategory.value) {
      result = result.filter(s => s.category === selectedDefaultCategory.value)
    } else if (selectedSubCategory.value) {
      result = result.filter(s => s.category === selectedSubCategory.value)
    }
  }
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    )
  }
  
  return result
})

function openSystem(system) {
  let url = system.url
  // 如果 URL 没有协议前缀，添加 https://
  if (url && !url.match(/^https?:\/\//i)) {
    url = 'https://' + url
  }
  window.open(url, '_blank')
}

function toggleFavorite(id) {
  store.toggleFavorite(id)
}

function handleAdd() {
  currentSystem.value = null
  isEdit.value = false
  dialogVisible.value = true
}

function handleEdit(system) {
  currentSystem.value = { ...system }
  isEdit.value = true
  dialogVisible.value = true
}

function handleDelete(id) {
  ElMessageBox.confirm('确定要删除该系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.deleteSystem(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function handleSubmit(data) {
  if (isEdit.value) {
    store.updateSystem(currentSystem.value.id, data)
    ElMessage.success('修改成功')
  } else {
    store.addSystem(data)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
}

// 拖拽相关函数
function handleDragStart(event, system) {
  draggedSystem.value = system
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', JSON.stringify({ id: system.id, category: system.category }))
}

function handleDragEnd() {
  draggedSystem.value = null
  dragOverCategory.value = ''
}

function handleDragOver(event, category) {
  event.dataTransfer.dropEffect = 'move'
  dragOverCategory.value = category
}

function handleDragLeave() {
  dragOverCategory.value = ''
}

function handleDrop(event, targetCategory) {
  event.preventDefault()
  const data = JSON.parse(event.dataTransfer.getData('text/plain'))
  
  // 只有自定义系统才能拖动
  if (data.id && draggedSystem.value?.isCustom) {
    const sourceCategory = draggedSystem.value.category
    if (sourceCategory !== targetCategory) {
      store.updateSystem(data.id, { category: targetCategory })
      ElMessage.success(`已将「${draggedSystem.value.name}」移动到「${targetCategory}」分类`)
    }
  }
  
  draggedSystem.value = null
  dragOverCategory.value = ''
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding-bottom: 40px;
}

.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px 40px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.header-help-link {
  opacity: 0.6;
  transition: opacity 0.3s;
  margin-left: 16px;
}

.header-help-link:hover {
  opacity: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo h1 {
  color: var(--text-color);
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.header-actions :deep(.el-dropdown-menu__item.is-active) {
  background: var(--primary);
  color: #fff;
}

.import-hint {
  padding: 10px 0;
}

.import-hint h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px 0;
  color: #303133;
}

.format-item {
  margin-bottom: 16px;
}

.search-bar {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px;
  position: sticky;
  top: 72px;
  z-index: 90;
  background: var(--background);
  backdrop-filter: blur(10px);
}

.search-input {
  max-width: 500px;
  margin-bottom: 20px;
}

.search-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.special-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.default-categories,
.custom-categories,
.custom-systems-categories {
  margin-top: 8px;
}

.custom-systems-categories {
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
}

.category-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-right: 5px;
  white-space: nowrap;
}

.category-tag-wrapper {
  display: inline-flex;
}

.category-tag :deep(.el-tag__content) {
  display: flex;
  align-items: center;
  gap: 4px;
}

.category-arrow-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 2px 4px;
  margin-right: -4px;
  border-radius: 4px;
  transition: all 0.3s;
}

.category-arrow-wrapper:hover {
  background: rgba(255, 255, 255, 0.2);
}

.category-arrow {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  transition: color 0.3s;
}

.category-arrow-wrapper:hover .category-arrow {
  color: #fff;
}

.category-tag.is-selected {
  font-weight: bold;
}

.category-tag .el-icon--right {
  margin-left: 2px;
  font-size: 12px;
}

.category-tag {
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
  flex-shrink: 0;
  font-size: 14px;
}

.category-tag:hover {
  transform: translateY(-2px);
}

.category-tag[draggable="true"] {
  cursor: grab;
}

.category-tag[draggable="true"]:active {
  cursor: grabbing;
}

.category-tag.is-drag-over {
  background: #409EFF !important;
  border-color: #409EFF !important;
  transform: scale(1.1);
}

.category-tag.ghost {
  opacity: 0.5;
  background: #909399;
}

.add-cat-btn {
  cursor: pointer;
  border-style: dashed !important;
}

.add-cat-btn:hover {
  transform: scale(1.05);
}

/* 特殊tab样式（预定义、我添加） */
.category-tag.is-special {
  opacity: 0.85;
  cursor: default !important;
}

.category-tag.is-special:hover {
  transform: none;
}

.section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.favorites-section {
  margin-bottom: 40px;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 152, 0, 0.1) 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.favorites-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.favorites-title {
  margin-bottom: 0;
}

.favorites-title .star-icon {
  color: #FFC107;
  font-size: 24px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.favorites-tip {
  color: var(--text-secondary);
  font-size: 12px;
}

.favorites-grid {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.section-title {
  color: var(--text-color);
  font-size: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title .count {
  font-size: 14px;
  opacity: 0.8;
  font-weight: normal;
}

.systems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 分类分组 */
.category-group {
  margin-bottom: 32px;
  border-radius: 12px;
  transition: all 0.3s;
  padding: 0;
}

.category-group.drag-over {
  background: rgba(64, 158, 255, 0.1);
  border: 2px dashed #409EFF;
}

.category-group.drag-over .category-header {
  border-left-color: #409EFF;
}

.category-group:last-child {
  margin-bottom: 0;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid var(--primary);
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.category-count {
  font-size: 12px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
  }

  .search-bar,
  .section {
    padding: 0 20px;
  }

  .header-content {
    flex-direction: column;
    gap: 15px;
  }

  .systems-grid {
    grid-template-columns: 1fr;
  }
}

/* URL 悬停提示 */
.url-tooltip {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 600px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  word-break: break-all;
}

.url-tooltip .el-icon {
  flex-shrink: 0;
  color: #409EFF;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

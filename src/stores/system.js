import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useSystemStore = defineStore('system', () => {
  // 本地存储键名
  const STORAGE_KEY = 'fuma_work_platform_systems'
  const FAVORITES_KEY = 'fuma_work_platform_favorites'
  const CATEGORY_ORDER_KEY = 'fuma_work_platform_category_order'
  const CUSTOM_CATEGORIES_KEY = 'fuma_work_platform_custom_categories'

  // 默认分类顺序（仅作为fallback）
  const FALLBACK_CATEGORY_ORDER = []

  // 分类顺序（从JSON加载，本地存储可覆盖）
  const categoryOrder = ref(loadCategoryOrder())

  // 自定义分类列表
  const customCategories = ref(loadCustomCategories())

  // 预定义系统列表（从JSON加载）
  const defaultSystems = ref([])

  // 数据加载状态
  const isLoading = ref(true)

  // 从本地存储加载分类顺序（过滤掉特殊tab）
  function loadCategoryOrder() {
    try {
      const stored = localStorage.getItem(CATEGORY_ORDER_KEY)
      if (stored) {
        const order = JSON.parse(stored)
        // 过滤掉可能已保存的特殊tab
        return order.filter(c => c !== '全部' && c !== '预定义')
      }
      return null
    } catch {
      return null
    }
  }

  // 从本地存储加载自定义分类
  function loadCustomCategories() {
    try {
      const stored = localStorage.getItem(CUSTOM_CATEGORIES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // 保存分类顺序
  function persistCategoryOrder() {
    localStorage.setItem(CATEGORY_ORDER_KEY, JSON.stringify(categoryOrder.value))
  }

  // 保存自定义分类
  function persistCustomCategories() {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(customCategories.value))
  }

  // 监听分类顺序变化
  watch(categoryOrder, persistCategoryOrder, { deep: true })

  // 监听自定义分类变化
  watch(customCategories, persistCustomCategories, { deep: true })

  // 默认收藏系统ID列表
  const DEFAULT_FAVORITES = [6, 9, 10, 28]

  // 收藏状态（从本地存储加载，如果没有则使用默认收藏）
  const favorites = ref(loadFavorites())

  // 系统列表（预定义 + 用户自定义）
  const systems = computed(() => {
    return [...defaultSystems.value, ...loadCustomSystems()]
  })

  // 加载预定义系统
  async function loadDefaultSystems() {
    try {
      const response = await fetch('/data/systems.json')
      const data = await response.json()
      // 为每个系统添加 isCustom: false
      defaultSystems.value = (data.systems || []).map(s => ({
        ...s,
        isCustom: false
      }))
      // 如果本地没有自定义分类顺序，则使用JSON中的顺序
      if (!categoryOrder.value && data.categoryOrder && data.categoryOrder.length > 0) {
        categoryOrder.value = data.categoryOrder
      }
      isLoading.value = false
    } catch (error) {
      console.error('加载预定义系统失败:', error)
      defaultSystems.value = []
      isLoading.value = false
    }
  }

  // 从本地存储加载收藏状态
  function loadFavorites() {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
      return [...DEFAULT_FAVORITES]
    } catch {
      return [...DEFAULT_FAVORITES]
    }
  }

  // 保存收藏状态到本地存储
  function persistFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
  }

  // 从本地存储加载用户自定义系统
  function loadCustomSystems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const systems = stored ? JSON.parse(stored) : []
      // 确保所有自定义系统都有 isCustom: true 标记
      return systems.map(s => ({ ...s, isCustom: true }))
    } catch {
      return []
    }
  }

  // 保存用户自定义系统到本地存储
  function persistCustomSystems() {
    const customSystems = systems.value.filter(s => s.isCustom)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customSystems))
  }

  // 监听 favorites 变化，自动保存
  watch(favorites, persistFavorites, { deep: true })

  // 获取所有存在的分类（从系统数据中提取 + 自定义分类）
  const allCategories = computed(() => {
    const cats = new Set(systems.value.map(s => s.category))
    // 合并：系统中的分类 + 用户自定义的分类
    const all = new Set([...cats, ...customCategories.value])
    return [...all]
  })

  // 预定义分类列表（系统预定义系统中的分类）
  const defaultCategoryTabs = computed(() => {
    const cats = new Set(defaultSystems.value.map(s => s.category))
    const order = categoryOrder.value || FALLBACK_CATEGORY_ORDER
    const ordered = order.filter(c => cats.has(c))
    const newCats = [...cats].filter(c => !order.includes(c))
    return [...ordered, ...newCats]
  })

  // 自定义分类列表（用户自己创建的分类，可能没有系统）
  const customCategoryTabs = computed(() => {
    // 只返回用户在 customCategories 中创建的分类
    return [...customCategories.value]
  })

  // 自定义系统使用的分类（用于"我添加"时按系统分类筛选）
  // 只返回预定义分类中，自定义系统正在使用的分类
  const customSystemsCategoryTabs = computed(() => {
    // 获取预定义分类列表
    const defaultCats = new Set(defaultSystems.value.map(s => s.category))
    // 获取自定义系统实际使用的分类
    const customSystemCats = new Set(systems.value.filter(s => s.isCustom).map(s => s.category))
    // 只保留预定义分类中，自定义系统正在使用的分类
    const cats = new Set([...customSystemCats].filter(c => defaultCats.has(c)))
    const order = categoryOrder.value || FALLBACK_CATEGORY_ORDER
    const ordered = order.filter(c => cats.has(c))
    const newCats = [...cats].filter(c => !order.includes(c))
    return [...ordered, ...newCats]
  })

  // 分类列表（根据排序顺序，包含特殊tab）
  const categories = computed(() => {
    // 只返回特殊tab
    return ['全部', '预定义', '我添加']
  })

  // 添加自定义分类
  function addCustomCategory(name) {
    const trimmed = name.trim()
    const allExisting = [...customCategories.value, ...allCategories.value]
    if (allExisting.includes(trimmed)) {
      return { success: false, error: '分类已存在' }
    }
    if (!trimmed) {
      return { success: false, error: '分类名称不能为空' }
    }
    customCategories.value.push(trimmed)
    return { success: true }
  }

  // 删除自定义分类
  function deleteCustomCategory(name) {
    const index = customCategories.value.indexOf(name)
    if (index !== -1) {
      customCategories.value.splice(index, 1)
      return { success: true }
    }
    return { success: false, error: '分类不存在' }
  }

  // 更新自定义分类名称
  function updateCustomCategory(oldName, newName) {
    const trimmed = newName.trim()
    const index = customCategories.value.indexOf(oldName)
    
    if (index === -1) {
      return { success: false, error: '分类不存在' }
    }
    
    if (!trimmed) {
      return { success: false, error: '分类名称不能为空' }
    }
    
    // 检查新名称是否与其他分类冲突
    if (trimmed !== oldName && customCategories.value.includes(trimmed)) {
      return { success: false, error: '分类名称已存在' }
    }
    
    // 检查新名称是否与系统分类冲突
    const allCats = new Set(systems.value.map(s => s.category))
    if (allCats.has(trimmed)) {
      return { success: false, error: '分类名称与系统分类冲突' }
    }
    
    // 更新分类名称
    customCategories.value[index] = trimmed
    
    // 同时更新该分类下所有系统的category
    const customSystems = loadCustomSystems()
    customSystems.forEach(s => {
      if (s.category === oldName) {
        s.category = trimmed
      }
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customSystems))
    // 刷新视图
    defaultSystems.value = [...defaultSystems.value]
    
    return { success: true }
  }

  // 更新分类顺序
  function updateCategoryOrder(order) {
    categoryOrder.value = order
  }

  // 获取当前分类顺序
  function getCategoryOrder() {
    return categoryOrder.value || FALLBACK_CATEGORY_ORDER
  }

  // 收藏列表（根据收藏ID获取完整系统）
  const favoriteSystems = computed(() => {
    return systems.value.filter(s => favorites.value.includes(s.id))
  })

  // 判断系统是否已收藏
  function isFavorite(id) {
    return favorites.value.includes(id)
  }

  // 切换收藏状态
  function toggleFavorite(id) {
    const index = favorites.value.indexOf(id)
    if (index === -1) {
      favorites.value.push(id)
    } else {
      favorites.value.splice(index, 1)
    }
  }

  // 添加系统（用户自定义）
  function addSystem(system) {
    const customSystems = loadCustomSystems()
    const newSystem = {
      ...system,
      id: Date.now(),
      isCustom: true
    }
    customSystems.push(newSystem)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customSystems))
    // 刷新视图
    defaultSystems.value = [...defaultSystems.value]
  }

  // 更新系统
  function updateSystem(id, data) {
    const system = systems.value.find(s => s.id === id)
    if (system) {
      if (system.isCustom) {
        const customSystems = loadCustomSystems()
        const index = customSystems.findIndex(s => s.id === id)
        if (index !== -1) {
          customSystems[index] = { ...customSystems[index], ...data }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(customSystems))
        }
      }
      // 刷新视图
      defaultSystems.value = [...defaultSystems.value]
    }
  }

  // 删除系统（只允许删除用户自定义的系统）
  function deleteSystem(id) {
    const system = systems.value.find(s => s.id === id)
    if (system && system.isCustom) {
      const customSystems = loadCustomSystems()
      const index = customSystems.findIndex(s => s.id === id)
      if (index !== -1) {
        customSystems.splice(index, 1)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customSystems))
        // 刷新视图
        defaultSystems.value = [...defaultSystems.value]
      }
    }
  }

  // 判断系统是否可以删除
  function canDelete(id) {
    const system = systems.value.find(s => s.id === id)
    return system ? system.isCustom : false
  }

  // 导出为 JSON 格式（只导出用户自定义的系统）
  function exportAsJson() {
    const data = systems.value
      .filter(s => s.isCustom)
      .map(s => ({
        name: s.name,
        url: s.url
      }))
    return JSON.stringify(data, null, 2)
  }

  // 导出为浏览器收藏夹格式（Chrome/Edge）（只导出用户自定义的系统）
  function exportAsBrowserBookmarks(title = '工作平台') {
    const children = systems.value
      .filter(s => s.isCustom)
      .map(s => ({
        date_added: Date.now() * 1000,
        guid: generateGUID(),
        id: generateID(),
        name: s.name,
        type: 'url',
        url: s.url
      }))

    return JSON.stringify({
      version: 1,
      children: [
        {
          date_added: Date.now() * 1000,
          guid: generateGUID(),
          id: 1,
          name: title,
          type: 'folder',
          children: children
        }
      ]
    }, null, 2)
  }

  // 生成随机 GUID
  function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // 生成随机 ID
  function generateID() {
    return Math.floor(Math.random() * 9000000000000000) + 1000000000000000
  }

  // 导入 JSON 数据（支持简单 JSON 和 Chrome/Edge 收藏夹格式）
  function importFromJson(jsonStr) {
    try {
      const data = JSON.parse(jsonStr)
      const imported = []
      let maxId = Math.max(...systems.value.map(s => s.id), 0)

      // 判断是否为 Chrome/Edge 收藏夹格式
      if (data.version && data.children) {
        const items = extractBookmarks(data.children)
        items.forEach(item => {
          if (item.name && item.url) {
            maxId++
            imported.push({
              id: maxId,
              name: item.name,
              url: item.url,
              icon: 'Link',
              category: '导入',
              description: item.url,
              color: '#909399',
              isCustom: true
            })
          }
        })
      } else if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.name && item.url) {
            maxId++
            imported.push({
              id: maxId,
              name: item.name,
              url: item.url,
              icon: 'Link',
              category: '导入',
              description: item.url,
              color: '#909399',
              isCustom: true
            })
          }
        })
      } else {
        throw new Error('Invalid format')
      }

      if (imported.length === 0) {
        return { success: false, error: '未找到有效的链接数据' }
      }

      const customSystems = loadCustomSystems()
      customSystems.push(...imported)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customSystems))
      // 刷新视图
      defaultSystems.value = [...defaultSystems.value]
      return { success: true, count: imported.length }
    } catch (e) {
      return { success: false, error: '格式错误，请检查 JSON 文件内容' }
    }
  }

  // 递归提取收藏夹中的所有链接
  function extractBookmarks(children) {
    const result = []
    if (!children) return result

    children.forEach(item => {
      if (item.type === 'url' && item.name && item.url) {
        result.push(item)
      } else if (item.children) {
        result.push(...extractBookmarks(item.children))
      }
    })

    return result
  }

  // 下载文件
  function downloadFile(content, filename, type = 'application/json') {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // 初始化加载
  loadDefaultSystems()

  return {
    systems,
    categories,
    favorites,
    favoriteSystems,
    isFavorite,
    toggleFavorite,
    addSystem,
    updateSystem,
    deleteSystem,
    canDelete,
    exportAsJson,
    exportAsBrowserBookmarks,
    importFromJson,
    downloadFile,
    addCustomCategory,
    deleteCustomCategory,
    updateCustomCategory,
    updateCategoryOrder,
    getCategoryOrder,
    customCategories,
    defaultCategoryTabs,
    customCategoryTabs,
    customSystemsCategoryTabs,
    isLoading
  }
})

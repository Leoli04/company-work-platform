<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑系统' : '添加系统'"
    width="500px"
    :close-on-click-modal="false"
    @closed="resetForm"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="90px"
      class="system-form"
    >
      <el-form-item label="系统名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入系统名称" />
      </el-form-item>
      
      <el-form-item label="系统地址" prop="url">
        <el-input v-model="formData.url" placeholder="请输入系统URL" />
      </el-form-item>
      
      <el-form-item label="系统描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="2"
          placeholder="请输入系统描述"
        />
      </el-form-item>
      
      <el-form-item label="所属分类" prop="category">
        <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
          <el-option
            v-for="cat in categoryOptions"
            :key="cat"
            :label="cat"
            :value="cat"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="主题颜色" prop="color">
        <div class="color-picker">
          <div
            v-for="color in colorOptions"
            :key="color"
            class="color-option"
            :class="{ active: formData.color === color }"
            :style="{ background: color }"
            @click="formData.color = color"
          />
          <el-color-picker v-model="formData.color" />
        </div>
      </el-form-item>
      
      <el-form-item label="图标" prop="icon">
        <el-select v-model="formData.icon" placeholder="请选择图标" style="width: 100%">
          <el-option
            v-for="icon in iconOptions"
            :key="icon"
            :label="icon"
            :value="icon"
          >
            <div class="icon-option">
              <el-icon><component :is="icon" /></el-icon>
              <span>{{ icon }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSystemStore } from '@/stores/system'

const props = defineProps({
  visible: Boolean,
  system: Object,
  isEdit: Boolean
})

const emit = defineEmits(['update:visible', 'submit'])

const store = useSystemStore()
const formRef = ref(null)

const formData = ref({
  name: '',
  url: '',
  description: '',
  category: '',
  color: '#409EFF',
  icon: 'Document'
})

const rules = {
  name: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入系统URL', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

const colorOptions = [
  '#409EFF', '#67C23A', '#E6A23C', '#F56C6C',
  '#909399', '#9C27B0', '#00BCD4', '#3F51B5',
  '#795548', '#607D8B', '#FF5722', '#4CAF50'
]

const iconOptions = [
  'Document', 'User', 'Money', 'UserFilled', 'Files', 'Books',
  'Message', 'DataAnalysis', 'Box', 'Scale', 'Platform', 'Setting',
  'Grid', 'Folder', 'Edit', 'Connection', 'Service', 'Monitor',
  'Goods', 'ShoppingCart', 'Ticket', 'Calendar', 'Bell', 'ChatDotRound',
  'Clock', 'Tools', 'OfficeBuilding', 'Tickets', 'Cloud', 'Code',
  'Translate', 'DataBase', 'Key', 'Collection'
]

// 分类选项从store获取（排除"全部"）
const categoryOptions = computed(() => {
  return store.categories.filter(c => c !== '全部')
})

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

watch(() => props.system, (val) => {
  if (val) {
    Object.assign(formData.value, val)
  }
}, { immediate: true })

function resetForm() {
  formRef.value?.resetFields()
  formData.value = {
    name: '',
    url: '',
    description: '',
    category: '',
    color: '#409EFF',
    icon: 'Document'
  }
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit('submit', { ...formData.value })
    }
  })
}
</script>

<style scoped>
.system-form {
  padding: 10px 0;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.color-option {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #303133;
  box-shadow: 0 0 0 2px #fff;
}

.icon-option {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>

<template>
  <div
    class="system-card"
    :class="{ compact, 'is-draggable': draggable, 'is-custom': system.isCustom }"
    :style="{ '--theme-color': system.color }"
    :draggable="draggable"
    @click="handleCardClick"
    @mouseenter="$emit('hover', system.url)"
    @mouseleave="$emit('hover', '')"
  >
    <div class="card-header">
      <div class="icon-wrapper" :class="{ compact }">
        <el-icon :size="compact ? 20 : 32" :color="system.color">
          <component :is="system.icon" />
        </el-icon>
      </div>
      <el-dropdown v-if="showActions" trigger="click" @command="handleCommand">
        <el-button text circle class="more-btn" @click.stop>
          <el-icon><MoreFilled /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="edit">
              <el-icon><Edit /></el-icon>
              编辑
            </el-dropdown-item>
            <el-dropdown-item command="delete">
              <el-icon><Delete /></el-icon>
              删除
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tag v-else-if="system.isCustom && !compact" type="success" size="small" class="custom-tag">
        自定义
      </el-tag>
    </div>

    <div class="card-body">
      <h3 class="system-name">{{ system.name }}</h3>
      <p v-if="!compact" class="system-desc">{{ system.description }}</p>
    </div>

    <div class="card-footer" @dragstart="onDragStart" @dragend="onDragEnd">
      <el-tag v-if="!compact" size="small" effect="plain">{{ system.category }}</el-tag>
      <el-button
        text
        circle
        :class="['favorite-btn', { active: isFav }]"
        @click.stop="$emit('toggle-favorite', system.id)"
      >
        <el-icon :size="compact ? 14 : 18">
          <StarFilled v-if="isFav" />
          <Star v-else />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MoreFilled, Edit, Delete, Star, StarFilled } from '@element-plus/icons-vue'
import { useSystemStore } from '@/stores/system'

const props = defineProps({
  system: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  },
  draggable: {
    type: Boolean,
    default: false
  }
})

const store = useSystemStore()

const isFav = computed(() => store.isFavorite(props.system.id))
const showActions = computed(() => !props.compact && props.system.isCustom)

const emit = defineEmits(['open', 'toggle-favorite', 'edit', 'delete', 'hover', 'dragstart', 'dragend'])

function handleCommand(command) {
  if (command === 'edit') {
    emit('edit', props.system)
  } else if (command === 'delete') {
    emit('delete', props.system.id)
  }
}

function onDragStart(event) {
  emit('dragstart', event, props.system)
}

function onDragEnd(event) {
  emit('dragend', event)
}

function handleCardClick() {
  emit('open', props.system)
}
</script>

<style scoped>
.system-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.system-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--theme-color);
}

.system-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* compact 模式样式 */
.system-card.compact {
  padding: 12px;
  border-radius: 12px;
}

.system-card.compact::before {
  height: 3px;
}

.system-card.compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--theme-color) 0%, color-mix(in srgb, var(--theme-color) 70%, #000) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--theme-color) 40%, transparent);
}

.icon-wrapper.compact {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-color) 40%, transparent);
}

.icon-wrapper .el-icon {
  color: #fff !important;
}

.more-btn {
  color: #909399;
}

.card-body {
  margin-bottom: 15px;
  min-height: 70px;
}

.system-card.compact .card-body {
  margin-bottom: 10px;
  min-height: auto;
}

.system-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--card-text);
  margin-bottom: 8px;
  transition: color 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.system-card.compact .system-name {
  font-size: 14px;
  margin-bottom: 0;
}

.system-card:hover .system-name {
  color: var(--theme-color);
}

.system-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}

.system-card.compact .card-footer {
  padding-top: 10px;
}

.favorite-btn {
  color: #dcdfe6;
  transition: all 0.3s;
}

.favorite-btn.active {
  color: #E6A23C;
}

.favorite-btn:hover {
  color: #E6A23C;
  transform: scale(1.1);
}

.system-card.is-draggable {
  cursor: grab;
}

.system-card.is-draggable:active {
  cursor: grabbing;
  opacity: 0.8;
}

/* 自定义系统特殊样式 */
.system-card.is-custom {
  border: 2px dashed #67C23A;
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(103, 194, 58, 0.05) 100%);
}

.system-card.is-custom::before {
  background: linear-gradient(90deg, var(--theme-color), #67C23A);
}

.system-card.is-custom:hover {
  border-color: #67C23A;
  box-shadow: 0 12px 40px rgba(103, 194, 58, 0.2);
}

.custom-tag {
  font-size: 11px;
  padding: 0 6px;
  height: 20px;
  line-height: 18px;
}
</style>

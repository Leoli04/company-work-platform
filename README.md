# 系统聚合平台

公司内部系统快速跳转平台，集中管理研发部所有内部系统入口。

## 快速定制为自己的公司工作平台

只需修改一个配置文件，即可将本项目定制为您公司的工作平台。

### 1. 修改系统数据

项目提供了示例配置文件 `public/data/systems-example.json`，包含常见的研发运维系统配置，可作为参考模板。

**使用方式：**

```bash
# 直接复制示例文件作为初始配置
cp public/data/systems-example.json public/data/systems.json
```

然后在 `systems.json` 基础上修改为您公司实际的系统信息即可。修改 `systems.json` 后，重新部署即可生效。无需修改任何代码。

编辑 `public/data/systems.json` 文件：

```json
{
  "categoryOrder": ["你的分类1", "你的分类2", "你的分类3"],
  "systems": [
    {
      "id": 1,
      "name": "系统名称",
      "icon": "Document",
      "url": "https://system.example.com",
      "category": "你的分类1",
      "description": "系统描述",
      "color": "#409EFF"
    }
  ]
}
```

**配置说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| `categoryOrder` | 否 | 分类显示顺序，不提供则按系统数据自动排列 |
| `systems` | 是 | 系统列表 |
| `id` | 是 | 唯一标识符，数字 |
| `name` | 是 | 系统显示名称 |
| `icon` | 是 | Element Plus 图标名称 |
| `url` | 是 | 系统访问地址 |
| `category` | 是 | 所属分类 |
| `description` | 否 | 系统描述 |
| `color` | 否 | 卡片主题颜色，默认为 #409EFF |

**可用图标示例：**

`Document`, `User`, `Setting`, `Monitor`, `Clock`, `Tools`, `OfficeBuilding`, `Tickets`, `Cloud`, `Code`, `Translate`, `DataBase`, `Key`, `Collection` 等（所有 Element Plus 图标均可使用）



### 背景

企业日常工作中需要使用多个内部系统，这些系统入口分散，记忆成本高，影响工作效率。

### 核心价值

- **统一入口**：集中管理所有内部系统，一站到达
- **快速检索**：支持搜索和分类筛选，快速定位目标系统
- **个性化收藏**：常用系统一键收藏，优先展示
- **便捷管理**：可视化配置系统列表，易于维护

### 项目定位

面向企业内部的轻量级系统导航工具，帮助员工快速访问各类业务系统，提升日常工作效率。

## 功能特性

| 功能 | 说明 |
|------|------|
| :sparkles: 系统卡片 | 卡片式展示，点击快速跳转 |
| :bookmark: 分类管理 | 支持多标签筛选，快速过滤 |
| :mag: 搜索功能 | 关键词搜索，快速定位系统 |
| :star: 收藏功能 | 常用系统置顶，常态化展示 |
| :computer: 响应式布局 | 适配各种屏幕尺寸 |

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4.x | 渐进式前端框架 |
| Element Plus | ^2.8.x | UI 组件库 |
| Vue Router | ^4.3.x | 页面路由管理 |
| Pinia | ^2.1.x | 状态管理 |
| Vite | ^5.4.x | 构建工具 |

## 项目结构

```
fumasoft-work-platform/
├── public/                     # 静态资源
│   ├── favicon.svg             # 网站图标
│   └── data/
│       ├── systems.json        # 系统配置（修改此文件定制平台）
│       └── systems-example.json # 示例配置（研发运维系统模板）
├── src/                        # 源代码目录
│   ├── assets/                 # 资源文件（图片、样式等）
│   ├── components/             # 公共组件
│   │   ├── SystemCard.vue      # 系统卡片组件
│   │   └── SystemDialog.vue    # 系统详情弹窗组件
│   ├── router/                 # 路由配置
│   │   └── index.js            # 路由定义
│   ├── stores/                 # 状态管理
│   │   └── system.js           # 系统数据状态
│   ├── views/                  # 页面视图
│   │   └── HomeView.vue        # 主页视图
│   ├── App.vue                 # 根组件
│   └── main.js                 # 应用入口
├── index.html                  # HTML 模板
├── package.json                # 项目配置
├── vite.config.js              # Vite 配置
└── README.md                   # 项目文档
```

### 目录说明

| 目录 | 说明 |
|------|------|
| `public/` | 静态资源目录，部署时直接复制 |
| `public/data/systems.json` | **系统配置文件，修改此文件定制平台** |
| `public/data/systems-example.json` | 示例配置文件，包含研发运维系统模板，可复制后修改 |
| `src/` | 源代码目录，包含所有业务代码 |
| `src/components/` | 可复用的 Vue 组件 |
| `src/router/` | Vue Router 路由配置 |
| `src/stores/` | Pinia 状态管理 |
| `src/views/` | 页面级组件，通常对应路由 |

## 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器 (默认 http://localhost:3000)
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 构建生产版本
npm run build

# 部署 dist 目录到您的服务器
```


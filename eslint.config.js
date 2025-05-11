import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly',
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,

  {
    languageOptions: {}, // 这里可以空着，但保持结构一致
    rules: {
      // prettier 专注于代码的美观度 （格式化工具）
      // 1. 禁用格式化插件 prettier  format on save  关闭
      // 2. 安装Eslint插件，并配置保存时自动修复
      // 'prettier/prettier': [
      //   'warn',
      //   {
      //     singleQuote: true, // 单引号
      //     semi: false, // 无分号
      //     printWidth: 80, // 每行宽度至多80字符
      //     trailingComma: 'none', // 不加对象|数组最后逗号
      //     endOfLine: 'auto', // 换行符号不限制（win mac 不一致）
      //   },
      // ],
      
      // ESLint 关注于规范
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'], // vue组件名称多单词组成（忽略index.vue）
        },
      ],
      'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验
      'no-undef': 'error', // 提示未定义的变量
    },
  },
])

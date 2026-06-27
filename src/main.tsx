import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import './index.css'
import App from './App'

// 生产环境禁用浏览器默认右键菜单
if (!import.meta.env.DEV) {
  document.addEventListener('contextmenu', (e) => e.preventDefault())
}

// 禁用 WebKit 输入建议/拼写检查/自动纠正
document.documentElement.setAttribute('spellcheck', 'false')
document.documentElement.setAttribute('autocomplete', 'off')
document.documentElement.setAttribute('autocorrect', 'off')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

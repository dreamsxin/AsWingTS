# AsWingTS 组件化设计指南

## 核心原则

### 1. 组件位置由布局管理器决定 ✅

**正确做法：**
```typescript
// 使用布局管理器
panel.setLayout(new FlowLayout());
panel.add(button);  // 布局管理器自动定位

// 或使用组件 API
button.setLocation(50, 100);
button.setSize(120, 40);
```

**错误做法：** ❌
```typescript
// 不要直接操作 DOM 样式
button.getElement().style.position = 'absolute';
button.getElement().style.left = '50px';
button.getElement().style.top = '100px';
```

### 2. 使用组件 API 而不是直接操作 element

| 操作 | 正确 API | 错误方式 |
|------|---------|----------|
| 设置位置 | `setLocation(x, y)` | `element.style.left/top` |
| 设置尺寸 | `setSize(w, h)` | `element.style.width/height` |
| 设置颜色 | `setColor('#f00')` | `element.style.color` |
| 设置背景 | `setBackground('#f00')` | `element.style.background` |
| 设置边框 | `setBorder('1px solid #f00')` | `element.style.border` |
| 设置字体 | `setFontWeight('bold')` | `element.style.fontWeight` |
| 设置对齐 | `setTextAlign('center')` | `element.style.textAlign` |

### 3. 布局管理器职责

| 布局管理器 | 职责 | 使用场景 |
|-----------|------|----------|
| **BorderLayout** | 五区域布局（北/南/西/东/中） | 主窗口布局 |
| **FlowLayout** | 从左到右流式排列，自动换行 | 工具栏、按钮组 |
| **GridLayout** | 等分网格布局 | 计算器键盘、表单 |
| **BoxLayout** | 单行或单列布局 | 垂直/水平排列 |
| **AbsoluteLayout** | 手动定位（不自动布局） | 自定义 UI、拖放界面 |

### 4. 组件层级关系

```
JFrame (窗口)
  └── Container (内容面板)
      └── JPanel (面板)
          ├── JButton (按钮)
          ├── JLabel (标签)
          └── JTextField (文本框)
```

**规则：**
- 组件必须添加到容器才能显示
- 容器可以嵌套
- 每个组件只能有一个父容器

## 正确使用示例

### ✅ 正确：使用组件 API

```typescript
import { JFrame, JButton, JLabel, JPanel, FlowLayout } from 'aswing-ts';

// 创建窗口
const frame = new JFrame('My App');
frame.setSize(400, 300);

// 创建面板并使用布局管理器
const panel = new JPanel();
panel.setLayout(new FlowLayout());

// 创建按钮（使用 API 设置属性）
const btn1 = new JButton('Click Me')
  .setSize(100, 30)
  .applyTheme('primary');

const btn2 = new JButton('Cancel')
  .setSize(100, 30)
  .applyTheme('secondary');

// 添加到面板（布局管理器自动定位）
panel.add(btn1);
panel.add(btn2);

// 添加到窗口
frame.getContentPane().add(panel);

// 显示
document.getElementById('app').appendChild(frame.getElement());
```

### ❌ 错误：直接操作 DOM

```typescript
// 错误示例
const btn = new JButton('Click');

// ❌ 不要这样做
btn.getElement().style.position = 'absolute';
btn.getElement().style.left = '50px';
btn.getElement().style.top = '100px';
btn.getElement().style.width = '100px';
btn.getElement().style.height = '30px';
btn.getElement().style.background = '#007bff';
btn.getElement().style.color = '#fff';

// ✅ 应该这样做
btn.setLocation(50, 100);
btn.setSize(100, 30);
btn.applyTheme('primary');
```

### ⚠️ 特殊情况：直接设置样式

某些高级样式（borderRadius, boxShadow 等）当前需要直接设置：

```typescript
// 可以接受的特殊情况
const card = new JPanel();
card.setSize(200, 100);

// 这些属性没有对应的组件 API，可以直接设置
card.getElement().style.borderRadius = '8px';
card.getElement().style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

// 但位置和尺寸仍应使用 API
// ❌ 不要这样做：
// card.getElement().style.left = '50px';
// card.getElement().style.width = '200px';
```

## 布局管理器使用指南

### BorderLayout

```typescript
const panel = new JPanel();
panel.setLayout(new BorderLayout(5, 5)); // hgap, vgap

// 添加到指定区域
panel.add(new JLabel('North'), AsWingConstants.NORTH);
panel.add(new JLabel('South'), AsWingConstants.SOUTH);
panel.add(new JLabel('Center'), AsWingConstants.CENTER);
```

### FlowLayout

```typescript
const panel = new JPanel();
panel.setLayout(new FlowLayout(AsWingConstants.CENTER, 5, 5));

// 组件自动从左到右排列，超出自动换行
panel.add(new JButton('Btn 1'));
panel.add(new JButton('Btn 2'));
panel.add(new JButton('Btn 3'));
```

### AbsoluteLayout

```typescript
const panel = new JPanel();
panel.setLayout(new AbsoluteLayout());

// 手动设置每个组件的位置
const btn1 = new JButton('Btn 1');
btn1.setLocation(10, 10);
btn1.setSize(100, 30);
panel.add(btn1);

const btn2 = new JButton('Btn 2');
btn2.setLocation(120, 10);
btn2.setSize(100, 30);
panel.add(btn2);
```

## 链式调用

所有 setter 方法返回 `this`，支持链式调用：

```typescript
const label = new JLabel('Hello')
  .setLocation(50, 100)
  .setSize(200, 30)
  .setColor('#fff')
  .setFontWeight('bold')
  .setFontSize('16px')
  .setTextAlign('center')
  .setBackground('#007bff')
  .setBorder('1px solid #0056b3');
```

## 主题系统

```typescript
// 应用预定义主题
button.applyTheme('primary');
button.applyTheme(['primary', 'lg', 'rounded']);

// 清除主题
button.clearTheme();

// 检查主题
if (button.hasTheme('primary')) {
  console.log('Has primary theme');
}

// 获取已应用的主题
const themes = button.getAppliedThemes();
```

## 事件处理

```typescript
button.addEventListener(AWEvent.ACT, () => {
  console.log('Button clicked!');
});

checkbox.addEventListener('stateChanged', () => {
  console.log('Checkbox state changed');
});

textField.addEventListener('textChanged', () => {
  console.log('Text changed:', textField.getText());
});
```

## 检查清单

在提交代码前检查：

- [ ] 是否使用了 `setLocation()` 而不是 `element.style.left/top`？
- [ ] 是否使用了 `setSize()` 而不是 `element.style.width/height`？
- [ ] 是否使用了组件 API（setColor, setBackground 等）？
- [ ] 是否使用了合适的布局管理器？
- [ ] 是否避免了直接操作 DOM 元素？
- [ ] 链式调用是否正确？

## 总结

**核心思想：** 组件应该通过 API 操作，布局管理器负责定位。

**好处：**
1. **可维护性** - 代码更清晰，易于理解
2. **可移植性** - 不依赖特定 DOM 结构
3. **一致性** - 所有组件行为一致
4. **类型安全** - TypeScript 提供类型检查
5. **响应式** - 布局管理器自动处理尺寸变化

遵循这些原则，确保 AsWingTS 组件库的质量和可维护性！

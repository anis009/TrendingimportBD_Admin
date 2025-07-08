# Ant Design Theme Configuration

This project has been configured with Ant Design theme support that automatically switches between light and dark modes based on your existing theme system.

## Features

### 🎨 Automatic Theme Switching

- Integrates with your existing `useColorMode` hook
- Automatically switches between light and dark themes
- Maintains your custom primary color (`#3C50E0`)

### 🎯 Custom Colors

- **Primary**: `#3C50E0` (matches your existing brand color)
- **Success**: `#10B981`
- **Warning**: `#FFBA00`
- **Error**: `#DC3545`
- **Info**: `#259AE6`

### 🌙 Dark Mode Support

- Custom dark theme with your existing color palette
- Background: `#1A222C` (matching your `boxdark-2`)
- Container: `#24303F` (matching your `boxdark`)
- Text: `#AEB7C0` (matching your `bodydark`)
- Borders: `#2E3A47` (matching your `strokedark`)

## Usage

### Basic Usage

The theme is automatically applied to all Ant Design components. Simply use Ant Design components as normal:

```tsx
import { Button, Card, Table, Modal } from 'antd';

// These will automatically use the correct theme
<Button type="primary">Primary Button</Button>
<Card title="My Card">Content</Card>
```

### Using the Theme Hook

If you need access to the current theme in your components:

```tsx
import useAntdTheme from '../hooks/useAntdTheme';

const MyComponent = () => {
  const { colorMode, isDark, currentTheme, token } = useAntdTheme();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        color: token.colorText,
      }}
    >
      Current mode: {colorMode}
    </div>
  );
};
```

### Theme Toggle

The theme automatically follows your existing dark mode switcher. Users can toggle between light and dark modes using the existing `DarkModeSwitcher` component.

## Components Styled

All Ant Design components are properly themed, including:

- ✅ **Buttons** - All variants (primary, default, danger, etc.)
- ✅ **Cards** - Background and borders
- ✅ **Tables** - Headers, rows, and hover states
- ✅ **Modals** - Background, headers, and content
- ✅ **Forms** - Labels, inputs, and validation
- ✅ **Typography** - Text colors and styles
- ✅ **Images** - Preview functionality
- ✅ **Descriptions** - Structured data display

## File Structure

```
src/
├── config/
│   └── antdTheme.ts           # Theme configuration
├── components/
│   └── AntdThemeProvider/     # Theme provider component
│       ├── AntdThemeProvider.tsx
│       └── index.ts
├── hooks/
│   └── useAntdTheme.tsx       # Theme utility hook
└── css/
    └── antd-theme.css         # Additional theme styles
```

## Customization

### Changing Colors

To modify the theme colors, edit `src/config/antdTheme.ts`:

```typescript
export const customColors = {
  primary: '#your-color',
  secondary: '#your-color',
  // ... other colors
};
```

### Adding Custom Styles

Add additional styles to `src/css/antd-theme.css` for further customization.

## Integration

The theme system is automatically set up in your application:

1. **App.tsx** - Wrapped with `AntdThemeProvider`
2. **main.tsx** - Imports necessary CSS files
3. **Categories.tsx** - Example implementation using Ant Design components

The theme seamlessly integrates with your existing Tailwind CSS setup while providing consistent Ant Design component styling.

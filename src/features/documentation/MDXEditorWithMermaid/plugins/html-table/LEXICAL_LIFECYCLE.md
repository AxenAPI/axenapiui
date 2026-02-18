# Lexical Lifecycle Management

тут некоторые знания о Lexical, могут пригодится для контекста

## ContentEditable Automatic Cleanup

**Важно:** `ContentEditable` из `@lexical/react` **автоматически** управляет lifecycle редактора через ref callback.

### Исходный код (node_modules/@lexical/react/LexicalContentEditable.dev.js)

```javascript
const handleRef = react.useCallback(
  rootElement => {
    if (rootElement && rootElement.ownerDocument && rootElement.ownerDocument.defaultView) {
      editor.setRootElement(rootElement); // Setup при монтировании
    } else {
      editor.setRootElement(null); // Cleanup при размонтировании
    }
  },
  [editor]
);
```

### Ключевые моменты

1. **Setup:** При монтировании `ContentEditable` React вызывает ref callback с DOM элементом → `setRootElement(element)`
2. **Cleanup:** При размонтировании React вызывает ref callback с `null` → `setRootElement(null)`
3. **Автоматизм:** Это встроенное поведение React refs, не требует ручного управления

## Антипаттерн: Явный cleanup в useEffect

❌ **НЕ ДЕЛАТЬ:**

```tsx
React.useEffect(() => {
  return () => {
    editor.setRootElement(null); // Избыточно и вредно!
  };
}, [editor]);
```

### Проблемы:

- **Race condition:** useEffect cleanup срабатывает раньше, чем размонтируется `ContentEditable`
- **Двойной cleanup:** `setRootElement(null)` вызывается дважды
- **Некорректное состояние:** При новом монтировании `getRootElement()` возвращает `null`, пока `ContentEditable` не примонтируется

### Наблюдаемые симптомы:

```
CellEditor cleanup, root before: <div...>  // Ваш cleanup
CellEditor cleanup, root after: null
CellEditor mounted, root: null  // ❌ root еще null!
// ContentEditable монтируется позже и устанавливает root
```

## Правильный подход

✅ **ДОВЕРЯЙТЕ БИБЛИОТЕКЕ:**

```tsx
export const CellEditor = ({ editor }) => {
  // editor создается через useState - живет весь lifecycle компонента

  return (
    <LexicalNestedComposer initialEditor={editor}>
      <RichTextPlugin
        contentEditable={<ContentEditable />} // Сам управляет setRootElement
        // ...
      />
    </LexicalNestedComposer>
  );
};
```

## Lexical Architecture Patterns

### 1. Editor Instance

- Создается через `createEditor()` или в `LexicalComposer`
- Живет независимо от DOM
- Может существовать без привязки к элементу (`rootElement === null`)

### 2. Root Element Binding

- `editor.setRootElement(element)` — привязать к DOM
- `editor.setRootElement(null)` — отвязать от DOM
- Управляется автоматически через `ContentEditable`

### 3. Nested Composers

- `LexicalNestedComposer` принимает `initialEditor` — уже созданный инстанс
- Не создает новый редактор, только оборачивает в контекст
- Cleanup за nested editor не требуется, только за root element привязку

## Документация

- [Lexical Docs](https://lexical.dev)
- [Getting Started with React](https://lexical.dev/docs/getting-started/react)
- Исходники: `node_modules/@lexical/react/LexicalContentEditable.dev.js`

## Обновлено

17 декабря 2025

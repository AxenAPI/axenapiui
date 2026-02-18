import { ComponentType, FC, memo } from 'react';

/**
 * Универсальный фабричный метод для создания HOC.
 * Автоматически проставляет displayName и мемоизирует компонент.
 */
export function createHoc<P extends object>(name: string, wrapper: (Component: ComponentType<P>) => FC<P>) {
  const hoc = (WrappedComponent: ComponentType<P>): ComponentType<P> => {
    const EnhancedComponent = wrapper(WrappedComponent);
    EnhancedComponent.displayName = `with${name}(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return memo(EnhancedComponent);
  };

  return hoc;
}

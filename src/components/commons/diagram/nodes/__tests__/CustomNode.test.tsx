import { fireEvent, render, screen } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { allSettled, createWatch, fork } from 'effector';
import { Provider } from 'effector-react';

import { NodeDTOBrokerTypeEnum, NodeDTOTypeEnum } from '@shared/openapi';

import { toggleItemSelection } from '@/components/commons/diagram/model/SelectedItemsModel';
import { CustomNode, ICustomNodeProps } from '@/components/commons/diagram/nodes/ui/CustomNode';
import { NodeSelectedColorMap } from '@/helpers/nodes-value-map';
import { editNode } from '@/models/EventGraphModel';

const defaultMockProps: ICustomNodeProps = {
  id: 'test-node-id',
  type: 'custom',
  data: { name: 'test', nodeType: NodeDTOTypeEnum.Service },
  selected: false,
  dragging: false,
  draggable: true,
  selectable: true,
  deletable: true,
  zIndex: 0,
  isConnectable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
};

const testCases = [
  {
    name: 'SERVICE node',
    props: {
      data: {
        name: 'consume_one_event_service',
        nodeType: NodeDTOTypeEnum.Service,
      },
    },
    expectedTestId: 'serviceNode',
  },
  {
    name: 'TOPIC node',
    props: {
      data: {
        name: 'topic1',
        nodeType: NodeDTOTypeEnum.Topic,
        brokerType: NodeDTOBrokerTypeEnum.Kafka,
      },
    },
    expectedTestId: 'topicNode',
  },
  {
    name: 'HTTP node',
    props: {
      data: {
        name: 'http',
        nodeType: NodeDTOTypeEnum.Http,
      },
    },
    expectedTestId: 'httpNode',
  },
];

describe('/src/components/diagram/CustomNode.tsx', () => {
  const renderCustomNode = (props: Partial<ICustomNodeProps> = {}) =>
    render(
      <ReactFlowProvider>
        <Provider value={fork()}>
          <CustomNode {...defaultMockProps} {...props} />
        </Provider>
      </ReactFlowProvider>
    );

  // Тестирование рендеринга для каждого типа узла
  test.each(testCases)('renders node correctly', ({ expectedTestId, props }) => {
    renderCustomNode(props);

    // Проверяем, что основные элементы узла отрендерены корректно:
    // - Основной контейнер узла (например, serviceNode, topicNode)
    // - Поле с именем узла, которое должно содержать правильное значение
    expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    expect(screen.getByTestId(`${expectedTestId}Name`)).toHaveValue(props.data.name);

    // Проверяем, что хэндлы (source и target) для соединений отрендерены
    expect(screen.getByTestId('nodeSource')).toBeInTheDocument();
    expect(screen.getByTestId('nodeTarget')).toBeInTheDocument();
  });

  test('handles single and double clicks correctly', async () => {
    const scope = fork();

    // Мокаем функции для отслеживания вызовов событий toggleItemSelection и editNode
    const mockToggleSelection = jest.fn();
    const mockOpenModal = jest.fn();

    // Создаем слушатели для событий в рамках конкретного scope
    const unwatchToggleSelection = createWatch({
      unit: toggleItemSelection,
      fn: mockToggleSelection,
      scope,
    });

    const unwatchEditNode = createWatch({
      unit: editNode,
      fn: mockOpenModal,
      scope,
    });

    renderCustomNode(testCases[0].props);

    const nodeElement = screen.getByTestId('serviceNode');

    // Тестируем одинарный клик:
    // - Имитируем клик по узлу
    // - Проверяем, что событие toggleItemSelection было вызвано с правильным ID узла
    fireEvent.click(nodeElement);
    await allSettled(toggleItemSelection, {
      scope,
      params: 'test-node-id',
    });
    expect(mockToggleSelection).toHaveBeenCalledWith('test-node-id');

    // Тестируем двойной клик:
    // - Имитируем двойной клик по узлу
    // - Проверяем, что событие editNode было вызвано с правильными параметрами
    fireEvent.dblClick(nodeElement);
    await allSettled(editNode, {
      scope,
      params: {
        id: 'test-node-id',
        updates: {}, // Здесь можно передать конкретные обновления, если нужно
      },
    });
    expect(mockOpenModal).toHaveBeenCalledWith({
      id: 'test-node-id',
      updates: {},
    });

    // Очищаем слушатели после завершения теста
    unwatchToggleSelection();
    unwatchEditNode();
  });

  // Тестирование редактирования имени узла
  test('allows editing the node name on double click', async () => {
    const scope = fork();

    // Мокаем функцию для отслеживания вызова события editNode
    const mockEditNode = jest.fn();

    // Создаем слушатель для события editNode в рамках конкретного scope
    const unwatchEditNode = createWatch({
      unit: editNode,
      fn: mockEditNode,
      scope,
    });

    renderCustomNode(testCases[0].props); // Используем SERVICE узел для тестирования

    const nodeNameInput = screen.getByTestId('serviceNodeName');

    // Имитируем двойной клик для перевода поля ввода в режим редактирования
    fireEvent.dblClick(nodeNameInput);

    // Изменяем значение поля ввода и вызываем blur для сохранения изменений
    fireEvent.change(nodeNameInput, { target: { value: 'Updated Name' } });
    fireEvent.blur(nodeNameInput);

    // Проверяем, что событие editNode было вызвано с правильными параметрами
    await allSettled(editNode, {
      scope,
      params: {
        id: 'test-node-id',
        updates: { name: 'Updated Name' },
      },
    });

    expect(mockEditNode).toHaveBeenCalledWith({
      id: 'test-node-id',
      updates: { name: 'Updated Name' },
    });

    // Очищаем слушатель после завершения теста
    unwatchEditNode();
  });

  // Тестирование состояния выделения узла
  test('applies correct styles based on selection state', async () => {
    const scope = fork();

    // Мокаем функцию для отслеживания вызова события toggleItemSelection
    const mockToggleSelection = jest.fn();

    // Создаем слушатель для события toggleItemSelection в рамках конкретного scope
    const unwatchToggleSelection = createWatch({
      unit: toggleItemSelection,
      fn: mockToggleSelection,
      scope,
    });

    // Выбираем узел, чтобы установить начальное состояние $selectedItems
    await allSettled(toggleItemSelection, {
      scope,
      params: 'test-node-id',
    });

    // Рендерим компонент
    render(
      <ReactFlowProvider>
        <Provider value={scope}>
          <CustomNode {...defaultMockProps} {...testCases[0].props} id="test-node-id" />
        </Provider>
      </ReactFlowProvider>
    );

    // Находим элемент узла
    const nodeElement = screen.getByTestId('serviceNode');

    // Определяем ожидаемый класс Tailwind для выделенного состояния
    const expectedClass = NodeSelectedColorMap[testCases[0].props.data.nodeType];

    // Проверяем, что к элементу применен правильный класс для выделенного состояния
    expect(nodeElement).toHaveClass(expectedClass);

    // Очищаем слушатель после завершения теста
    unwatchToggleSelection();
  });
});

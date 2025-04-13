import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {ReactFlowProvider} from '@xyflow/react';
import {fork, allSettled} from 'effector';
import {Provider} from 'effector-react';

import {setEdges, setNodes} from '@/components/commons/diagram/model/DiagramModel';
import {applyLayout} from '@/helpers/adapters/apply-layout';
import {EventGraphDTO, NodeDTOTypeEnum} from '@/shared/api/event-graph-api';
import {
  EventGraph1,
  EventGraph2,
  EventGraph3,
  EventGraph4,
  EventGraph5,
  EventGraph6,
  EventGraph7,
  EventGraph8,
} from '@/shared/data-mock';

import {Diagram} from '../Diagram';

describe('/src/components/diagram/Diagram.tsx', () => {
  const renderDiagram = async (eventGraph: EventGraphDTO = EventGraph7) => {
    const scope = fork();

    const layoutResult = await applyLayout(eventGraph);

    await allSettled(setNodes, {
      scope,
      params: layoutResult.nodes,
    });

    await allSettled(setEdges, {
      scope,
      params: layoutResult.edges,
    });

    return render(
      <ReactFlowProvider>
        <Diagram />
      </ReactFlowProvider>,
      {
        wrapper: ({children}) => <Provider value={scope}>{children}</Provider>,
      }
    );
  };

  test('should render diagram, control buttons and background', async () => {
    await renderDiagram();

    const diagramElement = screen.getByTestId('diagram');
    const controlsElement = screen.getByTestId('rf__controls');
    const controlButtons = controlsElement.children;
    const backgroundElement = screen.getByTestId('rf__background');

    expect(diagramElement).toBeInTheDocument();
    expect(controlsElement).toBeInTheDocument();
    expect(controlsElement).toHaveClass('horizontal', 'bottom', 'center');
    expect(controlButtons).toHaveLength(5);
    expect(backgroundElement).toBeInTheDocument();
    expect(backgroundElement).toHaveClass('react-flow__background');
  });

  test.each([
    {name: 'EventGraph1', eventGraph: EventGraph1},
    {name: 'EventGraph2', eventGraph: EventGraph2},
    {name: 'EventGraph3', eventGraph: EventGraph3},
    {name: 'EventGraph4', eventGraph: EventGraph4},
    {name: 'EventGraph5', eventGraph: EventGraph5},
    {name: 'EventGraph6', eventGraph: EventGraph6},
    {name: 'EventGraph7', eventGraph: EventGraph7},
    {name: 'EventGraph8', eventGraph: EventGraph8},
  ])('should render correct count of service nodes, topic nodes and edges', async ({eventGraph}) => {
    await renderDiagram(eventGraph);

    const getNodeCountByType = (type: NodeDTOTypeEnum) => eventGraph.nodes?.filter(el => el.type === type).length || 0;

    const serviceNodes = screen.queryAllByTestId('serviceNode');
    expect(serviceNodes).toHaveLength(getNodeCountByType(NodeDTOTypeEnum.Service));

    const topicNodes = screen.queryAllByTestId('topicNode');
    expect(topicNodes).toHaveLength(getNodeCountByType(NodeDTOTypeEnum.Topic));

    const edges = screen.queryAllByTestId('customEdge');
    expect(edges).toHaveLength(eventGraph.links?.length || 0);
  });
});

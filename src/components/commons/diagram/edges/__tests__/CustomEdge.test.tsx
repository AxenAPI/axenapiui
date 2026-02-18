import { render, screen } from '@testing-library/react';
import { Position, ReactFlowProvider } from '@xyflow/react';

import { CustomEdge, ICustomEdgeProps } from '../CustomEdge';

describe('/src/components/diagram/CustomEdge.tsx', () => {
  const mockProps: ICustomEdgeProps = {
    id: '12345678-90ab-cdef-1234-567890abcdef->b2c3d4e5-f678-9012-3456-7890abcdef09',
    source: 'a',
    target: 'b',
    data: {
      color: '#b4b947',
      isExpanded: false,
      topicId: 'mock-topic-id',
      compoundLinkId: 'mock-compound-link-id',
      relatedItems: [],
    },
    sourcePosition: Position.Right,
    sourceX: 290,
    sourceY: 24.099998474121094,
    targetPosition: Position.Left,
    targetX: 447,
    targetY: 324.1000061035156,
  };

  const renderCustomEdge = (props: ICustomEdgeProps) =>
    render(
      <ReactFlowProvider>
        <CustomEdge {...props} />
      </ReactFlowProvider>
    );

  test('should render the CustomEdge component', () => {
    renderCustomEdge(mockProps);
    const customEdge = screen.getByTestId('customEdge');

    expect(customEdge).toBeInTheDocument();
  });
});

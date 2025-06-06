import {
  expectedEventGraph1DataMap,
  expectedEventGraph2DataMap,
  expectedEventGraph3DataMap,
  expectedEventGraph4DataMap,
  expectedEventGraph5DataMap,
} from '@/helpers/modal-helpers/__tests__/test-data';
import {getInfoPanelData} from '@/helpers/modal-helpers/getInfoPanelData';
import {EventGraph1, EventGraph2, EventGraph3, EventGraph4, EventGraph5} from '@/shared/data-mock';

describe('/src/helpers/modal-helpers/getInfoPanelData.tsx', () => {
  test.each([
    {name: 'EventGraph1', eventGraph: EventGraph1, expectedData: expectedEventGraph1DataMap},
    {name: 'EventGraph2', eventGraph: EventGraph2, expectedData: expectedEventGraph2DataMap},
    {name: 'EventGraph3', eventGraph: EventGraph3, expectedData: expectedEventGraph3DataMap},
    {name: 'EventGraph4', eventGraph: EventGraph4, expectedData: expectedEventGraph4DataMap},
    {name: 'EventGraph5', eventGraph: EventGraph5, expectedData: expectedEventGraph5DataMap},
  ])('should return the expected result', ({eventGraph, expectedData}) => {
    eventGraph.nodes.forEach(node => {
      const {consumingData, producingData} = getInfoPanelData(
        node.id,
        eventGraph.links,
        eventGraph.nodes,
        eventGraph.events
      );

      expect(consumingData).toEqual(expectedData[node.id].consumingData);
      expect(producingData).toEqual(expectedData[node.id].producingData);
    });
  });
});

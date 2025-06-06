import {v4 as uuidV4} from 'uuid';

import {EConnectionType, EObjectToConnect} from '@/enums/common';
import {ILinkForm} from '@/types/common';

import {getDeterminedLinkIds} from '../getDeterminedLinkIds';

jest.mock('uuid');

describe('getDeterminedLinkIds', () => {
  const mockUUID = 'mock-uuid';

  beforeEach(() => {
    (uuidV4 as jest.Mock).mockReturnValue(mockUUID);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly determine IDs for HTTP_NODE connection type', () => {
    const link: ILinkForm = {
      fromId: 'service-id',
      toId: 'http-node-id',
      eventId: 'event-id',
      objectToConnect: EObjectToConnect.HTTP_NODE,
      connectionType: EConnectionType.CONSUME,
    };

    const result = getDeterminedLinkIds(EConnectionType.CONSUME, link);

    expect(result).toEqual({
      id: mockUUID,
      fromId: 'http-node-id',
      toId: 'service-id',
      eventId: 'event-id',
    });
  });

  it('should correctly determine IDs for CONSUME connection type', () => {
    const link: ILinkForm = {
      fromId: 'service-id',
      toId: 'consumer-id',
      eventId: 'event-id',
      objectToConnect: EObjectToConnect.TOPIC,
      connectionType: EConnectionType.CONSUME,
    };

    const result = getDeterminedLinkIds(EConnectionType.CONSUME, link);

    expect(result).toEqual({
      id: mockUUID,
      fromId: 'consumer-id',
      toId: 'service-id',
      eventId: 'event-id',
    });
  });

  it('should correctly determine IDs for PRODUCE connection type', () => {
    const link: ILinkForm = {
      fromId: 'producer-id',
      toId: 'service-id',
      eventId: 'event-id',
      objectToConnect: EObjectToConnect.TOPIC,
      connectionType: EConnectionType.CONSUME,
    };

    const result = getDeterminedLinkIds(EConnectionType.PRODUCE, link);

    expect(result).toEqual({
      id: mockUUID,
      fromId: 'producer-id',
      toId: 'service-id',
      eventId: 'event-id',
    });
  });
});

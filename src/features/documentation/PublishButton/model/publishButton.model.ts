import { createEvent } from 'effector';

const publishClicked = createEvent();

export const publishButtonModel = {
  events: {
    publishClicked,
  },
};

import { createModel } from 'schemix';

import ObjectModel from './object.model';

export default createModel('OwnersOnObject', (OwnershipModel) => {
  OwnershipModel.string('userId')
    .int('objectId')
    .relation('object', ObjectModel, {
      fields: ['objectId'],
      references: ['id'],
      onDelete: 'Cascade'
    })
    .boolean('author', { default: false })
    .id({ fields: ['userId', 'objectId'] });
});

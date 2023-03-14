import { createModel } from 'schemix';

import ObjectModel from './object.model';

export default createModel('OwnersOnObject', (OwnershipModel) => {
  OwnershipModel.string('id')
    .int('objectId')
    .relation('object', ObjectModel, {
      fields: ['objectId'],
      references: ['id'],
      onDelete: 'Cascade'
    })
    .boolean('author', { default: false })
    .id({ fields: ['id', 'objectId'] });
});

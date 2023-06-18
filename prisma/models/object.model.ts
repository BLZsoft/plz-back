import { createModel } from 'schemix';

import OwnersOnObject from './owners-on-object.model';
import IdMixin from '../mixins/id.mixin';

export default createModel('Object', (ObjectModel) => {
  ObjectModel.mixin(IdMixin)
    .relation('owners', OwnersOnObject, { list: true })
    .string('name')
    .string('sp2type')
    .string('sp2name')
    .string('sp2questions')
    .int('upFloors')
    .boolean('isUnderFloor')
    .int('underFloors')
    .float('fireRoomArea')
    .float('tradeArea')
    .boolean('blackTradeRooms')
    .float('height')
    .float('volume')
    .string('class')
    .string('degree')
    .string('address')
    .string('typeOfBuild');
});

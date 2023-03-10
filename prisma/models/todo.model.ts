import { createModel } from 'schemix';

import CreatedAtMixin from '../mixins/created-at.mixin';
import IdMixin from '../mixins/id.mixin';

export default createModel('Todo', (TodoModel) => {
  TodoModel.mixin(IdMixin).string('value').mixin(CreatedAtMixin);
});

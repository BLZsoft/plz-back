import { createMixin } from 'schemix';

export default createMixin((IdMixin) => {
  IdMixin.int('id', { id: true, default: { autoincrement: true } });
});

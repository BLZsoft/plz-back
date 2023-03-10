import { createMixin } from 'schemix';

export default createMixin((CreatedAtMixin) => {
  CreatedAtMixin.dateTime('createdAt', { default: { now: true } });
});

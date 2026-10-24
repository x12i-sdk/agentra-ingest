import assert from 'node:assert/strict';
import { InMemoryEventStore } from '@x12i/agentra-events';
import { ingestEventBatch, getIngestedEvent } from '@x12i/agentra-ingest';
const scope = { tenantId: 'fixture-tenant', accountId: 'fixture-account', environment: 'dev' };
const events = [1, 2].map(index => ({ scope, event: { id: 'event-' + index, type: 'report.generated', createdAt: new Date().toISOString() },
  actor: { id: 'fixture-user', type: 'user' }, product: { app: 'example', feature: 'reports' }, classification: { status: 'success' },
}));
const store = new InMemoryEventStore();
const result = await ingestEventBatch([...events, { scope: {} }], { store, allowGeneratedId: false, allowGeneratedTimestamp: false });
assert.equal(result.accepted.length, 2);
assert.equal(result.rejected.length, 1);
assert.equal((await getIngestedEvent(store, 'event-1')).eventType, 'report.generated');
console.log(result);

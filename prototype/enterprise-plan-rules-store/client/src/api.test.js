import { afterEach, expect, it, vi } from 'vitest';
import { api } from './api.js';

afterEach(() => vi.unstubAllGlobals());

it('preserves the server error code and message for a missing relationship', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: false,
    status: 404,
    json: async () => ({ error: 'No effective active rule exists.', code: 'RULE_NOT_FOUND' })
  }));
  await expect(api.getRelationship('from', 'to')).rejects.toMatchObject({
    message: 'No effective active rule exists.',
    code: 'RULE_NOT_FOUND',
    status: 404
  });
});

import { describe, expect, it } from 'vitest';
import { hasPermissionAction } from './permissions';

describe('hasPermissionAction', () => {
  it('treats 0100 as read-only', () => {
    expect(hasPermissionAction(100, 1)).toBe(true);
    expect(hasPermissionAction(100, 2)).toBe(false);
    expect(hasPermissionAction(100, 3)).toBe(false);
    expect(hasPermissionAction(100, 4)).toBe(false);
  });

  it('maps CRUD bits in C-R-U-D order', () => {
    expect(hasPermissionAction(1110, 1)).toBe(true);
    expect(hasPermissionAction(1110, 2)).toBe(true);
    expect(hasPermissionAction(1110, 3)).toBe(true);
    expect(hasPermissionAction(1110, 4)).toBe(false);
  });
});

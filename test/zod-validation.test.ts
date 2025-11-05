import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Zod Validation Setup', () => {
  it('should validate data with Zod schemas', () => {
    const UserSchema = z.object({
      name: z.string(),
      age: z.number().positive(),
    });

    const validUser = { name: 'John', age: 30 };
    const result = UserSchema.safeParse(validUser);

    expect(result.success).toBe(true);
  });

  it('should catch validation errors', () => {
    const UserSchema = z.object({
      name: z.string(),
      age: z.number().positive(),
    });

    const invalidUser = { name: 'John', age: -5 };
    const result = UserSchema.safeParse(invalidUser);

    expect(result.success).toBe(false);
  });
});

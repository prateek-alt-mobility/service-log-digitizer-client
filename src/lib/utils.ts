import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z, type ZodRawShape } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to create a type-safe form schema
 * @example
 * const schema = createFormSchema({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * });
 */
export const createFormSchema = <T extends ZodRawShape>(schema: T) => {
  return z.object(schema);
};

export type inferFormSchema<T extends ZodRawShape> = z.infer<
  ReturnType<typeof createFormSchema<T>>
>;

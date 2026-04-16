/**
 * Standard API response envelope.
 * All routes must return this discriminated union.
 */
import { NextResponse } from "next/server";
import type { z } from "zod";

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; details?: unknown };

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiResult<T>>(
    { success: true, data },
    init ?? { status: 200 }
  );
}

export function fail(
  error: string,
  status = 400,
  code?: string,
  details?: unknown
) {
  return NextResponse.json<ApiResult<never>>(
    { success: false, error, code, details },
    { status }
  );
}

/**
 * Parse request body against a Zod schema with standard error handling.
 * Returns parsed data or a NextResponse 400 error.
 */
export async function parseBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T
): Promise<
  | { success: true; data: z.infer<T> }
  | { success: false; response: ReturnType<typeof fail> }
> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      success: false,
      response: fail("Invalid JSON body", 400, "INVALID_JSON"),
    };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      response: fail(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        result.error.issues
      ),
    };
  }

  return { success: true, data: result.data };
}

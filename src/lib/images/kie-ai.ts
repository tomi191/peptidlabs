/**
 * KIE.ai GPT Image-2 client.
 *
 * Used for generating product photography for peptide vials, label swaps
 * via image-to-image, and brand assets.
 *
 * Pattern:
 *   const taskId = await createTextToImage({ prompt, aspectRatio: "3:4" });
 *   const urls = await waitForResult(taskId);
 *   // download urls[0] within 24 hours — then expires
 */

const BASE_URL = "https://api.kie.ai/api/v1/jobs";

type AspectRatio = "auto" | "1:1" | "9:16" | "16:9" | "4:3" | "3:4";
type Resolution = "1K" | "2K" | "4K";

type CreateTextToImageOpts = {
  prompt: string;
  aspectRatio?: AspectRatio;
  resolution?: Resolution;
  callBackUrl?: string;
};

type CreateImageToImageOpts = CreateTextToImageOpts & {
  inputUrls: string[]; // up to 16
};

type TaskState = "waiting" | "queuing" | "generating" | "success" | "fail";

type TaskRecord = {
  taskId: string;
  state: TaskState;
  resultJson: string;
  failCode: string | null;
  failMsg: string | null;
  costTime: number | null;
  progress?: number;
};

function authHeaders(): HeadersInit {
  const key = process.env.KIE_AI_API_KEY;
  if (!key) throw new Error("KIE_AI_API_KEY is not configured");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function createTextToImage(
  opts: CreateTextToImageOpts
): Promise<string> {
  const res = await fetch(`${BASE_URL}/createTask`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      model: "gpt-image-2-text-to-image",
      ...(opts.callBackUrl ? { callBackUrl: opts.callBackUrl } : {}),
      input: {
        prompt: opts.prompt,
        aspect_ratio: opts.aspectRatio ?? "1:1",
        resolution: opts.resolution ?? "2K",
      },
    }),
  });
  const json = await res.json();
  if (json.code !== 200) {
    throw new Error(`kie-ai createTask failed: ${json.msg ?? json.code}`);
  }
  return json.data.taskId as string;
}

export async function createImageToImage(
  opts: CreateImageToImageOpts
): Promise<string> {
  if (opts.inputUrls.length === 0 || opts.inputUrls.length > 16) {
    throw new Error("inputUrls must contain 1 to 16 image URLs");
  }
  const res = await fetch(`${BASE_URL}/createTask`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      model: "gpt-image-2-image-to-image",
      ...(opts.callBackUrl ? { callBackUrl: opts.callBackUrl } : {}),
      input: {
        prompt: opts.prompt,
        input_urls: opts.inputUrls,
        aspect_ratio: opts.aspectRatio ?? "auto",
        resolution: opts.resolution ?? "1K",
      },
    }),
  });
  const json = await res.json();
  if (json.code !== 200) {
    throw new Error(`kie-ai createTask failed: ${json.msg ?? json.code}`);
  }
  return json.data.taskId as string;
}

export async function getTaskStatus(taskId: string): Promise<TaskRecord> {
  const res = await fetch(`${BASE_URL}/recordInfo?taskId=${taskId}`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (json.code !== 200) {
    throw new Error(`kie-ai recordInfo failed: ${json.msg ?? json.code}`);
  }
  return json.data as TaskRecord;
}

/**
 * Poll until task reaches a terminal state. Returns the result image URLs.
 *
 * Uses exponential backoff starting at 3s, capped at 15s. Times out after
 * 10 minutes. Result URLs expire after 24 hours.
 */
export async function waitForResult(
  taskId: string,
  options: { timeoutMs?: number; initialDelayMs?: number } = {}
): Promise<string[]> {
  const timeoutMs = options.timeoutMs ?? 10 * 60 * 1000;
  const startedAt = Date.now();
  let delay = options.initialDelayMs ?? 3000;

  while (Date.now() - startedAt < timeoutMs) {
    const record = await getTaskStatus(taskId);

    if (record.state === "success") {
      const parsed = JSON.parse(record.resultJson) as { resultUrls: string[] };
      return parsed.resultUrls;
    }

    if (record.state === "fail") {
      throw new Error(
        `kie-ai task failed: ${record.failMsg ?? record.failCode ?? "unknown"}`
      );
    }

    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay * 1.4, 15000);
  }

  throw new Error(`kie-ai task ${taskId} timed out after ${timeoutMs}ms`);
}

/** Convenience: end-to-end text-to-image with polling. */
export async function generateImage(
  opts: CreateTextToImageOpts
): Promise<string[]> {
  const taskId = await createTextToImage(opts);
  return waitForResult(taskId);
}

/** Convenience: end-to-end image-to-image with polling. */
export async function transformImage(
  opts: CreateImageToImageOpts
): Promise<string[]> {
  const taskId = await createImageToImage(opts);
  return waitForResult(taskId);
}

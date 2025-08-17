// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any) => Promise<unknown>>(
  fn: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let abortController: AbortController | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (timer) {
      clearTimeout(timer);
    }

    // cancel previous API request
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();
    const signal = abortController.signal;

    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        try {
          const result = await fn(args[0], signal);
          resolve(result as ReturnType<T>);
        } catch (err) {
          if ((err as DOMException).name === "AbortError") {
            return;
          }
          reject(err);
        }
      }, delay);
    });
  };
}

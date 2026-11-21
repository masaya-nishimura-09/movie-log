import { useEffect, useState } from "react";

export function useImageRatios(urls: string[]): number[] | null {
  const key = urls.join("\n");
  const [ratios, setRatios] = useState<{ key: string; values: number[] }>();

  useEffect(() => {
    let active = true;
    const list = key.split("\n");
    Promise.all(
      list.map(
        (url) =>
          new Promise<number>((resolve) => {
            const image = new window.Image();
            image.onload = () =>
              resolve(
                image.naturalHeight > 0
                  ? image.naturalWidth / image.naturalHeight
                  : 1,
              );
            image.onerror = () => resolve(1);
            image.src = url;
          }),
      ),
    ).then((values) => {
      if (active) setRatios({ key, values });
    });
    return () => {
      active = false;
    };
  }, [key]);

  return ratios?.key === key ? ratios.values : null;
}

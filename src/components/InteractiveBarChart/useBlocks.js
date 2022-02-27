import { useMemo } from "react";
import { extent } from "d3-array";

const AVAILABLE_BLOCKS = 20;

export function useBlocks(config) {
  return useMemo(() => {
    const yExtent = extent(config.data, (d) => d[config.yKey]);

    const sum = config.data.reduce((sum, d) => sum + d[config.yKey], 0);
    const rawBlocksize = sum / AVAILABLE_BLOCKS;
    const niceBorders = [1, 2.5, 5, 10];
    const numDigits = Math.round(rawBlocksize).toString().length;
    const scaleBlock = 1 / Math.pow(10, numDigits - 1);
    const scaledBlockSize = rawBlocksize * scaleBlock;
    const closestBorder = niceBorders.reduce((prev, curr) =>
      Math.abs(curr - scaledBlockSize) < Math.abs(prev - scaledBlockSize)
        ? curr
        : prev
    );

    // scale back
    const blockSize = closestBorder * (1 / scaleBlock);

    console.log({rawBlocksize, scaleBlock, scaledBlockSize, closestBorder, blockSize})

    return { minY: 0, maxY: yExtent[1], blockSize };
  }, [config]);
}

import React, { useState, useMemo, useEffect } from "react";
import { scaleLinear } from "d3-scale";
import { DndProvider } from "react-dnd";
import MouseBackEnd from "react-dnd-mouse-backend";

import cn from "./index.module.css";
import { ChartPresenter } from "../ChartPresenter";
import { Swoopy } from "../Swoopy";
import { Chart, YAxis } from "../MinimalCharts";
import { useBlocks } from "./useBlocks";
import { Block } from "./Block";
import { CustomDragLayer } from "./CustomDragLayer";
import { InteractiveBars } from "./InteractiveBars";

export const InteractiveBarChart = ({ config }) => {
  const [items, setItems] = useState(
    config.data.reduce(
      (prev, d) => ({ ...prev, [d[config.xKey]]: [] }),
      {}
    )
  );

  const { maxY, minY, blockSize } = useBlocks(config);

  const height = 200;
  const scaleY = useMemo(
    () => scaleLinear().domain([maxY, minY]).range([0, height]).nice(),
    [maxY, minY]
  );

  const scaledBlockSize = scaleY.range()[1] - scaleY(blockSize);
  const legendItemPadding = 15;

  return (
    <DndProvider backend={MouseBackEnd}>
      <div className={cn.container}>
        <Swoopy/>
        <ChartPresenter title={config.title}>
          <Chart
            getX={(d) => d[config.xKey]}
            getY={(d) => d[config.yKey]}
            height={height}
            width={400}
            scaleY={scaleY}
          >
            <InteractiveBars
              data={config.data}
              barWidth={scaledBlockSize}
              items={items}
              setItems={setItems}
            />
            <YAxis />
          </Chart>
        </ChartPresenter>
        <ChartPresenter className={cn.toolsContainer}>
          {
            [...Array(3).keys()].reduce(
              (prev, i) => {
                const blockHeight = scaledBlockSize * Math.pow(2, i - 1);
                const yShift = prev.yShift + blockHeight + legendItemPadding;
                return {
                  yShift,
                  items: [
                    ...prev.items,
                    <Block
                      height={blockHeight}
                      size={blockSize * Math.pow(2, i - 1)}
                      top={`${prev.yShift}px`}
                      scaledSize={scaledBlockSize}
                      padding={legendItemPadding}
                      label={config.yAxisLabel}
                    />,
                  ],
                };
              },
              { yShift: 0, items: [] }
            ).items
          }
          <CustomDragLayer snapToGrid={false} />
        </ChartPresenter>
      </div>
    </DndProvider>
  );
};

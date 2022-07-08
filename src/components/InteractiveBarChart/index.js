import React, { useState, useMemo, useEffect } from "react";
import { scaleLinear } from "d3-scale";
import { DndProvider } from "react-dnd";
import MouseBackEnd from "react-dnd-mouse-backend";

import cn from "./index.module.css";
import { Swoopy } from "../Swoopy";
import { Chart, YAxis } from "../MinimalCharts";
import { useRef } from "react";
import { useBlocks } from "./useBlocks";
import { Block } from "./Block";
import { CustomDragLayer } from "./CustomDragLayer";
import { InteractiveBars } from "./InteractiveBars";
import { useDimensions } from "../../hooks/useDimensions";
import { datasetGroups } from "../../config";
import { DatasetBlock, DatasetPlaceholder } from "./DatasetBlock";

export const InteractiveBarChart = ({ config }) => {
  const [items, setItems] = useState(
    config.data.reduce((prev, d) => ({ ...prev, [d[config.xKey]]: [] }), {})
  );
  const [dataset, setDataset] = useState();

  const { maxY, minY, blockSize } = useBlocks(config);

  const ref = useRef(null);
  const dimensions = useDimensions(ref);

  const height = 800;
  const scaleY = useMemo(
    () => scaleLinear().domain([maxY, minY]).range([0, height]).nice(),
    [maxY, minY, height]
  );

  const scaledBlockSize = scaleY.range()[1] - scaleY(blockSize);

  return (
    <DndProvider backend={MouseBackEnd}>
      <div className={cn.container}>
        <div className={cn.leftContainer}>
          <div className={cn.dataSetPlaceholderContainer}>
            {dataset ? (
              <DatasetBlock
                isTop={true}
                barWidth={scaledBlockSize}
                height={scaledBlockSize}
                yShift={-25}
                wrapSvg={true}
                dataset={dataset}
                removeItem={() => setDataset(null)}
              />
            ) : (
              <DatasetPlaceholder
                className={cn.dataSetPlaceholder}
                barWidth={scaledBlockSize}
                yShift={25}
                onDrop={(item) => setDataset(item)}
              />
            )}
          </div>
          <div className={cn.chart} ref={ref}>
            <Chart
              getX={(d) => d[config.xKey]}
              getY={(d) => d[config.yKey]}
              height={height}
              width={dimensions.width * 0.8}
              scaleY={scaleY}
            >
              <InteractiveBars
                data={config.data}
                barWidth={scaledBlockSize}
                items={items}
                setItems={setItems}
              />
            </Chart>
          </div>
        </div>

        <div className={cn.toolsContainer}>
          <div className={cn.blocks}>
            {[...Array(3).keys()].map((i) => {
              const blockHeight = scaledBlockSize * Math.pow(2, i - 1);
              return (
                <div className={cn.block} key={i}>
                  <Block
                    isTop={true}
                    barWidth={scaledBlockSize}
                    height={blockHeight}
                    yShift={-25}
                    wrapSvg={true}
                  />
                </div>
              );
            })}
          </div>
          <CustomDragLayer snapToGrid={false} />

          {datasetGroups.map((group) => (
            <div>
              <h2>{group.title}</h2>
              <div className={cn.datasets}>
                {group.datasets.map((dataset) => (
                  <DatasetBlock
                    isTop={true}
                    barWidth={scaledBlockSize}
                    height={scaledBlockSize}
                    yShift={-25}
                    wrapSvg={true}
                    dataset={dataset}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

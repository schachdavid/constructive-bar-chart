import React, { useContext, useMemo } from "react";
import { scaleLinear } from "d3-scale";
import { DndProvider } from "react-dnd";
import MouseBackEnd from "react-dnd-mouse-backend";

import { Block, Placeholder } from "./Block";
import { CustomDragLayer } from "./CustomDragLayer";
import { InteractiveBars } from "./InteractiveBars";
import { useDimensions } from "../../hooks/useDimensions";
import { DatasetBlock, DatasetPlaceholder } from "./DatasetBlock";
import { Context, ContextProvider } from "./Context";
import { MainDisplay } from "./MainDisplay";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import { ReactComponent as CheckMarkIcon } from "../../static-assets/icons/circle-check-mark.svg";

import cn from "./index.module.css";
import { fieldsToBlockSums } from "../../utils";

function findDataset(availableDatasets, id) {
  for (const group of availableDatasets) {
    for (const dataset of group.datasets) {
      if (dataset.id === id) return dataset;
    }
  }
}

function getError(solution, blockSums) {
  return solution.reduce(
    (prev, cur, i) => prev + Math.abs(cur - blockSums[i]),
    0
  );
}

function findClosestSolution(solutions, fields) {
  const blockSums = fieldsToBlockSums(fields);
  return solutions.reduce(
    (bestSolution, solution) => {
      const error = getError(solution, blockSums);
      if (bestSolution.error == null || error < bestSolution.error) {
        return { error, solution };
      }
      return bestSolution;
    },
    { solution: null, error: null }
  ).solution;
}

const Content = () => {
  const [ref, dimensions] = useDimensions();
  const {
    availableBlocks,
    setAvailableBlocks,
    dataset,
    setDataset,
    availableDatasets,
    setAvailableDatasets,
    solution,
    setSolution,
    fields,
  } = useContext(Context);

  const height = useMemo(() => dimensions.height - 100, [dimensions.height]);
  const scaleY = useMemo(
    () => scaleLinear().domain([9, 0]).range([0, height]).nice(),
    [height]
  );

  const windowWidth = useWindowWidth();

  const scaledBlockSize = Math.min(height / 7, dimensions.width / 7);

  const removeAvailableBlock = (i) => {
    availableBlocks[i] = Math.max(availableBlocks[i] - 1, 0);
    setAvailableBlocks([...availableBlocks]);
  };

  const addAvailableBlock = (i) => {
    availableBlocks[i] = availableBlocks[i] + 1;
    setAvailableBlocks([...availableBlocks]);
  };

  const hideDataset = (id) => {
    const datasetToHide = findDataset(availableDatasets, id);
    datasetToHide.hidden = true;
    setAvailableDatasets([...availableDatasets]);
  };

  const unhideDataset = (id) => {
    const datasetToHide = findDataset(availableDatasets, id);
    datasetToHide.hidden = false;
    setAvailableDatasets([...availableDatasets]);
  };

  const isMobile = windowWidth <= 768;

  if (isMobile)
    return (
      <div className={cn.noMobileContainer}>
        <div className={cn.noMobileMessage}>
          Seite nicht verfügbar für mobile Endgeräte oder schmale
          Browser-Fenster.
        </div>
      </div>
    );

  return (
    <div className={cn.container}>
      <div className={cn.leftContainer}>
        <div className={cn.leftMain}>
          <div className={cn.selectedDataSetContainer}>
            {dataset ? (
              <DatasetBlock
                isTop={true}
                barWidth={scaledBlockSize}
                height={scaledBlockSize}
                wrapSvg={true}
                dataset={dataset}
                onDrag={() => {
                  setDataset(null);
                  setSolution(null);
                }}
                onFailedDrop={() => {
                  unhideDataset(dataset.id);
                }}
              />
            ) : (
              <DatasetPlaceholder
                className={cn.dataSetPlaceholder}
                barWidth={scaledBlockSize}
                onDrop={(item) => {
                  setDataset(item);
                }}
              />
            )}
            <MainDisplay width={scaledBlockSize} />
          </div>
          <div className={cn.chart} ref={ref}>
            <svg height={height + 50} width={dimensions.width}>
              <InteractiveBars
                barWidth={scaledBlockSize}
                getX={(d) => d.label}
                height={height}
                width={dimensions.width - 50}
                scaleY={scaleY}
              />
            </svg>
          </div>
        </div>
        <button
          className={cn.button}
          style={{ visibility: dataset && !solution ? "visible" : "hidden" }}
          onClick={() =>
            setSolution(findClosestSolution(dataset.solutions, fields))
          }
        >
          <CheckMarkIcon className={cn.checkIcon} />
          Zeige mir die Lösung
        </button>
      </div>

      <div className={cn.toolsContainer}>
        <div
          className={cn.blocks}
          style={{ height: 3 * scaledBlockSize + "px" }}
        >
          {availableBlocks.map((d, i) => {
            const size = Math.pow(2, i - 1);
            return (
              <div className={cn.block} key={i}>
                {d > 0 ? (
                  <Block
                    isTop={true}
                    barWidth={scaledBlockSize}
                    size={size}
                    wrapSvg={true}
                    onDrag={() => removeAvailableBlock(i)}
                    onFailedDrop={() => addAvailableBlock(i)}
                  />
                ) : (
                  <Placeholder barWidth={scaledBlockSize} wrapSvg={true} />
                )}
                {
                  <div
                    className={cn.blocksLeftLabel}
                    style={{
                      paddingRight: scaledBlockSize / 5,
                      visibility: d < 4 ? "visible" : "hidden",
                    }}
                  >
                    {d} übrig
                  </div>
                }
              </div>
            );
          })}
        </div>
        <CustomDragLayer snapToGrid={false} />

        {availableDatasets.map((group) => (
          <div>
            <div className={cn.titleContainer}>
              <div className={cn.icon}>{group.icon}</div>
              <div className={cn.groupTitle}>{group.title}</div>
            </div>
            <div
              className={cn.datasets}
              style={{ minHeight: scaledBlockSize * 2 }}
            >
              {group.datasets.map((d, i) =>
                d.hidden ? (
                  <div
                    className={cn.datasetWithLabel}
                    style={{
                      position: "relative",
                      bottom: 47,
                    }}
                  >
                    <DatasetPlaceholder
                      barWidth={scaledBlockSize}
                      wrapSvg={true}
                      className={cn.dataSetPlaceholder}
                      onDrop={(item) => unhideDataset(item.id)}
                    />
                  </div>
                ) : (
                  <div className={cn.datasetWithLabel}>
                    <DatasetBlock
                      key={d.id}
                      isTop={true}
                      barWidth={scaledBlockSize}
                      height={scaledBlockSize}
                      wrapSvg={true}
                      dataset={d}
                      onDrag={() => hideDataset(d.id)}
                      onFailedDrop={() => unhideDataset(d.id)}
                    />
                    <div
                      className={cn.source}
                      style={{
                        paddingRight: scaledBlockSize / 5,
                        fontSize: scaledBlockSize / 8,
                      }}
                    >
                      Quelle: {d.source}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InteractiveBarChart = () => (
  <ContextProvider>
    <DndProvider backend={MouseBackEnd}>
      <Content />
    </DndProvider>
  </ContextProvider>
);

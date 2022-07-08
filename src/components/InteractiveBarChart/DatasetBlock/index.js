import { useDrag } from "react-dnd";
import React from "react";
import { useDrop } from "react-dnd";

import { datasetDndType } from "../config";
import cn from "./index.module.css";
import { cx } from "../../../utils";

const padding = 1;

const getXStretch = (barWidth) => barWidth / 5;
const getYStretch = (barWidth) => barWidth / 4;

export const DatasetPlaceholder = ({
  barWidth,
  className,
  scaleX,
  yShift = 0,
  onDrop,
}) => {
  const [{ item, isOver }, drop] = useDrop(
    () => ({
      accept: datasetDndType,
      drop: (item) => onDrop(item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        item: monitor.getItem(),
      }),
    }),
    [onDrop]
  );

  const width = barWidth;
  const xStretch = getXStretch(barWidth);
  const yStretch = getYStretch(barWidth);

  return (
    <div ref={drop} className={cn.placeholderContainer}>
      <svg height={25} width={barWidth + 25}>
        <g
          transform={`translate(${
            barWidth && scaleX ? scaleX.bandwidth() / 2 - barWidth / 2 : 0
          }, ${yShift})`}
          className={className}
        >
          <path
            className={cx(className)}
            d={`M0 0 L${width} 0  L${
              width + xStretch
            } ${-yStretch} L${xStretch} ${-yStretch} Z`}
            shapeRendering="crispEdges"
          />
        </g>
      </svg>
    </div>
  );
};

export const StaticDatasetBlock = React.forwardRef(
  (
    {
      className,
      barWidth,
      scaleX,
      height: rawHeight,
      yShift = 0,
      isTop,
      wrapSvg,
      dataset,
    },
    ref
  ) => {
    const width = barWidth || scaleX?.bandwidth();
    const height = rawHeight - padding * 2;
    const xStretch = getXStretch(barWidth);
    const yStretch = getYStretch(barWidth);

    const content = (
      <g
        ref={ref}
        transform={`translate(${
          barWidth && scaleX ? scaleX.bandwidth() / 2 - barWidth / 2 : 0
        }, ${-yShift - padding})`}
        className={className}
      >
        <rect
          className={cn.bar}
          style={{ cursor: "grab" }}
          height={height}
          width={width}
          shapeRendering="crispEdges"
        />
        <path
          className={cn.rightSide}
          d={`M${width} 0 L${width} ${height} L${width + xStretch} ${
            height - yStretch
          } L${width + xStretch} ${-yStretch} Z`}
          shapeRendering="crispEdges"
        />
        {isTop && (
          <path
            className={cn.top}
            d={`M0 0 L${width} 0  L${
              width + xStretch
            } ${-yStretch} L${xStretch} ${-yStretch} Z`}
            shapeRendering="crispEdges"
          />
        )}
        <foreignObject x="0" y="0" width={width} height={height}>
          <div className={cn.title}>{dataset?.title}</div>
        </foreignObject>
      </g>
    );

    return wrapSvg ? (
      <svg height={height + 25} width={barWidth + 25} className={cn.svgWrapper}>
        {content}
      </svg>
    ) : (
      content
    );
  }
);

export const DatasetBlock = ({
  className,
  barWidth,
  scaleX,
  height,
  yShift = 0,
  removeItem,
  isTop,
  wrapSvg,
  dataset,
}) => {
  const [, drag] = useDrag(() => {
    return {
      type: datasetDndType,
      item: () => {
        if (removeItem) removeItem();
        return {...dataset, height, width: barWidth };
      },
    };
  }, [removeItem, barWidth]);

  return (
    <StaticDatasetBlock
      ref={drag}
      wrapSvg={wrapSvg}
      className={className}
      barWidth={barWidth}
      scaleX={scaleX}
      height={height}
      yShift={yShift}
      removeItem={removeItem}
      isTop={isTop}
      dataset={dataset}
    />
  );
};

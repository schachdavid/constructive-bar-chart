import { useDrag } from "react-dnd";
import React from "react";
import { useDrop } from "react-dnd";

import { datasetDndType } from "../config";
import cn from "./index.module.css";
import { cx } from "../../../utils";
import { BLOCK_PADDING, FONT_ASPECT_RATIO } from "../../../constants";

const getXStretch = (barWidth) => barWidth / 5;
const getYStretch = (barWidth) => barWidth / 4;

export const DatasetPlaceholder = ({ barWidth, className, scaleX, onDrop }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: datasetDndType,
      drop: onDrop,
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
      {isOver ? (
        <StaticDatasetBlock
          wrapSvg={true}
          barWidth={barWidth}
          scaleX={scaleX}
          height={barWidth}
          isTop={true}
          className={cn.ghostBlock}
        />
      ) : (
        <svg height={yStretch} width={barWidth + xStretch}>
          <g
            transform={`translate(${
              barWidth && scaleX ? scaleX.bandwidth() / 2 - barWidth / 2 : 0
            }, ${yStretch})`}
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
      )}
    </div>
  );
};

const getTitleFontsize = (barWidth, length) => {
  const lineLength = Math.min(30, length / 4);
  const fontSize = Math.round((barWidth / lineLength) * FONT_ASPECT_RATIO);
  return Math.min(fontSize, 12);
};

export const StaticDatasetBlock = React.forwardRef(
  (
    {
      disableHover,
      className,
      barWidth,
      scaleX,
      height: rawHeight,
      isTop,
      wrapSvg,
      dataset,
    },
    ref
  ) => {
    const width = barWidth || scaleX?.bandwidth();
    const height = rawHeight - BLOCK_PADDING * 2;
    const xStretch = getXStretch(barWidth);
    const yStretch = getYStretch(barWidth);

    const content = (
      <g
        ref={ref}
        transform={`translate(${
          barWidth && scaleX ? scaleX.bandwidth() / 2 - barWidth / 2 : 0
        }, ${yStretch})`}
        className={className}
        style={disableHover ? {} : { cursor: "grab" }}
      >
        <rect
          className={cn.bar}
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
        <foreignObject
          x="0"
          y="0"
          width={width}
          height={height}
          style={{ overflow: "visible" }}
        >
          <div
            className={cn.title}
            style={{
              fontSize: getTitleFontsize(width, dataset?.title.length) + "px",
            }}
          >
            {dataset?.title}
          </div>
        </foreignObject>
      </g>
    );

    return wrapSvg ? (
      <svg
        height={height + yStretch}
        width={barWidth + xStretch}
        className={cn.svgWrapper}
      >
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
  isTop,
  wrapSvg,
  dataset,
  onDrag,
  onFailedDrop,
}) => {
  const [collected, drag] = useDrag(() => {
    return {
      collect: (monitor) => ({
        anythingIsDragging: monitor.getItem() !== null,
      }),
      type: datasetDndType,
      item: () => {
        if (onDrag) onDrag();
        return { ...dataset, height, width: barWidth };
      },
      end: (item, monitor) => {
        const didDrop = monitor.didDrop();
        if (!didDrop && onFailedDrop) onFailedDrop(item);
      },
    };
  }, [onDrag, barWidth]);

  return (
    <StaticDatasetBlock
      ref={drag}
      wrapSvg={wrapSvg}
      className={className}
      barWidth={barWidth}
      scaleX={scaleX}
      height={height}
      isTop={isTop}
      dataset={dataset}
      disableHover={collected.anythingIsDragging}
    />
  );
};

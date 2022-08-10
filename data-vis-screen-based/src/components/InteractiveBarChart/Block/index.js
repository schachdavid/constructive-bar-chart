import { useDrag } from "react-dnd";
import React from "react";

import { blocksDndType } from "../config";
import cn from "./index.module.css";
import { BLOCK_PADDING } from "../../../constants";

const getXStretch = (barWidth) => barWidth / 5;
const getYStretch = (barWidth) => barWidth / 4;

export const Placeholder = ({ barWidth, wrapSvg }) => {
  const width = barWidth;
  const xStretch = getXStretch(barWidth);
  const yStretch = getYStretch(barWidth);

  const content = (
    <path
      className={cn.placeholder}
      d={`M0 0 L${width} 0  L${
        width + xStretch
      } ${-yStretch} L${xStretch} ${-yStretch} Z`}
      shapeRendering="crispEdges"
    />
  );

  return wrapSvg ? (
    <svg height={25} width={barWidth + 25} className={cn.svgWrapper}>
      {content}
    </svg>
  ) : (
    content
  );
};

export const StaticBlock = React.forwardRef(
  (
    {
      disableHover,
      className,
      barWidth,
      scaleX,
      size,
      yShift = 0,
      isTop,
      wrapSvg,
    },
    ref
  ) => {
    const width = barWidth || scaleX?.bandwidth();
    const height = barWidth * size - BLOCK_PADDING * 2;
    const xStretch = getXStretch(barWidth);
    const yStretch = getYStretch(barWidth);

    const content = (
      <g
        ref={ref}
        transform={`translate(${
          barWidth && scaleX ? scaleX.bandwidth() / 2 - barWidth / 2 : 0
        }, ${-yShift - BLOCK_PADDING})`}
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

        {isTop ? (
          <path
            className={cn.top}
            d={`M0 0 L${width} 0  L${
              width + xStretch
            } ${-yStretch} L${xStretch} ${-yStretch} Z`}
            shapeRendering="crispEdges"
          />
        ) : (
          <path
            className={cn.padding}
            d={`M0 0 L${width} 0  L${
              width + xStretch
            } ${-yStretch} L${xStretch} ${-yStretch} Z`}
            shapeRendering="crispEdges"
          />
        )}
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

export const Block = ({
  className,
  size = 1,
  barWidth,
  scaleX,
  yShift = 0,
  onDrag,
  onFailedDrop,
  isTop,
  wrapSvg,
}) => {
  const [collected, drag] = useDrag(() => {
    return {
      collect: (monitor) => ({
        anythingIsDragging: monitor.getItem() !== null,
      }),
      type: blocksDndType,
      item: () => {
        const items = onDrag ? onDrag() : {};
        const blocks = [size];
        return { width: barWidth, blocks, ...items };
      },
      end: (item, monitor) => {
        const didDrop = monitor.didDrop();
        if (!didDrop && onFailedDrop) onFailedDrop(item);
      },
    };
  }, [onDrag, barWidth]);

  return (
    <StaticBlock
      ref={drag}
      wrapSvg={wrapSvg}
      className={className}
      barWidth={barWidth}
      scaleX={scaleX}
      size={size}
      yShift={yShift}
      isTop={isTop}
      disableHover={collected.anythingIsDragging}
    />
  );
};

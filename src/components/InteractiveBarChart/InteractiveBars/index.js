import React, { useEffect, useMemo } from "react";
import cn from "./index.module.css";
import { scaleBand } from "d3-scale";
import { useDrop } from "react-dnd";

import { updateExtent } from "../../../utils";
import { blockDndType } from "../config";
import { Block, Placeholder } from "../Block";

const padding = 1;

const Bar = ({
  x,
  scaleX,
  scaleY,
  barWidth,
  className,
  items,
  addItem,
  removeItem,
}) => {
  const [{ item, isOver }, drop] = useDrop(
    () => ({
      accept: blockDndType,
      drop: (item) => addItem(item.height, x),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        item: monitor.getItem(),
      }),
    }),
    [addItem]
  );

  const blocks = items.reduce(
    (prev, item, i) => {
      const isTop = i === items.length - 1;
      const yShift = prev.yShift + item;
      return {
        yShift,
        renderedBlocks: [
          ...prev.renderedBlocks,
          <Block
            isTop={!isOver && isTop}
            key={i}
            className={className}
            barWidth={barWidth}
            height={item}
            scaleX={scaleX}
            yShift={yShift}
            removeItem={() => removeItem(i, x)}
          />,
        ],
      };
    },
    { yShift: 0, renderedBlocks: [] }
  );

  return (
    <g transform={`translate(${scaleX(x)},0)`}>
      <rect
        ref={drop}
        height={scaleY.range()[1]}
        width={scaleX.paddingInner(0).bandwidth()}
        fill="rgba(0,0,0,0)"
      />
      <g key={x} transform={`translate(0,${scaleY(scaleY.domain()[1])})`}>
        {!isOver && blocks.renderedBlocks.length === 0 && (
          <Placeholder
            barWidth={barWidth}
            scaleX={scaleX}
            className={cn.placeholder}
            yShift={-4}
          />
        )}
        {blocks.renderedBlocks}
        {isOver && item && (
          <Block
            isTop={true}
            className={cn.ghostBar}
            barWidth={barWidth}
            height={item.height - padding * 2}
            scaleX={scaleX}
            yShift={blocks.yShift + item.height - padding}
          />
        )}
        <text
          textAnchor="middle"
          alignmentBaseline="central"
          x={scaleX.bandwidth() / 2}
          y={20}
          style={{ userSelect: "none" }}
        >
          {x}
        </text>
      </g>
    </g>
  );
};

export const InteractiveBars = ({ barWidth, items, setItems, ...props }) => {
  const { className, data, width, getX, getY, scaleY, setYExtent, showTicks } =
    props;

  useEffect(() => {
    setYExtent((yExtent) => updateExtent(yExtent, getY, data));
  }, [data, getY, setYExtent]);

  const scaleX = useMemo(
    () =>
      scaleBand().domain(data.map(getX)).range([0, width]).paddingInner(0.2),
    [data, getX, width]
  );

  const addItem = (item, key) =>
    setItems({ ...items, [key]: [...items[key], item] });

  const removeItem = (index, key) => {
    setItems({
      ...items,
      [key]: [...items[key].slice(0, index), ...items[key].slice(index + 1)],
    });
  };

  return (
    <g>
      {Object.keys(items).map((key) => (
        <Bar
          key={key}
          x={key}
          scaleX={scaleX}
          scaleY={scaleY}
          barWidth={barWidth}
          className={className}
          items={items[key]}
          addItem={addItem}
          removeItem={removeItem}
        />
      ))}
    </g>
  );
};

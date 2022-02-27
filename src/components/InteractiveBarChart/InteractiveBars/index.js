import React, { useEffect, useMemo } from "react";
import cn from "./index.module.css";
import { scaleBand } from "d3-scale";
import { useDrop } from "react-dnd";
import { useDrag } from "react-dnd";

import { cx, updateExtent } from "../../../utils";
import { dndType } from "../config";

const padding = 0.5;

const Block = ({ className, barWidth, scaleX, height, yShift, removeItem }) => {
  const [, drag] = useDrag(() => {
    return {
      type: dndType,
      item: () => {
        removeItem();
        return { height, width: barWidth };
      },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        console.log("dropped", dropResult);
      },
    };
  }, [removeItem]);
  return (
    <rect
      ref={drag}
      className={cx(cn.bar, className)}
      style={{ cursor: "grab" }}
      height={height - padding * 2}
      width={barWidth || scaleX.bandwidth()}
      x={barWidth ? scaleX.bandwidth() / 2 - barWidth / 2 : null}
      y={-yShift - padding}
    />
  );
};

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
      accept: dndType,
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
      const yShift = prev.yShift + item;
      return {
        yShift,
        renderedBlocks: [
          ...prev.renderedBlocks,
          <Block
            key={i}
            className={className}
            barWidth={barWidth}
            height={item}
            scaleX={scaleX}
            yShift={yShift}
            removeItem={() => {
              console.log("ren");
              removeItem(i, x);
            }}
          />,
        ],
      };
    },
    { yShift: 0, renderedBlocks: [] }
  );

  return (
    <g transform={`translate(${scaleX(x) + 10},0)`}>
      <rect
        ref={drop}
        height={scaleY.range()[1]}
        width={scaleX.paddingInner(0).bandwidth()}
        fill="rgba(0,0,0,0)"
      />
      <g key={x} transform={`translate(0,${scaleY(scaleY.domain()[1])})`}>
        {blocks.renderedBlocks}
        {isOver && item && (
          <rect
            className={cx(cn.bar, cn.ghostBar, className)}
            height={item.height - padding * 2}
            width={barWidth || scaleX.bandwidth()}
            x={barWidth ? scaleX.bandwidth() / 2 - barWidth / 2 : null}
            y={-blocks.yShift - padding - item.height}
          />
        )}
        <text
          textAnchor="middle"
          alignmentBaseline="central"
          x={scaleX.bandwidth() / 2}
          y={20}
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

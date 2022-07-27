import { useContext, useMemo } from "react";
import { useDrop } from "react-dnd";
import { BLOCK_PADDING } from "../../../constants";
import { Block, Placeholder } from "../Block";
import { blocksDndType } from "../config";
import { Context } from "../Context";
import cn from "./index.module.css";

/**
 * Renders an array of blocks.
 */
export const Bar = ({
  barWidth,
  className,
  blocks,
  onBlockDrag,
  onFailedDrop,
  showTop = true,
}) => {
  return blocks.reduce(
    (prev, block, i) => {
      const isTop = i === blocks.length - 1;
      const yShift = prev.yShift + block * barWidth;
      return {
        yShift,
        renderedBlocks: [
          ...prev.renderedBlocks,
          <Block
            isTop={isTop && showTop}
            key={i}
            className={className}
            barWidth={barWidth}
            size={block}
            yShift={yShift}
            onDrag={() => onBlockDrag(i)}
            onFailedDrop={onFailedDrop}
          />,
        ],
      };
    },
    { yShift: -BLOCK_PADDING, renderedBlocks: [] }
  ).renderedBlocks;
};

export const InteractiveBar = ({
  x,
  scaleX,
  scaleY,
  barWidth,
  blocks,
  addBlocks,
  removeBlocks,
  children,
}) => {
  const { availableBlocks, setAvailableBlocks } = useContext(Context);
  const [{ item: hoverItem, isOver }, drop] = useDrop(
    () => ({
      accept: blocksDndType,
      drop: (item) => addBlocks(item.blocks),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        item: monitor.getItem(),
      }),
    }),
    [addBlocks]
  );
  const hoverBlocks = hoverItem?.blocks;

  const topY = useMemo(
    () => blocks.reduce((a, b) => a + b, 0) * barWidth,
    [barWidth, blocks]
  );

  const onFailedDrop = (item) => {
    const droppedBlocks = item.blocks;
    droppedBlocks.forEach((d) => availableBlocks[Math.floor(d)]++);
    setAvailableBlocks([...availableBlocks]);
  };

  return (
    <g transform={`translate(${scaleX(x)},0)`}>
      <rect
        ref={drop}
        height={scaleY.range()[1]}
        width={scaleX.paddingInner(0).bandwidth()}
        fill="rgba(0,0,0,0)"
      />
      <g transform={`translate(0,${scaleY(scaleY.domain()[1])})`}>
        <g
          transform={`translate(${
            barWidth && scaleX ? scaleX.bandwidth() / 2 - barWidth / 2 : 0
          }, -10)`}
        >
          <g transform={`translate(0,${-2 * BLOCK_PADDING})`}>
            {!isOver && blocks.length === 0 && (
              <Placeholder barWidth={barWidth} />
            )}
          </g>
          <Bar
            barWidth={barWidth}
            blocks={blocks}
            onBlockDrag={removeBlocks}
            onFailedDrop={onFailedDrop}
            showTop={!isOver}
          />
          {isOver && (
            <g transform={`translate(0,${-topY})`}>
              <Bar
                barWidth={barWidth}
                blocks={hoverBlocks}
                onBlockDrag={(i) => removeBlocks(i)}
                className={cn.ghostBar}
              />
            </g>
          )}
        </g>
        <foreignObject
          x={0}
          y={0}
          width={scaleX.bandwidth()}
          height={200}
        >
          {children}
        </foreignObject>
      </g>
    </g>
  );
};

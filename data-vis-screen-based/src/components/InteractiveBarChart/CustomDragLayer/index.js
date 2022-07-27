import { useDragLayer } from "react-dnd";
import { blocksDndType, datasetDndType } from "../config";
import { StaticBlock } from "../Block";
import cn from "./index.module.css";
import { StaticDatasetBlock } from "../DatasetBlock";
import { Bar } from "../Bar";

const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 1000,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getItemStyles(initialOffset, currentOffset, itemType, item) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }
  let { x, y } = currentOffset;

  if (itemType === blocksDndType && item.blocks.length > 1) {
    y = y - item.blocks.slice(1).reduce((a, b) => a + b, 0) * item.width;
  }

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export const CustomDragLayer = (props) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  function renderItem() {
    switch (itemType) {
      case blocksDndType:
        const { width, blocks } = item;
        const height = blocks.reduce((a, b) => a + b, 0) * width + 25;
        return (
          <div className={cn.container}>
            <svg height={height} width={width + 25}>
              <g transform={`translate(0,${height})`}>
                <Bar blocks={blocks} barWidth={width} />
              </g>
            </svg>
          </div>
        );
      case datasetDndType:
        return (
          <StaticDatasetBlock
            className={cn.container}
            isTop={true}
            barWidth={item.width}
            height={item.height}
            yShift={-25}
            wrapSvg={true}
            dataset={item}
          />
        );
      default:
        return null;
    }
  }
  if (!isDragging) {
    document.body.style.cursor = "auto";
    return null;
  }

  document.body.style.cursor = "grabbing";

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset, itemType, item)}>
        {renderItem()}
      </div>
    </div>
  );
};

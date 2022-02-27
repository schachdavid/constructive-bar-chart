import { useDragLayer } from "react-dnd";
import { dndType } from "../config";
const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 1000,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};
function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }
  let { x, y } = currentOffset;

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
      case dndType:
        return (
          <div
            style={{
              height: item.height,
              width: item.width,
              backgroundColor: "black",
              boxShadow: "5px 5px 15px 5px rgba(0,0,0,0.25)",
            }}
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
      <div
        style={getItemStyles(initialOffset, currentOffset, props.snapToGrid)}
      >
        {renderItem()}
      </div>
    </div>
  );
};

import React, { useContext, useEffect, useMemo } from "react";
import cn from "./index.module.css";
import { scaleBand } from "d3-scale";

import { cx, updateExtent } from "../../../utils";
import { EMPTY_DATASET } from "../../../constants";

import { Context } from "../Context";
import { InteractiveBar } from "../Bar";
import { ReactComponent as CheckMarkIcon } from "../../../static-assets/icons/circle-check-mark.svg";
import { ReactComponent as ChevronUp } from "../../../static-assets/icons/chevron-up.svg";
import { ReactComponent as ChevronDown } from "../../../static-assets/icons/chevron-down.svg";

const getLabelFontsize = (bandwidth, length) => {
  if (length > 20) return (bandwidth / length) * 3.5;
  if (length > 35) return (bandwidth / length) * 4.5;
  return (bandwidth / length) * 2;
};

const Label = ({ label, fontSize, correctionFeedback }) => {
  // normal label
  if (correctionFeedback == null)
    return (
      <div
        className={cn.label}
        style={{
          fontSize,
        }}
      >
        {label}
      </div>
    );

  // label with feedback
  let feedbackContent = null;
  const numBlocks = Math.abs(correctionFeedback);
  if (numBlocks === 0) {
    feedbackContent = <CheckMarkIcon />;
  } else {
    const blocks = Array(numBlocks <= 3 ? numBlocks : 2)
      .fill(0)
      .map((d, i) => <div key={i} className={cn.feedbackBlock} />);

    if (correctionFeedback < 0) {
      feedbackContent = (
        <div className={cn.feedbackBlocks}>
          <ChevronUp />
          {blocks}
          {numBlocks > 3 && (
            <div className={cx(cn.openBlock, cn.openBlockBottom)}>
              {numBlocks}
            </div>
          )}
        </div>
      );
    } else if (correctionFeedback > 0) {
      feedbackContent = (
        <div className={cn.feedbackBlocks}>
          {numBlocks > 3 && (
            <div className={cx(cn.openBlock, cn.openBlockTop)}>
              <div className={cn.openBlockTopNumber}>{numBlocks}</div>
            </div>
          )}
          {blocks}
          <ChevronDown />
        </div>
      );
    }
  }

  return (
    <div className={cn.feedbackContainer}>
      <div className={cn.feedbackSide}>{feedbackContent}</div>
      <div
        className={cn.feedbackLabel}
        style={{
          fontSize,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const InteractiveBars = ({
  barWidth,
  ...props
}) => {
  const {
    fields,
    setFields,
    solution,
    dataset: rawDataset,
  } = useContext(Context);
  const { className, data, width, getX, getY, scaleY, setYExtent } = props;
  const dataset = rawDataset || EMPTY_DATASET;

  useEffect(() => {
    if (data) setYExtent((yExtent) => updateExtent(yExtent, getY, data));
  }, [data, getY, setYExtent]);

  const scaleX = useMemo(() => {
    return scaleBand()
      .domain(dataset?.data?.map(getX) || [])
      .range([0, width])
      .paddingInner(0.2);
  }, [dataset?.data, getX, width]);

  const addBlocks = (iField, blocks) => {
    fields[iField] = fields[iField].concat(blocks);
    setFields([...fields]);
  };

  const correctionFeedback = useMemo(() => {
    if (!solution) return Array(5);
    const current = fields.map((d) => d.reduce((a, b) => a + b, 0) * 2);
    return current.map((d, i) => d - solution[i]);
  }, [fields, solution]);

  const removeBlocks = (iField, iBlock) => {
    const removedBlocks = fields[iField].slice(iBlock, fields[iField].length);
    fields[iField] = fields[iField].slice(0, iBlock);
    setFields([...fields]);
    return { blocks: removedBlocks };
  };

  const labelFontsize = useMemo(() => {
    const maxLabelLength = Math.max(...dataset.data.map((d) => d.label.length));
    return getLabelFontsize(scaleX.bandwidth(), maxLabelLength);
  }, [dataset.data, scaleX]);

  return (
    <g>
      {dataset.data.map((d, i) => (
        <InteractiveBar
          key={i}
          x={d.label}
          scaleX={scaleX}
          scaleY={scaleY}
          barWidth={barWidth}
          className={className}
          blocks={fields[i]}
          addBlocks={(blocks) => addBlocks(i, blocks)}
          removeBlocks={(iBlock) => removeBlocks(i, iBlock)}
        >
          {rawDataset != null && (
            <Label
              key={i}
              label={d.label}
              correctionFeedback={correctionFeedback[i]}
              fontSize={labelFontsize}
            />
          )}
        </InteractiveBar>
      ))}
    </g>
  );
};

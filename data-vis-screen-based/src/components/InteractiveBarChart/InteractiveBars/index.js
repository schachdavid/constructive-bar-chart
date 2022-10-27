import React, { useContext, useEffect, useMemo } from "react";
import cn from "./index.module.css";
import { scaleBand } from "d3-scale";

import {
  cx,
  fieldsToBlockSums,
  formatNumberWithSuffix,
  updateExtent,
} from "../../../utils";
import { EMPTY_DATASET, FONT_ASPECT_RATIO } from "../../../constants";

import { Context } from "../Context";
import { InteractiveBar } from "../Bar";
import { ReactComponent as CheckMarkIcon } from "../../../static-assets/icons/circle-check-mark.svg";
import { ReactComponent as ChevronUp } from "../../../static-assets/icons/chevron-up.svg";
import { ReactComponent as ChevronDown } from "../../../static-assets/icons/chevron-down.svg";

function getMaxFontSizeForWidth(bandwidth, length) {
  const fontSize = Math.round((bandwidth / length) * FONT_ASPECT_RATIO);
  return Math.min(fontSize, 15);
}

const Label = ({
  label,
  fontSize,
  correctionFeedback,
  allCorrect,
  absoluteValue,
  unit,
  labelValueFontSize,
}) => {
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

  // label with absolute values
  if (allCorrect)
    return (
      <div className={cn.label}>
        <div
          style={{
            fontSize,
          }}
        >
          {label}
        </div>

        <div
          className={cn.labelValue}
          style={{
            fontSize: labelValueFontSize,
          }}
        >
          {formatNumberWithSuffix(absoluteValue, true) + " " + unit}
        </div>
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
  width,
  getX,
  scaleY,
}) => {
  const {
    fields,
    setFields,
    solution,
    dataset: rawDataset,
  } = useContext(Context);
  const dataset = rawDataset || EMPTY_DATASET;

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
    return fieldsToBlockSums(fields).map((d, i) => d - solution[i]);
  }, [fields, solution]);

  const removeBlocks = (iField, iBlock) => {
    const removedBlocks = fields[iField].slice(iBlock, fields[iField].length);
    fields[iField] = fields[iField].slice(0, iBlock);
    setFields([...fields]);
    return { blocks: removedBlocks };
  };

  const labelFontsize = useMemo(() => {
    if (!rawDataset) return;
    const maxLabelLength = Math.max(...dataset.data.map((d) => d.label.length));
    return getMaxFontSizeForWidth(
      scaleX.bandwidth(),
      Math.min(22, maxLabelLength)
    );
  }, [dataset.data, rawDataset, scaleX]);

  const labelValueFontSize = useMemo(() => {
    if (!rawDataset) return;
    const maxValue =
      formatNumberWithSuffix(
        Math.max(...dataset.data.map((d) => d.value)),
        true
      ) +
      " " +
      dataset.unit;
    const maxValueLength = maxValue.length + 1;
    return getMaxFontSizeForWidth(scaleX.bandwidth(), maxValueLength);
  }, [dataset.data, dataset.unit, rawDataset, scaleX]);

  console.log({ dataset });

  return (
    <g>
      {dataset.data.map((d, i) => (
        <InteractiveBar
          key={i}
          x={d.label}
          scaleX={scaleX}
          scaleY={scaleY}
          barWidth={barWidth}
          blocks={fields[i]}
          addBlocks={(blocks) => addBlocks(i, blocks)}
          removeBlocks={(iBlock) => removeBlocks(i, iBlock)}
        >
          {rawDataset != null && (
            <Label
              allCorrect={correctionFeedback.every((d) => d === 0)}
              key={i}
              label={d.label}
              unit={dataset.unit}
              absoluteValue={d.value}
              correctionFeedback={correctionFeedback[i]}
              fontSize={labelFontsize}
              labelValueFontSize={labelValueFontSize}
            />
          )}
        </InteractiveBar>
      ))}
    </g>
  );
};

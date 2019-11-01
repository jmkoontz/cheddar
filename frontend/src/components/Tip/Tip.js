import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

import './Tip.css';

const Tip = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <Tooltip
      className="tip"
      placement={props.placement ? props.placement : "bottom"}
      isOpen={tooltipOpen}
      target={props.target}
      toggle={toggle}
      delay={{show: props.delay ? props.delay : 500}}
    >
      {props.text}
    </Tooltip>
  );
};

export default Tip;
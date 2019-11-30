import React, { useState, useEffect } from "react";
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import ToggleButton from 'react-toggle-button'

function ToggleButtons(props) {

  const [uid, setUid] = useState(sessionStorage.getItem('user'));
  const [toggleState, setToggleState] = useState([]);

  // server call to check if the tooltip is enabled tor disabled
  const getToolTips = () => {
    axios.get(`http://localhost:8080/Cheddar/ToolTips/${uid}`)
      .then((response) => {

        let tmp = response.data;
        delete tmp._id;
        setToggleState(tmp);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // server call to change the state of the tooltip
  const changeToolTip = (value, page) => {

    if (value) {  // Need to disable the tool tip
      disableTips(page);
    } else {  // Need to enable the tool tip
      enableTips(page);
    }

  }

  // server call to disable tool tips
  const disableTips = (page) => {
    axios.put(`http://localhost:8080/Cheddar/DisableToolTips/${uid}/${page}`)
      .then((response) => {
        //console.log(response.data.toolTips)
        let tmp = response.data.toolTips;
        delete tmp._id;
        setToggleState(tmp);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // server call to disable tool tips, TODO remove this
  const enableTips = (page) => {
    axios.put(`http://localhost:8080/Cheddar/EnableToolTips/${uid}/${page}`)
      .then((response) => {
        //console.log(response.data.toolTips)
        let tmp = response.data.toolTips;
        delete tmp._id;
        setToggleState(tmp);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(
    () => {
      getToolTips();
    },
    [props.uid]
  );

  return (
    <div>
      {Object.entries(toggleState).map(([key, value]) =>
        <Row key={key}>
          <Col>
            <p>{key.charAt(0).toUpperCase() + key.substring(1)} Tool Tips</p>
          </Col>
          <Col>
            <ToggleButton
              value={value}
              onToggle={(val) => changeToolTip(val, key)} />
          </Col>
        </Row>
      )
      }
    </div >

  );
};

export default ToggleButtons;
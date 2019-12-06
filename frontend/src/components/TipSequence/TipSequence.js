import {Button, ButtonGroup, Col, Popover, PopoverBody, PopoverHeader, Row, Tooltip} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import axios from "axios";
import buildUrl from "../../actions/connect";

class TipSequence extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      step: 0,
      isClosing: false,
      isReady: false
    };
  }

  componentDidMount = () => {
    this.getTipState();
  };

  getTipState = () => {
    axios.get(buildUrl(`/Cheddar/ToolTips/${sessionStorage.getItem('user')}`))
      .then((response) => {
        if (response.data[this.props.page]) {
          this.setState({
            step: 0,
            isReady: true
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          step: -1,
          isReady: true
        });
      });
  };

  exitTips = () => {
    axios.put(buildUrl(`/Cheddar/DisableToolTips/${sessionStorage.getItem('user')}/${this.props.page}`))
      .then((response) => {
        this.setState({
          step: -1
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          step: -1
        });
      });
  };

  next = () => {
    if (this.state.step + 1 >= this.props.tips.length)
      return;

    this.setState({
      step: this.state.step + 1
    });
  };

  previous = () => {
    if (this.state.step === 0)
      return;

    this.setState({
      step: this.state.step - 1
    });
  };

  toggleClosePrompt = () => {
    this.setState({
      isClosing: !this.state.isClosing
    });
  };

  render () {
    const tip = this.props.tips[this.state.step];

    if (!tip || !this.state.isReady)
      return null;

    return (
      <Popover modifiers={{flip: { behavior: ['auto']}}} placement={tip.placement ? tip.placement : "bottom"} isOpen={true} target={tip.target} boundariesElement="window">
        <PopoverHeader>{tip.title ? tip.title : "Tool Tip " + (this.state.step + 1) + "/" + this.props.tips.length + ":"}</PopoverHeader>
        <PopoverBody>
          {this.state.isClosing ?
            <div>
              <p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings. Are you sure you want to continue?</p>
              <Row>
                <Col>
                  <Button onClick={() => this.toggleClosePrompt()} color="primary">Go Back</Button>
                </Col>
                <Col>
                  <Button onClick={() => this.exitTips()} color="danger">Finish</Button>
                </Col>
              </Row>
            </div>
            :
            <div>
              <p>{tip.text}</p>
              <Row>
                <Col sm={6}>
                  <ButtonGroup>
                    <Button disabled={this.state.step === 0} onClick={() => this.previous()}>
                      <FontAwesomeIcon icon={faAngleLeft} />
                    </Button>
                    <Button disabled={this.state.step + 1 >= this.props.tips.length} onClick={() => this.next()}>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </Button>
                  </ButtonGroup>
                </Col>
                <Col sm={6}>
                  <Button onClick={() => this.toggleClosePrompt()}>Close</Button>
                </Col>
              </Row>
            </div>
          }

        </PopoverBody>
      </Popover>
    );
  }
}

export default TipSequence;
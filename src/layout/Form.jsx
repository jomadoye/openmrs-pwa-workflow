import React from 'react';
import PropTypes from 'prop-types';
import {Col} from "react-bootstrap";
import {centerTextAlign} from "../pwaStyles";
import utils from "../utils";

const Form = props => {

  return (
    <Col className="form-layout">
      {React.cloneElement(props.form, { backLink: props.backLink })}
    </Col>
  );

};

Form.propTypes = {
  backLink: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired
};


export default Form;

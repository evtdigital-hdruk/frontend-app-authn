import React, { useState } from 'react';

import {
  Form, Hyperlink, TransitionReplace,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import AlertDismissible from './AlertDismissible';

const FormGroup = (props) => {
  const [hasFocus, setHasFocus] = useState(false);

  const handleFocus = (e) => {
    setHasFocus(true);
    if (props.handleFocus) { props.handleFocus(e); }
  };
  const handleOnBlur = (e) => {
    setHasFocus(false);
    if (props.handleBlur) { props.handleBlur(e); }
  };

  return (
    <Form.Group controlId={props.name} className="mb-4" isInvalid={props.errorMessage !== ''}>
      <Form.Control
        as={props.as}
        type={props.type}

        name={props.name}
        value={props.value}
        onFocus={handleFocus}
        onBlur={handleOnBlur}
        onChange={props.handleChange}
        controlClassName={props.borderClass}

        trailingElement={props.trailingElement}
        floatingLabel={props.floatingLabel}
      >
        {props.options ? props.options() : null}
      </Form.Control>
      <TransitionReplace>
        {hasFocus && props.helpText ? (
          <Form.Control.Feedback key="help-text" className="d-block">
            {props.helpText.map((message, index) => (
              <span key={`help-text-${index.toString()}`}>
                {message}
                <br />
              </span>
            ))}
          </Form.Control.Feedback>
        ) : <div key="empty" />}
      </TransitionReplace>
      {props.errorMessage !== '' && (
        <Form.Control.Feedback key="error" feedback-for={props.name} type="invalid">{props.errorMessage}</Form.Control.Feedback>
      )}

      {props.suggestedTopLevelDomain ? <AlertDismissible msg={props.suggestedTopLevelDomain} variant="danger" /> : null}

      {props.suggestedServiceLevelDomain ? <span className="one-rem-font">{props.suggestedServiceLevelDomain.split(':')[0]}: <Hyperlink destination="#"><u>{props.suggestedServiceLevelDomain.split(':')[1]}</u></Hyperlink></span> : null}
      {props.children}
    </Form.Group>
  );
};

FormGroup.defaultProps = {
  as: 'input',
  errorMessage: '',
  borderClass: '',
  suggestedTopLevelDomain: '',
  suggestedServiceLevelDomain: '',
  handleBlur: null,
  handleChange: () => {},
  handleFocus: null,
  helpText: [],
  options: null,
  trailingElement: null,
  type: 'text',
  children: null,
};

FormGroup.propTypes = {
  as: PropTypes.string,
  errorMessage: PropTypes.string,
  borderClass: PropTypes.string,
  suggestedTopLevelDomain: PropTypes.string,
  suggestedServiceLevelDomain: PropTypes.string,
  floatingLabel: PropTypes.string.isRequired,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleFocus: PropTypes.func,
  helpText: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  options: PropTypes.func,
  trailingElement: PropTypes.element,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  children: PropTypes.element,
};

export default FormGroup;
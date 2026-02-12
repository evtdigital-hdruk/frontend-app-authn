import React from 'react';

import { Form, Icon } from '@openedx/paragon';
import { ExpandMore } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

const FormFieldRenderer = (props) => {
  let formField = null;
  const {
    className, errorMessage, fieldData, onChangeHandler, isRequired, value,
  } = props;

  const handleFocus = (e) => {
    if (props.handleFocus) { props.handleFocus(e); }
  };

  const handleOnBlur = (e) => {
    if (props.handleBlur) { props.handleBlur(e); }
  };

  switch (fieldData.type) {
    case 'select': {
      if (!fieldData.options) {
        return null;
      }
      formField = (
        <Form.Group controlId={fieldData.name} isInvalid={!!(isRequired && errorMessage)}>
          <Form.Control
            className={className}
            as="select"
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            trailingElement={<Icon src={ExpandMore} />}
            floatingLabel={fieldData.label}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          >
            <option key="default" value="">-</option>
            {fieldData.options.map(option => (
              <option className="data-hj-suppress" key={option[0]} value={option[0]}>{option[1]}</option>
            ))}
          </Form.Control>
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'textarea': {
      formField = (
        <Form.Group controlId={fieldData.name} isInvalid={!!(isRequired && errorMessage)}>
          <Form.Control
            className={className}
            as="textarea"
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            floatingLabel={fieldData.label}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          />
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'text': {
      formField = (
        <Form.Group controlId={fieldData.name} isInvalid={!!(isRequired && errorMessage)}>
          <Form.Control
            className={className}
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            floatingLabel={fieldData.label}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          />
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'checkbox': {
      formField = (
        <Form.Group isInvalid={!!(isRequired && errorMessage)}>
          <Form.Checkbox
            className={className}
            id={fieldData.name}
            checked={!!value}
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          >
            {fieldData.label}
          </Form.Checkbox>
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'multiplechoice': {
      const selectedValues = Array.isArray(value) ? value : [];
      const handleMultiChange = (e) => {
        const updated = e.target.checked
          ? [...selectedValues, e.target.value]
          : selectedValues.filter(v => v !== e.target.value);
        onChangeHandler({ target: { name: fieldData.name, value: updated } });
      };
      const renderFooter = () => {
        if (!fieldData.footer) { return null; }
        const links = fieldData.footer_links || {};
        const parts = fieldData.footer.split(/\{(\w+)\}/g);
        return (
          <p className="mt-2 x-small">
            {parts.map((part, i) => {
              if (i % 2 === 1 && links[part]) {
                return <a key={part} href={links[part].url} target="_blank" rel="noopener noreferrer">{links[part].text}</a>;
              }
              return part;
            })}
          </p>
        );
      };
      formField = (
        <Form.Group isInvalid={!!(isRequired && errorMessage)}>
          {fieldData.label && (
            <Form.Label className="h4 text-primary">{fieldData.label}</Form.Label>
          )}
          {fieldData.description && (
            <p className="mb-2">{fieldData.description}</p>
          )}
          <Form.CheckboxSet
            name={fieldData.name}
            onChange={handleMultiChange}
            value={selectedValues}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          >
            {fieldData.options.map(option => (
              <Form.Checkbox
                key={option[0]}
                className={className}
                id={option[0]}
                value={option[0]}
              >
                {option[1]}
              </Form.Checkbox>
            ))}
          </Form.CheckboxSet>
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
          {renderFooter()}
        </Form.Group>
      );
      break;
    }
    default:
      break;
  }

  return formField;
};
FormFieldRenderer.defaultProps = {
  className: '',
  value: '',
  handleBlur: null,
  handleFocus: null,
  errorMessage: '',
  isRequired: false,
};

FormFieldRenderer.propTypes = {
  className: PropTypes.string,
  fieldData: PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    footer: PropTypes.string,
    footer_links: PropTypes.objectOf(PropTypes.shape({
      url: PropTypes.string,
      text: PropTypes.string,
    })),
    options: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  }).isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  handleBlur: PropTypes.func,
  handleFocus: PropTypes.func,
  errorMessage: PropTypes.string,
  isRequired: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default FormFieldRenderer;

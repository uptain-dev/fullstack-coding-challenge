import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import _ from "lodash";
class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const toValidate = _.pick(this.state.data, this.properties);
    const { error } = Joi.validate(toValidate, this.schema, options);
    if (!error) {
      return null;
    }
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return !error ? null : error.details[0].message;
  };

  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) {
      errors[input.name] = errorMessage;
    } else {
      delete errors[input.name];
    }
    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderInput = (name, label, type) => {
    const { data, errors } = this.state;
    return (
      <Input
        name={name}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        value={data[name]}
        type={type}
      />
    );
  };

  renderButton = label => {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  };
}

export default Form;

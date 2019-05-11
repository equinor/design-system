import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const getBackground = ({ variant }) => {
  if (variant === "secondary") {
    return "green;";
  }
  return "red";
};

const Button = styled.button`
  background: ${getBackground};
  color: white;
`;

Button.propTypes = {
  /** Specifies which variant to use */
  variant: PropTypes.oneOf(["primary", "secondary"])
};

Button.defaultProps = {
  variant: "primary"
};

Button.displayName = "eds-button";

export default Button;

import React from "react";

const Link = (props) => {
  return (
    <a href={props.link} style={{ margin: "10px" }}>
      {props.value}
    </a>
  );
};

export default Link;

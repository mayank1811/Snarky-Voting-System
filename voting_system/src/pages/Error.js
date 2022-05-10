import React from "react";
import Styles from "../Stylesheets/Error.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Link } from "react-router-dom";

const Error = (props) => {
  console.log(props.msg);
  return (
    <div>
      <img
        src='https://indianmemetemplates.com/wp-content/uploads/Bhai-kya-kar-raha-hai-tu.jpg'
        alt='Error'
        className={Styles.errorImg}
      ></img>
      <h3 className={Styles.error}>{props.msg}</h3>
      <Link
        to='/'
        className={`btn btn-outline-secondary ${Styles.footerButton} ${Styles.verifyBTN}`}
      >
        Home
      </Link>
    </div>
  );
};

export default Error;

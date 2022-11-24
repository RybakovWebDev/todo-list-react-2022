import React from "react";
import { animated } from "react-spring";

const RenderModal = ({ open, onClickHandler, getImportData, fadeModalSpringConfig, fadeOverlayConfig }) => {
  if (!open) return null;
  return (
    <animated.div style={fadeOverlayConfig} className='overlay' onClick={onClickHandler}>
      <animated.div style={fadeModalSpringConfig} onClick={getImportData} className='modal-container'>
        <p onClick={onClickHandler} className='modal--close'>
          X
        </p>
        <div className='modal-content'>
          Click inside this modal to paste your list.
          <br></br>
          <br></br>
          You can import a list of tasks separated by " - ", " , " or " _ ".
          <br></br>
          List can be on one line or multiple.
          <br></br> <br></br>
          Click outside the modal to close it.
        </div>
      </animated.div>
    </animated.div>
  );
};

export default RenderModal;

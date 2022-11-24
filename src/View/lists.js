import React from "react";
import { useTransition, animated } from "react-spring";

const RenderLists = ({
  open,
  listsHandler,
  listsArray,
  blinkRedSpringConfig,
  clickSpringConfig,
  fadeModalSpringConfig,
  fadeOverlayConfig,
  targetID,
  deleteID,
}) => {
  // console.log("lists array is:", listsArray);
  const transitions = useTransition(listsArray, {
    from: { opacity: 0, maxHeight: "0px" },
    enter: { opacity: 1, maxHeight: "150px" },
    leave: { opacity: 0, maxHeight: "0px" },
    trail: 100,
  });
  if (!open) return null;

  return (
    <animated.div className='lists__overlay' style={fadeOverlayConfig} onClick={listsHandler}>
      <div className='lists-container-parent'>
        <animated.div className='lists-container' style={fadeModalSpringConfig}>
          <div className='lists-element-container'>
            {transitions((style, el) => (
              <animated.div style={style}>
                <div
                  className={targetID === el.listID ? "lists-element lists-element--shadow" : "lists-element"}
                  key={el.listID}
                >
                  <input
                    className='lists-name'
                    value={el.listName}
                    onChange={listsHandler}
                    inputid={el.listID}
                    maxLength='45'
                  ></input>
                  <div className='lists-btn-container'>
                    <animated.button
                      style={targetID === el.listID ? clickSpringConfig : {}}
                      className='btn-lists-select'
                      type='button'
                      inputid={el.listID}
                    >
                      <i className='fa-solid fa-check' inputid={el.listID}></i>
                    </animated.button>

                    <animated.button
                      style={deleteID === el.listID ? blinkRedSpringConfig : {}}
                      className='btn-lists-delete'
                      type='button'
                      inputid={el.listID}
                    >
                      <i className='fa-solid fa-trash' inputid={el.listID}></i>
                    </animated.button>
                  </div>
                </div>
              </animated.div>
            ))}
          </div>
          <div className='btn-list-new'>
            <i className='fa-solid fa-square-plus fa-3x'></i>
          </div>
        </animated.div>
      </div>
    </animated.div>
  );
};

export default RenderLists;

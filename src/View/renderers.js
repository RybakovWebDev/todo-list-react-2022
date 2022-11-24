import { animated } from "react-spring";

export const RenderFinalView = function (props) {
  const renderBtnClear = function () {
    return (
      <button className='btn-bottom-menu gradient-background' onClick={props.handleBtnClear}>
        Clear done tasks
      </button>
    );
  };

  const renderBtnClearAll = function () {
    return (
      <button className='btn-bottom-menu gradient-background' onClick={props.handleBtnClearAll}>
        Clear ALL tasks
      </button>
    );
  };

  const renderBtnImport = function () {
    return (
      <button className='btn-bottom-menu gradient-background' onClick={props.modalHandler}>
        Import
        <br />
        tasks
      </button>
    );
  };

  const renderBtnListChange = function () {
    return (
      <button className='btn-bottom-menu gradient-background' onClick={props.handleBtnListChange}>
        <i className='fa-solid fa-list fa-3x'></i>
      </button>
    );
  };

  const renderBtnCol = function () {
    return (
      <div className='task-list-button-column-container'>
        {props.transitionsTaskList((style, item) => (
          <animated.div style={style}>
            <div className='task-list__button' key={item.id} inputid={item.id} onClick={props.handleBtnDoneCheck}>
              <i className={`fa-solid fa-square${item.done === 1 ? "-check" : ""} fa-3x`}></i>
            </div>
          </animated.div>
        ))}
        <animated.div className='task-list__button' style={props.fadeSpring} onClick={props.handleBtnNew}>
          <i className='fa-solid fa-square-plus fa-3x'></i>
        </animated.div>
      </div>
    );
  };

  const renderListCol = function () {
    return (
      <div className='task-list-column-cont '>
        {props.transitionsTaskList((style, item) => (
          <animated.div style={style}>
            <div className='task-list-text-area-cont' key={item.id}>
              <textarea
                inputid={item.id}
                className='task-list-text-area'
                placeholder='This is an example task. Tap to edit.'
                onBlur={props.handleInput}
                defaultValue={item.text === "This is an example task. Tap to edit." ? "" : item.text}
              ></textarea>
            </div>
          </animated.div>
        ))}
      </div>
    );
  };

  ////////// FINAL OUTPUT //////////

  return (
    <div className='app-window-parent gradient-background'>
      <div className='top-row gradient-background-bottom'>{props.curListNameState}</div>
      <div className='app-window'>
        {renderBtnCol()}
        {renderListCol()}
      </div>

      <div className='bottom-row gradient-background-bottom'>
        {props.TASKS_ARR.length === 0 ? (
          ""
        ) : (
          <animated.div style={props.fadeSpringClearAll} className='btn-bottom-cont fade-in'>
            {renderBtnClearAll()}
          </animated.div>
        )}
        {props.TASKS_ARR.length === 0 ? (
          ""
        ) : (
          <animated.div style={props.fadeSpringClear} className='btn-bottom-cont fade-in'>
            {renderBtnClear()}
          </animated.div>
        )}

        <animated.div style={props.fadeSpringImport} className='btn-bottom-cont'>
          {renderBtnImport()}
        </animated.div>
        <animated.div style={props.fadeSpringLists} className='btn-bottom-cont fade-in'>
          {renderBtnListChange()}
        </animated.div>
      </div>
    </div>
  );
};

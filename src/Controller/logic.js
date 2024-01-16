import { useState } from "react";
import { useTransition, useSpring } from "react-spring";
import { TASKS_ARR, noteModel } from "../Model/config";
import {
  bottomRowSpringConfig,
  btnClickSpringConfig,
  fadeInConfig,
  fadeOutConfig,
  redWarningConfig,
  redWarningReverseConfig,
  btnBlinkDeniedConfig,
} from "../Model/reactSpringConfigs";
import { RenderFinalView } from "../View/renderers";
import { v4 as uuidv4 } from "uuid";
import Modal from "../View/modal";
import Lists from "../View/lists";

// test list: one, TWO, Three, fOur, twenty five,and this

let storedActiveListVar = JSON.parse(localStorage.getItem("storedActiveList"));
// console.log("First log, stored active list on load:", storedActiveListVar);
let LISTS_ARR;
let activeList = storedActiveListVar ? storedActiveListVar : "";

const setLocalStorage = function (item, whichToUpdate) {
  if (whichToUpdate === "list") localStorage.setItem(whichToUpdate, JSON.stringify(item));
  if (whichToUpdate === "listsStorage") localStorage.setItem(whichToUpdate, JSON.stringify(item));
  if (whichToUpdate === "storedActiveList") localStorage.setItem(whichToUpdate, JSON.stringify(item));
};

const addTask = function (task, done) {
  TASKS_ARR.push(new noteModel(task ? task : "This is an example task. Tap to edit.", done ? done : 0));
};

const addToListsArr = function (name, arr) {
  const obj = {
    listName: name,
    listArr: arr,
    listID: uuidv4(),
  };
  LISTS_ARR.push(obj);

  setLocalStorage(LISTS_ARR, "listsStorage");
};

const deleteFromListsArr = function (i) {
  LISTS_ARR.splice(i, 1);
  setLocalStorage(LISTS_ARR, "listsStorage");
};

const updateListsArr = function () {
  // This works by using LIST from local storage, no need to pass any array into the function
  const targetListIndex = LISTS_ARR.findIndex((el) => el.listID === activeList);
  const copyArr = [...LISTS_ARR];

  copyArr[targetListIndex].listArr.length = 0;
  const curListArr = JSON.parse(localStorage.getItem("list"));
  curListArr.forEach((el) => {
    copyArr[targetListIndex].listArr.push(el);
  });

  setLocalStorage(copyArr, "listsStorage");
};

///////////////////////////////////
////////// Initial setup //////////
///////////////////////////////////

if (!JSON.parse(localStorage.getItem("listsStorage"))) {
  LISTS_ARR = [
    {
      listName: "List 1",
      listArr: [
        {
          text: "This is an example task. Tap to edit.",
          done: 0,
          date: 1668015320768,
          id: uuidv4(),
        },
      ],
      listID: uuidv4(),
    },
  ];
  setLocalStorage(LISTS_ARR, "listsStorage");
  window.location.reload();
} else {
  LISTS_ARR = JSON.parse(localStorage.getItem("listsStorage"));
}

if (activeList === "") {
  // console.log("Active list empty so changing it to first lists arr element id");
  // console.log("Lists arr in the meantime is:", LISTS_ARR);
  setLocalStorage(LISTS_ARR[0].listID, "storedActiveList");
}

if (TASKS_ARR.length === 0 && !storedActiveListVar) {
  // addTask("This is an example task. Tap to edit.");
  LISTS_ARR[0].listArr.forEach((el) => {
    TASKS_ARR.push(el);
  });
} else {
  const selectedList = LISTS_ARR.find((el) => el.listID === activeList);

  selectedList.listArr.forEach((el) => {
    TASKS_ARR.push(el);
  });
}

////////// Main render component //////////

const RenderWindowComponent = function (props) {
  // const [task, setTask] = useState("This is an example task. Tap to edit.");
  const [arrState, setArrState] = useState(TASKS_ARR);
  const [clearBtnsVisibleState, setClearBtnsVisibleState] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [listsOpen, setListsOpen] = useState(false);
  const [listsState, setListsState] = useState(LISTS_ARR);
  const [curListNameState, setCurListNameState] = useState(LISTS_ARR.find((el) => el.listID === activeList).listName);
  const [btnTargetState, setBtnTargetState] = useState();
  const [deleteTargetState, setDeleteTargetState] = useState();
  const [deleteState, setDeleteState] = useState(0);

  ////////// React spring animation hooks //////////
  const [fadeSpring, apiFade] = useSpring(() => ({ to: { opacity: 1, x: 0 }, from: { opacity: 0, x: 40 } }));
  const [fadeSpringClearAll, apiClearAll] = useSpring(() => bottomRowSpringConfig);
  const [fadeSpringClear, apiClear] = useSpring(() => bottomRowSpringConfig);
  const [fadeSpringImport, apiImport] = useSpring(() => bottomRowSpringConfig);
  const [fadeSpringModal, apiModal] = useSpring(() => bottomRowSpringConfig);
  const [fadeOverlay, apiOverlay] = useSpring(() => fadeInConfig);
  const [fadeSpringLists, apiLists] = useSpring(() => bottomRowSpringConfig);
  const [selectSpring, apiSelect] = useSpring(() => btnBlinkDeniedConfig);
  const [blinkRedSpring, apiBlink] = useSpring(() => redWarningConfig);

  ////////// React spring transition hook //////////
  const transitionsTaskList = useTransition(arrState, {
    from: { opacity: 0, maxHeight: "0px" },
    enter: { opacity: 1, maxHeight: "150px" },
    leave: { opacity: 0, maxHeight: "0px" },
    trail: 100,
  });

  ////////// Left column button handlers //////////
  const handleBtnNew = function (e) {
    const filterMarked = TASKS_ARR.filter((e) => e.done === 1);
    const filterUnMarked = TASKS_ARR.filter((e) => e.done === 0);

    if (TASKS_ARR[TASKS_ARR.length - 1]?.done === 0) {
      addTask();
      setArrState([...TASKS_ARR]);
      // console.log("This is arrState:", arrState);
      // console.log("This is TASKS ARR after pressing new:", TASKS_ARR);
      // console.log("activeList after pressing new button:", activeList);
      setLocalStorage(TASKS_ARR, "list");
      updateListsArr();
      apiFade.start({ from: { y: 10 }, to: { y: 0 } });
    }

    if (TASKS_ARR[TASKS_ARR.length - 1]?.done === 1) {
      TASKS_ARR.length = 0;
      TASKS_ARR.push(...filterUnMarked);
      addTask();
      addTask(filterMarked[0].text, 1);
      filterMarked.shift();
      TASKS_ARR.push(...filterMarked);
      setArrState([...TASKS_ARR]);
      setLocalStorage(TASKS_ARR, "list");
      updateListsArr();
      setListsState([...LISTS_ARR]);
      apiFade.start({ from: { opacity: 0, y: 0 }, to: { opacity: 1, y: 0 } });
    }

    if (TASKS_ARR.length === 0) {
      addTask();
      setArrState([...TASKS_ARR]);
      // console.log("This is arrState:", arrState);
      // console.log("This is TASKS ARR after pressing new:", TASKS_ARR);
      // console.log("activeList after pressing new button:", activeList);
      setLocalStorage(TASKS_ARR, "list");
      updateListsArr();
      apiFade.start({ from: { y: 10 }, to: { y: 0 } });
    }

    // Fade in clear tasks buttons if tasks array is != empty
    if (TASKS_ARR.length === 1) {
      // console.log("Fading in");
      apiClearAll.start(fadeInConfig);
      apiClear.start(fadeInConfig);
    }
  };

  const handleBtnDoneCheck = function (e) {
    let entryID = e.target.closest("div").getAttribute("inputid");
    let entryIndex = arrState.findIndex((e) => e.id === entryID);
    // TASKS_ARR.splice(entryIndex, 1);
    TASKS_ARR[entryIndex].done = TASKS_ARR[entryIndex].done === 1 ? 0 : 1;

    setArrState([...TASKS_ARR]);
    setLocalStorage(TASKS_ARR, "list");
    updateListsArr();
    setListsState([...LISTS_ARR]);

    const filterMarked = TASKS_ARR.filter((e) => e.done === 1);
    const filterUnMarked = TASKS_ARR.filter((e) => e.done === 0);
    const markedTask = TASKS_ARR[entryIndex];
    // console.log(markedTask);
    // console.log(TASKS_ARR.length);

    // Move marked tasks below, to other marked tasks
    if (markedTask.done === 1 && entryIndex !== TASKS_ARR.length - 1 && TASKS_ARR[entryIndex + 1].done !== 1) {
      TASKS_ARR.length = 0;
      TASKS_ARR.push(...filterUnMarked);
      addTask(filterMarked[0].text, 1);
      filterMarked.shift();
      TASKS_ARR.push(...filterMarked);
      setArrState([...TASKS_ARR]);
      setLocalStorage(TASKS_ARR, "list");
      updateListsArr();
      setListsState([...LISTS_ARR]);
    }

    // Move unmarked tasks back up other unmarked tasks
    if (markedTask.done === 0 && TASKS_ARR[entryIndex - 1]?.done !== 0) {
      TASKS_ARR.length = 0;
      TASKS_ARR.push(...filterUnMarked);
      filterMarked.forEach((e) => {
        addTask(e.text, 1);
      });
      setArrState([...TASKS_ARR]);
      setLocalStorage(TASKS_ARR, "list");
      updateListsArr();
      setListsState([...LISTS_ARR]);
    }
  };

  /////////////////////////////////////////////
  ////////// Task text input handler //////////
  /////////////////////////////////////////////

  const handleInput = function (e) {
    let entryID = e.target.getAttribute("inputid");
    let entryIndex = arrState.findIndex((e) => e.id === entryID);
    // setInput(e.target.value);
    arrState[entryIndex].text = e.target.value;
    // console.log("arrState after input:", arrState);
    setLocalStorage(TASKS_ARR, "list");
    updateListsArr();
  };

  ////////////////////////////////////////////////
  ////////// Bottom button row handlers //////////
  ////////////////////////////////////////////////

  ////////// Clear done tasks handler //////////
  const handleBtnClear = function (e) {
    apiClear.start(btnClickSpringConfig); // click animation
    // e.target.closest("div").classList.toggle("fade-pulse");
    let filterDone = TASKS_ARR.filter((e) => e.done === 0);

    // Fade out clear buttons if array empty after clearing all done tasks
    if (filterDone.length === 0) {
      apiClearAll.start(fadeOutConfig);
      apiClear.start(fadeOutConfig);
      setClearBtnsVisibleState(0);

      // Let animation finish before updating DOM so that buttons can disappear (if list empty after clearing marked tasks)
      setTimeout(() => {
        TASKS_ARR.splice(0, TASKS_ARR.length);
        TASKS_ARR.push(...filterDone);
        setArrState([...TASKS_ARR]);
        setLocalStorage(TASKS_ARR, "list");
        updateListsArr();
      }, 200);
    } else {
      // Update dom instantly since buttons remain and have time to be animated
      TASKS_ARR.splice(0, TASKS_ARR.length);
      TASKS_ARR.push(...filterDone);
      setArrState([...TASKS_ARR]);
      setLocalStorage(TASKS_ARR, "list");
      updateListsArr();
    }
  };

  ////////// Clear all done tasks handler //////////
  const handleBtnClearAll = function (e) {
    apiClearAll.start({
      from: {
        opacity: 1,
        scale: 1.1,
      },
      to: {
        opacity: 0,
        scale: 1,
      },
    }); // click animation and clear all button fade out
    apiClear.start(fadeOutConfig); // fade out clear done tasks button
    setClearBtnsVisibleState(0);

    setTimeout(() => {
      TASKS_ARR.length = 0;
      setArrState([...TASKS_ARR]);
      setLocalStorage(TASKS_ARR, "list");
      updateListsArr();
    }, 200);
  };

  ////////// List import handler //////////

  const handleDataImport = async function (e) {
    // console.log("Handling import");
    e.stopPropagation(); // make modal stay open when clicked on
    const data = await navigator.clipboard.readText();
    const dataFiltered = data
      .replace(/(\r\n|\n|\r)/gm, ",")
      .split(/[-_,]+/)
      .filter((el) => el.trim() !== ""); // Replace line breaks with a ',', then split by '-', '_', or ','
    let dataFinalArr = dataFiltered.map((el) => {
      el = el.trim();
      if (el.charAt(0) === " ") {
        return el.charAt(1).toUpperCase() + el.slice(2).toLowerCase();
      } else {
        return el.charAt(0).toUpperCase() + el.slice(1).toLowerCase();
      }
    });

    // Check if TASKS_ARR was empty before import
    const wasEmptyBeforeImport = TASKS_ARR.length === 0;

    // PUSH IMPORTED DATA INTO THE MAIN ARRAY
    // console.log(TASKS_ARR);
    dataFinalArr.forEach((el) => {
      addTask(el);
    });
    // console.log(TASKS_ARR);
    setArrState([...TASKS_ARR]);
    setLocalStorage(TASKS_ARR, "list");

    // Check if TASKS_ARR is not empty after import
    const isNotEmptyAfterImport = TASKS_ARR.length > 0;

    // If TASKS_ARR was empty before import and is not empty after import, run the code
    if (wasEmptyBeforeImport && isNotEmptyAfterImport) {
      apiClearAll.start(fadeInConfig);
      apiClear.start(fadeInConfig);
    }

    // Close modal
    apiOverlay.start(fadeOutConfig);
    setTimeout(() => setModalOpen(false), 400);
  };

  ////////// Modal handler //////////

  const modalHandler = function (e) {
    if (e.target.className === "btn-bottom-menu gradient-background") {
      apiImport.start(btnClickSpringConfig);
      setModalOpen(true);
      apiOverlay.start(fadeInConfig);
      apiModal.start(bottomRowSpringConfig);
    }

    if (e.target.className === "overlay") {
      apiOverlay.start(fadeOutConfig);
      setTimeout(() => setModalOpen(false), 400);
    }
  };

  ////////// List change handler //////////

  const handleBtnListChange = function (e) {
    // Reset delete confirmation
    const deletionReset = function () {
      apiBlink.start(deleteState === 1 ? redWarningReverseConfig : "");
      setDeleteState(0);
    };
    const replaceList = function (findByID) {
      TASKS_ARR.splice(0, TASKS_ARR.length);
      TASKS_ARR.push(...findByID.listArr);
      setLocalStorage(TASKS_ARR, "list");
      setArrState([...TASKS_ARR]);
      // console.log("List replaced");
    };
    // console.log(e.target);

    // Open the lists popup menu
    if (
      e.target.className === "btn-bottom-menu gradient-background" ||
      e.target.className === "fa-solid fa-list fa-3x"
    ) {
      setListsOpen(true);
      apiLists.start(btnClickSpringConfig);
      apiOverlay.start(fadeInConfig);
      apiModal.start(bottomRowSpringConfig);
      // console.log(e.target);
      // console.log("Clicked lists button");
      e.stopPropagation();
    }

    const targetListID = e.target.getAttribute("inputid");
    // console.log("Target ID is:", targetListID);

    // Set button target state
    if (targetListID === null) setBtnTargetState(LISTS_ARR.find((el) => el.listID === activeList).listID);

    const targetListIndex = LISTS_ARR.findIndex((el) => el.listID === targetListID);

    // SELECT list entry
    if (
      LISTS_ARR.some((el) => el.listID === targetListID) &&
      activeList !== targetListID &&
      e.target.closest("button")?.className === "btn-lists-select"
    ) {
      // console.log("Selecting new list");
      activeList = targetListID;
      setBtnTargetState(targetListID);
      apiSelect.start(btnClickSpringConfig);

      // Update locally stored active list
      setLocalStorage(TASKS_ARR, "list");
      setLocalStorage(targetListID, "storedActiveList");

      const listsStorageArray = JSON.parse(localStorage.getItem("listsStorage"));
      const findByID = listsStorageArray.find((e) => e.listID === targetListID);
      setCurListNameState(findByID.listName);

      // If selected list is empty, delay emptying the current array to fade out bottom clear buttons
      if (findByID.listArr.length === 0) {
        setClearBtnsVisibleState(0);
        // console.log("Fading out!");
        // console.log(findByID.listArr.length);
        apiClearAll.start(fadeOutConfig);
        apiClear.start(fadeOutConfig);
        setClearBtnsVisibleState(0);

        setTimeout(() => {
          replaceList(findByID);
        }, 100);
      } else {
        replaceList(findByID);
      }

      // Fade in clear tasks buttons if selected array is != empty
      if (TASKS_ARR.length !== 0 && clearBtnsVisibleState === 0) {
        // console.log("Fading IN!");
        apiClearAll.start(fadeInConfig);
        apiClear.start(fadeInConfig);
        setClearBtnsVisibleState(1);
      }
      deletionReset();
    } else if (
      LISTS_ARR.some((el) => el.listID === targetListID) &&
      activeList === targetListID &&
      e.target.closest("button")?.className === "btn-lists-select"
    ) {
      setBtnTargetState(targetListID);
      apiSelect.start(btnBlinkDeniedConfig);
      // console.log("clicked self");
      deletionReset();
    }

    // DELETE list entry
    // Actually deleting entry
    if (
      LISTS_ARR.some((el) => el.listID === targetListID) &&
      e.target.closest("button")?.className === "btn-lists-delete" &&
      activeList !== targetListID &&
      deleteState === 1 &&
      deleteTargetState === targetListID
    ) {
      // console.log("Deleting list entry");
      deleteFromListsArr(targetListIndex);
      setListsState([...LISTS_ARR]);
      setLocalStorage(LISTS_ARR, "listsStorage");
      deletionReset();
      setDeleteTargetState("");
    }
    // Delete confirmation
    if (
      LISTS_ARR.some((el) => el.listID === targetListID) &&
      e.target.closest("button")?.className === "btn-lists-delete" &&
      activeList !== targetListID &&
      deleteState === 0
    ) {
      setDeleteTargetState(targetListID);
      // console.log("Deleting list entry CONFIRMATION");
      apiBlink.start(redWarningConfig);
      setDeleteState(1);
    }

    if (
      LISTS_ARR.some((el) => el.listID === targetListID) &&
      e.target.closest("button")?.className === "btn-lists-delete" &&
      activeList !== targetListID &&
      deleteState === 1
    ) {
      deletionReset();
      setDeleteTargetState(targetListID);
      // console.log("Deleting list entry CONFIRMATION(2)");
      apiBlink.start(redWarningConfig);
      setDeleteState(1);
    }

    // Reset delete confirmation if clicked in lists container
    if (e.target.className === "lists-container" || targetListID === null) {
      deletionReset();
      // console.log("Clicked container reversing delete");
    }

    // Trying to delete selected list
    if (
      LISTS_ARR.some((el) => el.listID === targetListID) &&
      e.target.closest("button")?.className === "btn-lists-delete" &&
      activeList === targetListID
    ) {
      setDeleteTargetState(targetListID);
      // console.log("Can't delete, currently in this list.");
      apiBlink.start(btnBlinkDeniedConfig);
      setDeleteState(0);
    }

    // EDIT list entry name
    if (e.target?.className === "lists-name") {
      // console.log(e.target.value);
      // console.log(e.type);
      LISTS_ARR[targetListIndex].listName = e.target.value;
      if (activeList === targetListID) setCurListNameState(LISTS_ARR[targetListIndex].listName);
      setListsState([...LISTS_ARR]);
      setLocalStorage(LISTS_ARR, "listsStorage");
      deletionReset();
    }
    if (e.target?.className === "lists-name" && e?.key === "Enter") {
      e.target.blur();
      // console.log("Changing focus");
    }

    if (e.target?.className === "fa-solid fa-square-plus fa-3x") {
      // NEW list entry
      addToListsArr("New List", []);
      activeList = LISTS_ARR[LISTS_ARR.length - 1].listID;
      setListsState([...LISTS_ARR]);
      TASKS_ARR.splice(0, TASKS_ARR.length);
      addTask();
      setArrState([...TASKS_ARR]);
      setLocalStorage(TASKS_ARR, "list");
      setLocalStorage(LISTS_ARR, "listsStorage");
      setLocalStorage(activeList, "storedActiveList");
      setBtnTargetState(activeList);
      deletionReset();
    }

    if (e.target.className === "lists__overlay") {
      apiOverlay.start(fadeOutConfig);
      deletionReset();
      setTimeout(() => setListsOpen(false), 500);
    }
  };

  ///////////////////////////////
  ////////// Renderers //////////
  ///////////////////////////////
  // *used to be here* //

  return (
    <div className='App'>
      <div className='main-window'>
        <RenderFinalView
          // Animation
          fadeSpring={fadeSpring}
          fadeSpringClearAll={fadeSpringClearAll}
          fadeSpringClear={fadeSpringClear}
          fadeSpringImport={fadeSpringImport}
          fadeSpringModal={fadeSpringModal}
          fadeOverlay={fadeOverlay}
          fadeSpringLists={fadeSpringLists}
          selectSpring={selectSpring}
          blinkRedSpring={blinkRedSpring}
          transitionsTaskList={transitionsTaskList}
          // Variables
          TASKS_ARR={TASKS_ARR}
          curListNameState={curListNameState}
          // Functions
          handleBtnNew={handleBtnNew}
          handleBtnDoneCheck={handleBtnDoneCheck}
          handleInput={handleInput}
          handleBtnClear={handleBtnClear}
          handleBtnClearAll={handleBtnClearAll}
          handleDataImport={handleDataImport}
          modalHandler={modalHandler}
          handleBtnListChange={handleBtnListChange}
        />
        <Modal
          open={modalOpen}
          onClickHandler={modalHandler}
          getImportData={handleDataImport}
          fadeModalSpringConfig={fadeSpringModal}
          fadeOverlayConfig={fadeOverlay}
        />
        <Lists
          open={listsOpen}
          listsHandler={handleBtnListChange}
          listsArray={listsState}
          blinkRedSpringConfig={blinkRedSpring}
          clickSpringConfig={selectSpring}
          fadeModalSpringConfig={fadeSpringModal}
          fadeOverlayConfig={fadeOverlay}
          targetID={btnTargetState}
          deleteID={deleteTargetState}
        />
      </div>
    </div>
  );
};

export { RenderWindowComponent };

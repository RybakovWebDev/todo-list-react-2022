import { v4 as uuidv4 } from "uuid";

export const TASKS_ARR = [];
export class noteModel {
  constructor(text = "", done = 0, date = Date.now(), id = "id" + uuidv4()) {
    this.text = text;
    this.done = done;
    this.date = date;
    this.id = id;
  }
}

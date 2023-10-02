/* eslint-disable @typescript-eslint/no-explicit-any */
import { I_CommonObject, I_Node } from "../../../../utils/interface";

class Time_Node implements I_Node {
  type: string;
  category: string;
  baseClasess: string[];
  label: string;
  name: string;
  descriptionNode: string;
  timeData?: I_CommonObject | undefined;

  constructor() {
    this.label = 'Time Node'
    this.name = 'timeNode'
    this.type = 'Time'
    this.category = 'Default Nodes'
    this.descriptionNode = `add waiting times in the workflow`
    this.baseClasess = [this.type]
    this.timeData = {}
  }
}

export { Time_Node }

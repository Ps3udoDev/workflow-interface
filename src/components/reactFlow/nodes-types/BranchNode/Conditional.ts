/* eslint-disable @typescript-eslint/no-explicit-any */
import {  I_Node } from "../../../../utils/interface";
import { queryType } from "../../../../utils/types";

class Branch_Node implements I_Node {
  type: string;
  category: string;
  baseClasess: string[];
  label: string;
  name: string;
  descriptionNode: string;
  queryData?: queryType[] | undefined;

  constructor() {
    this.label = 'Branch Node'
    this.name = 'branchNode'
    this.type = 'Branch'
    this.category = 'Default Nodes'
    this.descriptionNode = `define conditions in the workflow`
    this.baseClasess = [this.type]
    this.queryData = []
  }
}

export { Branch_Node }

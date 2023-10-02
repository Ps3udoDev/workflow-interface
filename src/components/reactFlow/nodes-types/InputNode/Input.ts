/* eslint-disable @typescript-eslint/no-explicit-any */
import { I_CommonObject, I_Node } from "../../../../utils/interface";

class Input_Node implements I_Node {
  type: string;
  category: string;
  baseClasess: string[];
  label: string;
  name: string;
  variables?: I_CommonObject | undefined;
  description?: string;
  descriptionNode: string;

  constructor() {
    this.label = 'Input Node'
    this.name = 'inputNode'
    this.type = 'Input'
    this.category = 'Default Nodes'
    this.description = ''
    this.descriptionNode = `initialize the workflow`
    this.baseClasess = [this.type]
    this.variables = {} 
  }
}

export { Input_Node }

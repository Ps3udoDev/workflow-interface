/* eslint-disable @typescript-eslint/no-explicit-any */
import { I_CommonObject, I_Node } from "../../../../utils/interface";

class Default_Node implements I_Node {
  type: string;
  category: string;
  baseClasess: string[];
  label: string;
  name: string;
  variables?: I_CommonObject | undefined;
  description?: string;
  descriptionNode: string;

  constructor() {
    this.label = 'Default Node'
    this.name = 'defaultNode'
    this.type = 'Default'
    this.category = 'Default Nodes'
    this.description = ''
    this.descriptionNode = `loads variables in the context that will be used for the workflow`
    this.baseClasess = [this.type]
    this.variables = {} 
  }
}

export { Default_Node }

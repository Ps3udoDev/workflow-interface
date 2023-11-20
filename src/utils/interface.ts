import { queryType } from "./types"

export type NodeParamsType = | 'options' | 'string' | 'number' | 'boolean' | 'password' | 'json' | 'code' | 'date' | 'file' | 'folder' | 'asyncOptions'

export type CommonType = string | number | boolean | undefined | null | file

export interface I_CommonObject {
  [key: string]: unknown | CommonType | I_CommonObject | CommonType[] | I_CommonObject[]
}

export interface I_NodeOptionsValue {
  label: string
  name: string
  description?: string
}

export interface I_NodeDisplay {
  [key: string]: string[] | string
}

export interface I_NodeParams {
  label: string
  name: string
  type: NodeParamsType | string
  default?: CommonType | I_CommonObject | I_CommonObject[]
  description?: string
  warning?: string
  options?: Array<I_NodeOptionsValue>
  credentialNames?: Array<string>
  optional?: boolean | I_NodeDisplay
  step?: number
  rows?: number
  list?: boolean
  acceptVariable?: boolean
  placeholder?: string
  fileType?: string
  additionalParams?: boolean
  loadMethod?: string
}

export interface I_NodeOutputsValue {
  label: string
  name: string
  baseClasess: string[]
  description?: string
}

export interface I_NodeProperties {
  label: string
  name: string;
  type: string;
  category: string;
  baseClasess: string[];
  description?: string;
  variables?: I_CommonObject
  timeData?: I_CommonObject
  mailData?: I_CommonObject
  smsData?: I_CommonObject
  queryData?: queryType[]
  voiceData?: any
  descriptionNode: string;
}

export interface I_NodeData extends I_NodeProperties {
  id: string
  inputs?: I_CommonObject
  outputs?: I_CommonObject
  credential?: string
  instance?: undefined
  loadMethod?: string
}

export interface I_Node extends I_NodeProperties {
  inputs?: I_NodeParams[]
  output?: I_NodeOutputsValue[]
  loadMethods?: {
      [key: string]: (nodeData: I_NodeData, options?: I_CommonObject) => Promise<I_NodeOptionsValue[]>
  }
  init?(nodeData: I_NodeData, input: string, options?: I_CommonObject): Promise<unknown>
  run?(nodeData: I_NodeData, input: string, options?: I_CommonObject): Promise<string | I_CommonObject>
  clearSessionMemory?(nodeData: I_NodeData, options?: I_CommonObject): Promise<void>
}
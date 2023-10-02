export type queryType = {
  id: string,
  query: string;
}


export type StateNode = {
  type: string;
  on?: {
    [transition: string]: string;
  };
  after?: {
    [milliseconds: number]: object
  },
  always?: {
    target: string, cond: {};
  }
}

export type States = {
  [key: string]: StateNode;
}
export type ContextMachine = {
  [key: string]: undefined;
}

export type StateMachine = {
  id: string;
  initial: string;
  context: ContextMachine;
  states: States;
}

export enum StateType {
  ATOMIC = "atomic",
  COMPOUND = "compound",
  PARALLEL = "parallel",
  FINAL = "final",
  HISTORY = "history"
}

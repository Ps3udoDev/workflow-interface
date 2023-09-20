export type queryType = {
  id: string,
  query: string;
}

export type StateNode = {
  on?: {
    [transition: string]: string;
  };
}

export type States = {
  [key: string]: StateNode;
}

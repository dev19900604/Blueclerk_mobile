export type IServerResponse<K extends string, T> = ResponseModel<K, T> & {
  status: number;
  message: string;
  tagType: string | undefined | null;
};

export type ResponseModel<K extends string, T> = {
  [P in K]: T;
};

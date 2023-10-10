

export interface ICommandAction {
  // name: string;
  model: any;
  readonly do: { (model: any): string };
}

export interface CommandAction<T> extends ICommandAction {
  model: T;
  readonly do: { (model: T): string };
}

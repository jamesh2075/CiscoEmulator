
export interface IVerification {
  /** If an array, this verification applies to each device in the array
   */
  devices?: string | string[];
  /** If an array, this verification applies to each interface in the array
   * 
   * If not defined, any interface specification is inherited from its container
   */
  interfaces?: string | string[];

  verify: {[key:string]:any};
}

export interface ITaskScoreKey {
  points: number; // the number of points awarded if verified

  description?: string | string[];

  verify: IVerification | IVerification[];
}

export type ExamItemScoreKey = {[key:string]:ITaskScoreKey};

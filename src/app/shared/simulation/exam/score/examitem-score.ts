import { Simulation } from '../../simulation';
import { ExamItemScoreKey, ITaskScoreKey, IVerification } from './scorekey';
import { AsArray, AsSingle } from "../../emulator/util";
import { Verifier, VerifyResult } from './verify';


export class ScoreResult {
  points: number = 0;
  verifications: VerifyResult[] = [];
}

export function ScoreItem(model: any, scoreKey: ITaskScoreKey) : ScoreResult {
  let verifications = AsArray(scoreKey.verify);
  let verifier = new Verifier();
  let result = new ScoreResult;

  for(let verification of verifications) {
    let thisResult = verifier.Verify(model, verification);
    result.verifications = [ ...result.verifications, ...thisResult ];
  }

  if(result.verifications.every((value)=> value.pass === true)) {
    // all verifications passed, award the point
    result.points = scoreKey.points;
  }

  return result;
}


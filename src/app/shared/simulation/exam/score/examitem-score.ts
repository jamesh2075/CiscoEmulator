import { Simulation } from '../../simulation';
import { ExamItemScoreKey, ITaskScoreKey, IVerification } from './scorekey';
import { AsArray, AsSingle } from '../../emulator/util';
import { Verifier, VerifyResult } from './verify';


export class ScoreResult {
  points = 0;
  verifications: VerifyResult[] = [];
}

export function ScoreItem(model: any, scoreKey: ITaskScoreKey): ScoreResult {
  const verifications = AsArray(scoreKey.verify);
  const verifier = new Verifier();
  const result = new ScoreResult;

  for (const verification of verifications) {
    const thisResult = verifier.Verify(model, verification);
    result.verifications = [ ...result.verifications, ...thisResult ];
  }

  if (result.verifications.every((value) => value.pass === true)) {
    // all verifications passed, award the point
    result.points = scoreKey.points;
  }

  return result;
}


export class Player {
  readonly total: number;
  readonly isWinner: boolean;

  constructor(public readonly name: string = '', public readonly scores: number[] = []) {
    this.total = this.scores.reduce((t, v) => t + v, 0);
    const minWinningScore = this.scores.some(s => s % 100 !== 0) ? 80 : 8000;
    this.isWinner = this.total >= minWinningScore;
  }
}

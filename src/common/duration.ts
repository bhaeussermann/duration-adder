export class Duration {
  constructor(public hours: number, public minutes: number) { }

  get isZero(): boolean {
    return !(this.hours + this.minutes);
  }

  toString(): string {
    return !this.hours ? this.minutes + 'm' : `${this.hours}h ${pad(this.minutes)}m`;

    function pad(numberToPad: number) {
      return (numberToPad < 10 ? '0' : '') + numberToPad;
    };
  }

  static Zero = new Duration(0, 0);
}

/**
 * Class specifies location of element in state data tree
 * It allows to point specific location and do something with it
 */

export class Location {
  constructor(private _path: string) {
    this._path = this.validate(this._path);
  }
  get path(): string {
    return this._path;
  }
  set path(path: string) {
    this._path = this.validate(path);
  }
  static create(path: string): Location {
    return new Location(path);
  }
  getParentName(): string {
    const tab: Array<string> = this._path.split('.');
    return tab.pop()!;
  }
  getParentPath(): Location {
    const tab: Array<string> = this._path.split('.');
    tab.pop();
    return Location.create(tab.join('.'));
  }
  getChildLocation(childName: string): Location {
    return Location.create(`${this._path}.${childName}`);
  }
  copy() {
    return Location.create(this._path);
  }

  private validate(p: string): string {
    return p;
  }
}

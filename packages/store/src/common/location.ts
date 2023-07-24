/**
 * Class specifies location of element in state data tree
 * It allows to point specific location and do something with it
 */

export class SingleLocation {
  private _path: string;

  constructor(path: string) {
    this._path = this.validate(path);
  }

  get path(): string {
    return this._path;
  }

  static getLocation(fragments: Array<string>): SingleLocation;
  static getLocation(path: string, childName?: string): SingleLocation;
  static getLocation(path: string | Array<string>, childName?: string): SingleLocation {
    const myPath: string = Array.isArray(path) ? path.join('.') : path;
    const current = childName === undefined ? myPath : myPath + '.' + childName;
    return new SingleLocation(current);
  }

  getParentName(): string {
    const tab: string[] = this._path.split('.');
    return tab.pop()!;
  }

  getParentPath(): SingleLocation {
    const tab: string[] = this._path.split('.');
    tab.pop();
    return SingleLocation.getLocation(tab.join('.'));
  }

  getChildLocation(childName: string): SingleLocation {
    return SingleLocation.getLocation(`${this._path}.${childName}`);
  }

  getNeighborLocation(childName: string): SingleLocation {
    return SingleLocation.getLocation(this._path).getParentPath().getChildLocation(childName);
  }

  getLocation(): SingleLocation {
    return SingleLocation.getLocation(this._path);
  }

  private validate(p: string): string {
    return p;
  }
}

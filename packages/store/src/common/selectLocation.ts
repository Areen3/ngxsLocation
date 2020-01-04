/**
 * Class specifies location of element in state data tree
 * It allows to add one State class multiple times in Stata Data tree with different paths
 */

export enum ELocationKind {
  byName = 'byName',
  byLocation = 'byLocation',
  byContext = 'byContext',
  byPathTree = 'byPathTree',
  byContextInPath = 'byContextInPath'
}

export class SelectLocation {
  get locationKind(): ELocationKind {
    return this._locationKind;
  }
  private _locationKind: ELocationKind;
  private constructor(
    public context: string,
    public name: string,
    public path: string,
    public searchInTree: boolean
  ) {
    this._locationKind = this.validate();
  }

  static filterByName(name: string): SelectLocation {
    return new SelectLocation('', name, '', false);
  }
  static filterByPath(path: string, name?: string): SelectLocation {
    const loc: string = name === undefined ? path : `${path}.${name}`;
    return new SelectLocation('', '', loc, false);
  }
  static filterByContext(context: string, name: string): SelectLocation {
    return new SelectLocation(context, name, '', false);
  }
  static filterByPathTree(path: string, name: string): SelectLocation {
    return new SelectLocation('', name, path, true);
  }
  static filterByAll(context: string, path: string, name: string): SelectLocation {
    return new SelectLocation(context, name, path, true);
  }
  copy() {
    return new SelectLocation(this.context, this.name, this.path, this.searchInTree);
  }
  getParentName(): string {
    this.checkLocation();
    const tab: Array<string> = this.path.split('.');
    return tab.pop()!;
  }
  getParentPath(): string {
    this.checkLocation();
    const tab: Array<string> = this.path.split('.');
    tab.pop();
    return tab.join('.');
  }
  getParentLocation(): SelectLocation {
    return SelectLocation.filterByPath(this.getParentPath());
  }
  getChildLocation(childName: string): SelectLocation {
    this.checkLocation();
    return SelectLocation.filterByPath(`${this.path}.${childName}`);
  }
  private checkLocation() {
    if (this.locationKind === ELocationKind.byLocation)
      throw new Error(
        `You can run function setLocationToParent only with LocationKind === byLocation`
      );
  }

  validate(): ELocationKind {
    if (
      this.name !== '' &&
      this.path === '' &&
      this.context === '' &&
      this.searchInTree === false
    )
      return ELocationKind.byName;
    if (
      this.name === '' &&
      this.path !== '' &&
      this.context === '' &&
      this.searchInTree === false
    )
      return ELocationKind.byLocation;
    if (
      this.name !== '' &&
      this.path === '' &&
      this.context !== '' &&
      this.searchInTree === false
    )
      return ELocationKind.byContext;
    if (
      this.name !== '' &&
      this.path !== '' &&
      this.context === '' &&
      this.searchInTree === true
    )
      return ELocationKind.byPathTree;
    if (
      this.name !== '' &&
      this.path !== '' &&
      this.context !== '' &&
      this.searchInTree === true
    )
      return ELocationKind.byContextInPath;
    throw new Error('Wrong combination of serarch parametres in SelectLocation');
  }
}

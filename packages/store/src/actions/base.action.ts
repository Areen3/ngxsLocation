import { ActionKind } from '../common/declaration';
import { SelectLocation } from '../common';

/** Base abstract class for Action which lets developer to set Location and kind of action */
export abstract class NgxsAction {
  location: SelectLocation;
  kind: ActionKind = ActionKind.akCommand;
}

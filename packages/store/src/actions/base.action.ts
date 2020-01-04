import { ActionKind } from '../common/declaration';
import { SelectLocation } from '../common/selectLocation';

/** Base abstract class for Action which lets developer to set SelectLocation and kind of action */
export abstract class NgxsAction {
  location: SelectLocation;
  kind: ActionKind = ActionKind.akCommand;
}

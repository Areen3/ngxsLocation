import { SharedSelectorOptions, SelectFromRootState } from '../internal/internals';
import { SingleLocation } from '../common';

export interface CreationMetadata {
  containerClass: any;
  selectorName: string;
  location: SingleLocation;
  getSelectorOptions?: () => SharedSelectorOptions;
}

export interface RuntimeSelectorInfo {
  selectorOptions: SharedSelectorOptions;
  argumentSelectorFunctions: SelectFromRootState[];
}

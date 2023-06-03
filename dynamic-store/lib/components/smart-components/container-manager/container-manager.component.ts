import { Component } from '@angular/core';
import { VehicleContainerManagerService } from '../../../logic/services/vehicle-container-manager.service';

@Component({
  selector: 'container-manager',
  templateUrl: './container-manager.component.html'
})
export class ContainerManagerComponent {
  constructor(private container: VehicleContainerManagerService) {}

  RemoveContainer() {
    this.container.removeContainer(1);
  }
}

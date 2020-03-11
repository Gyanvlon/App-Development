import {Component, Input, OnInit} from '@angular/core';
import { CurrentUser } from '../../../../core/models/current-user.model';

@Component({
  selector: 'app-interpretation-container',
  templateUrl: './interpretation-container.component.html',
  styleUrls: ['./interpretation-container.component.css']
})
export class InterpretationContainerComponent implements OnInit {

  @Input() visualizationLayers: any[];
  @Input() currentUser: CurrentUser;
  @Input() itemHeight: string;
  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import { Visualization } from '../../../../core/models/visualization.model';
import { CurrentUser } from '../../../../core/models/current-user.model';

@Component({
  selector: 'app-visualization-list',
  templateUrl: './visualization-list.component.html',
  styleUrls: ['./visualization-list.component.css']
})
export class VisualizationListComponent implements OnInit {
  @Input() visualizationObjects: Visualization[];
  @Input() currentUser: CurrentUser;
  constructor() {
  }

  ngOnInit() {}
}

import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as visualizationActions from '../../../../store/actions/visualization.actions';
import { AppState } from '../../../../store/reducers/index';
import { getVisualizationShape } from '../../../../core/helpers/get-visualization-shape.helper';

@Component({
  selector: 'app-visualization-resize-section',
  templateUrl: './visualization-resize-section.component.html',
  styleUrls: ['./visualization-resize-section.component.css']
})
export class VisualizationResizeSectionComponent implements OnInit {

  @Input() dashboardId: string;
  @Input() visualizationId: string;
  @Input() loaded: boolean;
  @Input() showResizeButton: boolean;
  @Input() showFullScreenButton: boolean;
  @Input() visualizationShape: string;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
  }

  toggleFullScreen(e) {
    e.stopPropagation();
    this.store.dispatch(new visualizationActions.ToggleFullScreenAction(this.visualizationId));
  }

  resizeCard(e?) {
    if (e) {
      e.stopPropagation();
    }
    this.store.dispatch(new visualizationActions.ResizeAction({
      visualizationId: this.visualizationId,
      shape: getVisualizationShape(this.visualizationShape)
    }));
  }

}

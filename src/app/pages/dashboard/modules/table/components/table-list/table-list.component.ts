import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {TableConfigurationService} from '../../services/table-configuration.service';
import {TableConfiguration} from '../../models/table-configuration';
import { TableItemComponent } from '../table-item/table-item.component';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  @Input() visualizationLayers: any[];
  @Input() visualizationType: string;
  @ViewChild(TableItemComponent) tableItem: TableItemComponent;
  tableLayers: Array<{tableConfiguration: TableConfiguration; analyticsObject: any}> = [];
  constructor(private tableConfig: TableConfigurationService) { }

  ngOnInit() {
    if (this.visualizationLayers.length > 0) {
      this.tableLayers = this.visualizationLayers.map((layer: any) => {
        return {
          tableConfiguration: this.tableConfig.getTableConfiguration(
            layer.settings,
            layer.layout,
            this.visualizationType
          ),
          analyticsObject: layer.analytics
        };
      });
    }
  }

  onDownloadEvent(filename, downloadFormat) {
    if (this.tableItem) {
      this.tableItem.downloadTable(filename, downloadFormat);
    }
  }

}

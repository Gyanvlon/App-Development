import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input() loadingMessage: string;
  @Input() imgHeight: string;
  @Input() showInline: boolean;
  constructor() {}
  ngOnInit() {}
}

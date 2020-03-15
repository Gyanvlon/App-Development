import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../../Services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.css']
})
export class DeleteProjectComponent implements OnInit {
  projectId: any;
  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.projectId = this.route.snapshot.paramMap.get('id');
      console.log(this.projectId);
    });
    this.apiService.setProjectID(this.projectId);
  }

  
  ngOnInit() {
    // this.apiService.deleteProject().subscribe( res => {
    //   console.log(res);
    // });
  }

}

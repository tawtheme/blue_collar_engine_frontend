import { Component, OnInit } from '@angular/core';
import { RequestDemoService } from '@app/_services/secure-panel/request-demo.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-request-demo',
  templateUrl: './request-demo.component.html',
  styleUrls: ['./request-demo.component.scss']
})
export class RequestDemoComponent implements OnInit {
  data = [];
  loading = true;
  constructor(private _requestDemoService: RequestDemoService) {
    this.bindGrid();
  }

  ngOnInit(): void {
  }

  bindGrid() {
    this._requestDemoService.getDemoRequested().subscribe(res => {
      //console.log(JSON.stringify(res))
      this.data = res.data;
      this.loading = false;
    });
  }
}

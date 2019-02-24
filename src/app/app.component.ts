import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  token = `75cdf4b6c16ad7fde95f170320c81f6375dce35e`;

  diskUsageQuery = `
  query {
    {
      repository(owner: "ng-alain", name: "ng-alain") {
        diskUsage
      }
    }
  }
  `;
  diskUsageCallback(data: any): string {
    return `${(data.repository.diskUsage / 1024).toFixed(2)} KB`;
  }
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GithubButtonComponent } from './src/component';

@NgModule({
  imports: [CommonModule],
  declarations: [GithubButtonComponent],
  exports: [GithubButtonComponent],
})
export class GithubButtonModule {}

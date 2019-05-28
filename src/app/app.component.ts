import { Component, Inject } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  darkTheme = false;
  constructor(
    private oc: OverlayContainer,
    @Inject('BASE_CONFIG') config
  ) {
    console.log('config:::', config);
  }
  switchTheme(dark: boolean) {
    this.darkTheme = dark;
    dark ? this.oc.getContainerElement().classList.add('myapp-dark-theme') :
      this.oc.getContainerElement().classList.remove('myapp-dark-theme');
  }
}

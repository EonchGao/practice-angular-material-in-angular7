import { NgModule, SkipSelf, Optional } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { loadSvgResources } from '../util/svg.util';
import { AppRoutingModule } from '../app-routing.module';
import { ServicesModule } from '../services/services.module';


@NgModule({
  imports: [
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServicesModule.forRoot(),
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: 'BASE_CONFIG', useValue: {
        uri: 'http://localhost:3000'
      }
    }
  ]
})

export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parent: CoreModule,
    ir: MatIconRegistry,
    ds: DomSanitizer) {
    if (parent) {
      throw new Error('模块已存在，不能再次加载！！');
    }
    loadSvgResources(ir, ds);
  }
}

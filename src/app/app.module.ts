import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ArticlePipe } from './article.pipe';
import { MatChipsModule } from '@angular/material/chips';

import { NgxPanZoomModule } from 'ngx-panzoom';
import { TitleComponent } from './title/title.component';
import { PolityInfoComponent } from './polity-info/polity-info.component';
import { StarInfoComponent } from './star-info/star-info.component';
import { SubMapModalComponent } from './sub-map-modal/sub-map-modal.component';
import { HoverDataComponent } from './hover-data/hover-data.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    PolityInfoComponent,
    StarInfoComponent,
    ArticlePipe,
    SubMapModalComponent,
    HoverDataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    NgxPanZoomModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

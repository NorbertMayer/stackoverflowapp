import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
// components
import { PostsComponent } from "./posts/posts.component";
import { PostDetailComponent } from "./post-detail/post-detail.component";
import { NewPostComponent } from "./new-post/new-post.component";
import { SearchPostPipe } from "./shared/search-post.pipe";

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    PostDetailComponent,
    NewPostComponent,
    SearchPostPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

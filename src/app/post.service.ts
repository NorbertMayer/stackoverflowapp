import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root"
})
export class PostService {
  private url_prefix: string = environment.express_url;

  constructor(private http: HttpClient) {}

  // get all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.url_prefix + "/api/post/");
  }
  // add new post
  createPost(post: PostParams): Observable<Post[]> {
    return this.http.post<Post[]>(this.url_prefix + "/api/post/", post);
  }
  // get post by id
  getPostById(_id: string): Observable<Post> {
    return this.http.get<Post>(this.url_prefix + `/api/post/${_id}`);
  }
}

export interface Post extends PostParams {
  _id: string;
}

export interface PostParams {
  title: string;
  description: string;
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root"
})
export class CommentService {
  comment: BehaviorSubject<Comment[]> = new BehaviorSubject([]);
  private url_prefix: string = environment.express_url;
  up: boolean;

  constructor(private http: HttpClient) {}

  // create comment
  create(comment: CommentParams): Observable<Comment> {
    return this.http.post<Comment>(`${this.url_prefix}/api/comment`, comment);
  }

  // get comment by post id
  getCommentsForPostId(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.url_prefix}/api/comment?postId=${id}`
    );
  }

  // get comments
  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.url_prefix}/api/comment`);
  }

  vote(comment: Comment, up: boolean) {
    return this.http.post(`${this.url_prefix}/api/comment/${comment.id}/vote`, {
      up
    });
  }
}

export interface Comment extends CommentParams {
  id: string;
}

export interface CommentParams {
  postId: string;
  answer: string;
  vote: number;
}

export interface Vote {
  count: number;
  score: number;
}

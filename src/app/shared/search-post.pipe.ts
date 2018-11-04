import { Pipe, PipeTransform } from "@angular/core";
import { Post, PostParams, PostService } from "../post.service";

@Pipe({
  name: "searchPost"
})
export class SearchPostPipe implements PipeTransform {
  transform(post: Post[], filterPost: string): Post[] {
    if (!post || !filterPost) {
      return post;
    }

    return post.filter(post => {
      return post.title
        .toLocaleLowerCase()
        .includes(filterPost.toLocaleLowerCase());
    });
  }
}

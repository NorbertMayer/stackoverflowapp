import { Pipe, PipeTransform } from "@angular/core";
import { Post } from "../post.service";

@Pipe({
  name: "searchPost",
  pure: false
})
export class SearchPostPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return null;
  }
}

export interface Document {

  id: string,
  "cover_image": string,
  "brief_content": string,
  "title": string,
  "content": string,
  "author": string,
  "createTime": number,
  "updateTime": number,
  "like": number,
  "dislike": number,

  "tags": string[],

  "type": string,
  "deleted": boolean,
  "privateDoc": boolean

}

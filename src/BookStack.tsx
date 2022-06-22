import { Image } from "@raycast/api";

export type BookStackPreview = {
  name: string;
  content: string;
};

export type BookStackRecord = {
  id: number;
  name: string;
  slug: string;
  book_id: number;
  chapter_id: number;
  description: string;
  created_at: string;
  updated_at: string;
  url: string;
  preview_html: BookStackPreview;
  tags: Array<string>;
  book_slug: string;
  type: string;
};

export type BookStackResponse = {
  total: number;
  data: BookStackRecord[];
};

export function formatPreview(htmlPreview: BookStackPreview): string | undefined {
  return htmlPreview.content ? htmlPreview.content.replace(/(<([^>]+)>)/gi, "") : undefined;
}

export function getIcon(item: BookStackRecord): Image.ImageLike {
  const icon: Image.ImageLike = {
    source: "page.png",
    tintColor: "#3a454a",
  };

  switch (item.type) {
    case "chapter":
      icon.source = "chapter.png";
      icon.tintColor = "#db5382";
      break;
    case "book":
      icon.source = "book.png";
      icon.tintColor = "#00a0dd";
      break;
    case "bookshelf":
      icon.source = "bookshelf.png";
      icon.tintColor = "#cf112d";
      break;
  }

  return icon;
}

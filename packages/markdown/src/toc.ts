import { TocItem } from "@trace/config";
import { slugify } from "@trace/utils";

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim().replace(/[*_~`]/g, "");
    const id = slugify(text) || `heading-${toc.length + 1}`;

    toc.push({
      id,
      text,
      level
    });
  }

  return toc;
}

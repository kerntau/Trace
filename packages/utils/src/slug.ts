export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "") // 支持中文、英文、数字
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

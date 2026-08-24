export function calculateReadingTime(content: string): { words: number; minutes: number } {
  if (!content) return { words: 0, minutes: 0 };
  // 去除 markdown 标记与 HTML 标签
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[#*`_~>\-[\]()]/g, "")
    .trim();

  const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (cleanContent.replace(/[\u4e00-\u9fa5]/g, " ").match(/[a-zA-Z0-9_-]+/g) || []).length;
  const totalWords = chineseChars + englishWords;

  // 中文按 350 字/分钟，英文按 160 词/分钟估算
  const minutes = Math.max(1, Math.ceil(chineseChars / 350 + englishWords / 160));

  return {
    words: totalWords,
    minutes
  };
}

export function formatDate(
  dateInput: string | number | Date,
  format: "YYYY-MM-DD" | "YYYY-MM-DD HH:mm" | "YYYY/MM/DD" = "YYYY-MM-DD"
): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "number" || typeof dateInput === "string" 
    ? new Date(Number(dateInput) || dateInput) 
    : dateInput;

  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (format === "YYYY-MM-DD HH:mm") {
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  if (format === "YYYY/MM/DD") {
    return `${year}/${month}/${day}`;
  }
  return `${year}-${month}-${day}`;
}

export function formatRelativeTime(dateInput: string | number | Date): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "number" || typeof dateInput === "string" 
    ? new Date(Number(dateInput) || dateInput) 
    : dateInput;

  if (isNaN(date.getTime())) return "";

  const now = Date.now();
  const diffSec = Math.floor((now - date.getTime()) / 1000);

  if (diffSec < 60) return "刚刚";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分钟前`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} 小时前`;
  if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)} 天前`;
  if (diffSec < 31536000) return `${Math.floor(diffSec / 2592000)} 个月前`;
  return `${Math.floor(diffSec / 31536000)} 年前`;
}

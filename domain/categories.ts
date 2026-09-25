export const CATEGORY_COLOR: Record<string, string> = {
  新刊: "#e23b3b",
  文学: "#e07a3d",
  児童: "#f0b429",
  雑誌: "#2a9d8f",
  視聴覚: "#3d7ea6",
  設備: "#6b7280",
  イベント: "#7c5cbf",
  趣味実用: "#2f9e44",
  学習: "#3b82c4",
  郷土: "#c45c26",
};

export function categoryColor(category: string): string {
  return CATEGORY_COLOR[category] ?? "#444444";
}

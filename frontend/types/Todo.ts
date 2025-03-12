export interface TodoFormData {
  created_at: Date | null;
  description: string;
  due_at: Date | null;
  id: number;
  priority: string;
  slug: string;
  status: string;
  title: string;
  user_id: string;
}

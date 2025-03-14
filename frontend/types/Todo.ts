import { Dayjs } from "dayjs";

export interface TodoFormData {
  created_at: Date | Dayjs | null;
  description: string;
  due_at: Date | Dayjs | null;
  id: number;
  priority: string;
  slug: string;
  status: string;
  title: string;
  user_id: string;
}

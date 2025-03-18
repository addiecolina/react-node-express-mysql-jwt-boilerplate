import { Dayjs } from "dayjs";

export interface TodoFormData {
  created_at: Date | Dayjs | string;
  description: string;
  due_at: Date | Dayjs | string;
  priority: string;
  slug: string;
  status: string;
  title: string;
  user_id: string;
  completed_at: Date | Dayjs | string | null;
}

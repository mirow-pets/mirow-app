export interface TSetting {
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
  id: number;
  settings: string;
  value: string;
  display: string;
}

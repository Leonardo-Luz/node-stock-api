import { ProductStatus } from "@enums/product-status.enum";

export interface ParsedQueryFilterProducts {
  category?: string;
  status?: ProductStatus;
  price?: { $gte?: number; $lte?: number };
}

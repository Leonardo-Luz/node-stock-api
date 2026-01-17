import { StockMovementReason } from "@enums/stock-movement-reason.enum";
import { StockMovementType } from "@enums/stock-movement-type.enum";

export interface ParsedQueryFilterStockMovements {
  productId?: string;
  reason?: StockMovementReason;
  type?: StockMovementType;
  createdBy?: string;
}

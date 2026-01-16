import { StockMovementReason } from "@enums/stock-movement-reason.enum";
import { StockMovementType } from "@enums/stock-movement-type.enum";

export interface ParsedQueryFilterStockMovement {
  productId?: string;
  reason?: StockMovementReason;
  type?: StockMovementType;
  createdBy?: string;
}

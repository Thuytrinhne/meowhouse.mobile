export interface ICoupon {
  coupon_name: string;
  coupon_description: string;
  coupon_type: "Free Ship" | "Order";
  coupon_condition: number;
  coupon_unit: "%" | "đ";
  coupon_value: number;
  coupon_max_value: number;
  coupon_stock_quantity: number;
  start_time: string;
  end_time: string;
  coupon_hashed_id: string;
  isOwned?: boolean;
}

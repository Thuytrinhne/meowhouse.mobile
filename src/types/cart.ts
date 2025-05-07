export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  variant: {
    _id: string;
    variant_name: string;
    variant_img: string;
    variant_price: number;
    variant_discount_percent: number;
  };
  selected: boolean;
}

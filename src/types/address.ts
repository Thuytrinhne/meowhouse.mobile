export interface Address {
  _id: string;
  full_name: string;
  phone: string;
  detail_address: string;
  is_default: boolean;
  province: {
    id: string;
    name: string;
  };
  district: {
    id: string;
    name: string;
  };
  ward: {
    id: string;
    name: string;
  };
}

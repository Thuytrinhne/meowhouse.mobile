export const createCodPayment = async (
  newPaymentData: any
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/payos/create-payment-link`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPaymentData, mobile: false }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create COD payment link");
    }

    // Optional: Bạn có thể parse dữ liệu nếu cần
    const data = await response.json();
    console.log("Order success:", data);

    return true;
  } catch (error) {
    console.error("Error creating COD payment:", error);
    return false;
  }
};

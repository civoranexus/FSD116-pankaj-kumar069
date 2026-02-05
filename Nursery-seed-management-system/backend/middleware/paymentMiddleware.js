export const validatePayment = (req, res, next) => {
  const { amount, method } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid payment amount" });
  }
  if (!["UPI","Card","NetBanking"].includes(method)) {
    return res.status(400).json({ error: "Unsupported payment method" });
  }
  next();
};
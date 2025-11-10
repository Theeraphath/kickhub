function authorizeOwner(req, res, next) {
  if (req.user?.role !== "owner") {
    return res.status(403).json({
      status: "error",
      message: "คุณไม่มีสิทธิ์เข้าถึง API นี้",
    });
  }
  next();
}

module.exports = authorizeOwner;

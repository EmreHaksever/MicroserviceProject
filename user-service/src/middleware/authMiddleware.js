const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Erişim reddedildi. Token bulunamadı.' });
  }

  try {
    // "Bearer <token>" formatından sadece token kısmını alıyoruz
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Geçersiz token.' });
  }
};
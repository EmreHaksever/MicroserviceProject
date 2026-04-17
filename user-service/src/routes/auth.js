const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Dosyanın en üstüne ekle

const router = express.Router();

// KAYIT (REGISTER)
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Kullanıcı var mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta zaten kullanımda.' });
    }

    // Şifreyi şifrele (Hash)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.' });

  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GİRİŞ (LOGIN)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // Şifreyi doğrula
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // JWT Oluştur
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, message: 'Giriş başarılı.' });

  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});



// PROFİL GETİRME (Sadece giriş yapmış kullanıcılar)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// TÜM KULLANICILAR (Sadece Admin yetkisi testi için)
router.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
  }
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
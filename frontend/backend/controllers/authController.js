const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  try {
    const result = await pool.query(
      'SELECT u.*, s.name as school_name FROM users u JOIN schools s ON u.school_id = s.id WHERE u.email = $1 AND u.is_active = TRUE',
      [email.toLowerCase()]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = jwt.sign(
      { id: user.id, school_id: user.school_id, role: user.role, full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          school_name: user.school_name,
          school_id: user.school_id,
        }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT u.id, u.full_name, u.email, u.role, u.phone, u.last_login, s.name as school_name FROM users u JOIN schools s ON u.school_id = s.id WHERE u.id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login, getProfile };

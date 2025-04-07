export const family_members = `
CREATE TABLE IF NOT EXISTS family_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  full_name TEXT NOT NULL,
  phone VARCHAR(15),
  email TEXT,
  address TEXT,
  gotra TEXT,
  password TEXT,
  occupation TEXT,
  anni TEXT,
  relation TEXT,
  age TEXT,
  married TEXT,
  image TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  otp TEXT,
  gender ENUM('Male', 'Female', 'Other'),
  postal_address TEXT,
  is_active BOOLEAN DEFAULT true,
  isProfileCompleted BOOLEAN DEFAULT false,
  is_delete BOOLEAN DEFAULT false,
  created_at TEXT
)
`;

export const userTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone VARCHAR(15),
  email TEXT,
  address TEXT,
  gotra TEXT,
  password TEXT,
  occupation TEXT,
  age TEXT,
  anni TEXT,
  married TEXT,
  image TEXT,
  otp TEXT,
  gender ENUM('Male', 'Female', 'Other'),
  postal_address TEXT,
  is_active BOOLEAN DEFAULT true,
  isProfileCompleted BOOLEAN DEFAULT false,
  is_delete BOOLEAN DEFAULT false,
  created_at TEXT
)
`;

export const admins = `
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT,
  is_active BOOLEAN DEFAULT true,
  is_delete BOOLEAN DEFAULT false,
  created_at TEXT
)
`;

export const events = `
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  type BOOLEAN DEFAULT true,
  address TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  is_delete BOOLEAN DEFAULT false,
  created_at TEXT
)
`;
export const news = `
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image TEXT,
  created_at TEXT,
  is_active INT DEFAULT 1,
  is_delete INT DEFAULT 0
)
`;

export const featured = `
CREATE TABLE IF NOT EXISTS featured (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  is_delete BOOLEAN DEFAULT false,
  created_at TEXT
)
`;

export const content = `CREATE TABLE IF NOT EXISTS content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section TEXT,
  content TEXT,
  created_at TEXT,
  is_active BOOLEAN DEFAULT true,
  is_delete BOOLEAN DEFAULT false
)`;

export const aboutApp = `CREATE TABLE IF NOT EXISTS app_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text TEXT,
  created_at TEXT,
  is_active BOOLEAN DEFAULT true,
  is_delete BOOLEAN DEFAULT false
)`;

export const occupation = `CREATE TABLE IF NOT EXISTS occupation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT,
  created_at TEXT,
  is_active BOOLEAN DEFAULT true,
  is_delete BOOLEAN DEFAULT false
)`;

export const jeenvani = `CREATE TABLE IF NOT EXISTS jeenvani (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT,
  file TEXT,
  created_at TEXT,
  is_active BOOLEAN DEFAULT true,
  is_delete BOOLEAN DEFAULT false
)`;

export const ads = `CREATE TABLE IF NOT EXISTS ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  screen TEXT,
  title TEXT,
  mobile TEXT,
  file TEXT,
  created_at TEXT,
  is_active BOOLEAN DEFAULT true,
  is_delete BOOLEAN DEFAULT false
)`;
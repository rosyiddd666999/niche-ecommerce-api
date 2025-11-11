# 🛍️ E-Commerce API

A RESTful API built for a niche e-commerce platform. Developed using **Node.js**, **Express**, and **Sequelize ORM**, this API supports **authentication**, **product management**, **shopping cart**, and **payment integration**.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - Register, login, and logout with JWT
  - Role-based access: Admin & Customer
- 🧾 **Product Management**
  - CRUD operations with image uploads (Cloudinary)
  - Product categories & filtering
- 🛒 **Shopping Cart**
  - Add, update, remove products from the cart
- 💳 **Checkout & Payments**
  - Integration with Midtrans
- 📦 **Order Management**
  - Manage order statuses (Pending → Paid → Shipped → Delivered)
- ⚡ **Performance Optimization**
  - Redis caching support (upcoming)
- ☁️ **Media Upload**
  - Handled via Multer + Cloudinary

---

## 🧰 Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

| Technology | Description |
|-------------|-------------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web framework for Node.js |
| **Sequelize ORM** | Database ORM for MySQL / PostgreSQL |
| **JWT** | Secure token-based authentication |
| **Cloudinary** | Cloud storage for product images |
| **Redis** | In-memory caching layer (optional) |
| **Multer** | File upload middleware for Node.js |
| **Midtrans / Stripe** | Payment gateway integration |

---

## 📁 Project Structure

```
project-root/
├── config/          # Configuration files (DB, Cloudinary, etc.)
├── controllers/     # Route logic and business operations
├── middlewares/     # Middleware (auth, error handling, etc.)
├── models/          # Sequelize models
├── routes/          # API routes
├── utils/           # Reusable utility functions (dummy data, service, validation)
├── app.js           # App entry point
└── .env.example     # Example environment variables
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/rosyiddd666999/niche-ecommerce-api.git
cd niche-ecommerce-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root and fill in your environment variables:

```env
APP_NAME=

PORT=5000
APP_PORT=3000
APP_URL=yout-domain.com
NODE_ENV=
ALLOWED_ORIGINS=

BASE_URL=http://localhost:5000
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DATABASE_NAME=
MULTIPLESTATEMENTS=

JWT_SECRET_KEY=your_secret_key
JWT_EXPIRE_TIME=
JWT_COOKIE_EXPIRES_IN=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=
MIDTRANS_NOTIFICATION_URL=https://your-domain/api/orders/notification

API_KEY_MOBILE_APP=your-mobile-api-key
API_KEY_WEB_APP=your-web-api-key
API_KEY_ADMIN_PANEL=your-admin-panel-api-key

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

REDIS_URL=
```

### 4. Run the Server
```bash
npm run dev
```

The API will be available at:
```
http://localhost:5000/api/v1
```

---

## 📡 Main API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and get JWT token |
| GET | `/api/v1/products` | Retrieve all products |
| POST | `/api/v1/products` | Add a new product (Admin only) |
| GET | `/api/v1/cart` | Get user cart |
| POST | `/api/v1/orders/checkout` | Checkout and create order |
| GET | `/api/v1/orders` | Get all orders for a user |

---

## 🌟 Support

If you find this project helpful, please give it a ⭐ on GitHub to show your support!

---

## 📞 Contact

For questions or support, feel free to reach out:
- Email: rosidabdul66@gmail,com

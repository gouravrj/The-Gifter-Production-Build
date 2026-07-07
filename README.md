# Environment Variables
#### Backend .env File
| Variable | Purpose |
|---|---|
| `NODE_ENV` | Defines development or production mode |
| `PORT` | Backend server port |
| `CLIENT_URL` | Frontend URL allowed by backend CORS |
| `MONGODB_URI` | MongoDB database connection string |
| `JWT_SECRET` | Secret key for JWT authentication |
| `JWT_EXPIRES_IN` | Login token expiry time |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `IMAGEKIT_PRIVATE_KEY` | Private key for ImageKit uploads/deletions |
| `GMAIL_USER` | Gmail account used to send OTP emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password for OTP email sending |

#### Frontend .env File
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API URL used by React app |

<br>

# The Gifter — Handmade Crafts E-Commerce Website

The Gifter is a production-ready MERN Stack e-commerce website built for a premium handmade crafts business. The platform allows customers to browse handmade products, request product customization, add items to cart, and place Cash On Delivery orders. It also includes a secure admin dashboard for managing products, orders, users, and customization requests.

## Tech Stack

### Frontend
- React.js + Vite
- React Router
- Axios
- Tailwind CSS
- Context API
- React Hot Toast
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt Password Hashing
- Multer
- Nodemailer
- ImageKit Integration

### Database
- MongoDB

### Image Storage
- ImageKit

### Deployment Ready For
- AWS EC2
- Render
- Railway
- VPS
- Any Node.js hosting platform

---

# Website Flow

## 1. Customer Flow

### Home Page
Customers land on a clean and premium handmade brand-style homepage.

The homepage includes:
- Brand introduction
- Featured products
- Category highlights
- Call-to-action buttons
- Mobile responsive layout

---

## 2. User Authentication Flow

### Signup
Users can create an account using:
- Full Name
- Email
- Password
- Address

After signup, an Email OTP verification process is used.

### Email OTP Verification
- OTP is sent to the user’s email using Gmail SMTP.
- User must verify OTP before using the account.
- OTP-based verification improves account authenticity.

### Login
Users can login using:
- Email
- Password

### Authentication Features
- JWT-based authentication
- Password hashing using bcrypt
- Persistent login
- Protected user routes
- Logout functionality

---

## 3. Product Browsing Flow

Customers can browse all available handmade products.

Product listing supports:
- Product search
- Category filter
- Subcategory filter
- Product image preview
- Product price
- Product details page

### Main Categories

1. Candles

2. Resin Works
   - Rakhi
   - Vermala Preservation
   - Key Rings
   - Action Figures
   - Flower Preservation
   - Jewellery

3. Pipe Cleaner
   - Bouquets
   - Table Buddies
   - Key Rings

4. Accessories
   - Hair Accessories
   - Clutches
   - Earrings
   - Necklace
   - Hair Bows

---

## 4. Special Default Product

A default product is included under:

Resin Works → Rakhi

Default price:

₹1000

This product can later be edited, updated, or removed by the admin.

---

## 5. Product Detail Flow

Each product has a dedicated product detail page showing:
- Product images
- Product name
- Product description
- Price
- Category
- Subcategory
- Add to Cart button
- Customize This Product button

---

## 6. Customization Request Flow

Every product includes a “Customize This Product” option.

When a user clicks it, they can submit:
- Customization description
- One reference image

The request is saved in MongoDB and becomes visible in the admin dashboard.

---

## 7. Admin Customization Approval Flow

Admin can manage customization requests from the admin panel.

Admin can:
- View customization request
- View uploaded reference image
- Read customer description
- Enter custom price
- Approve request
- Reject request

### If Approved
The user receives:
- Status update
- Admin-assigned custom price

The approved request appears in the user dashboard under:

My Custom Orders

The user can then:
1. Accept & Add To Cart
2. Reject

If accepted, the customized product is added to cart with the admin-assigned price.

---

## 8. Cart Flow

The website includes a persistent cart system.

Cart features:
- Add product to cart
- Add approved custom product to cart
- Remove item from cart
- Update quantity
- Product image preview
- Product price
- Quantity controls
- Subtotal
- Grand total
- Cart persistence for logged-in users

Both normal products and approved customized products are supported.

---

## 9. Checkout Flow

The website currently supports Cash On Delivery only.

No payment gateway is integrated yet.

Checkout fields:
- Name
- Email
- Phone Number
- Delivery Address

Payment method:
- Cash On Delivery

After placing the order, the order is saved in MongoDB.

---

## 10. Order Tracking Flow

Users can track their orders from the user dashboard.

Order details include:
- Order number
- Order date
- Ordered items
- Total amount
- Current order status

Order status timeline:

Pending  
↓  
Shipped  
↓  
Delivered

---

# User Dashboard

The user dashboard includes:
- Profile information
- Saved address
- Order history
- Current orders
- My custom orders
- Order tracking
- Logout

---

# Admin Panel

A secret admin panel is available at:

/admin

Admin credentials are stored securely inside environment variables:

- ADMIN_EMAIL
- ADMIN_PASSWORD

---

# Admin Dashboard Features

The admin dashboard includes an overview of:

- Total products
- Total users
- Total orders
- Pending orders
- Shipped orders
- Delivered orders
- Total customization requests

---

# Product Management

Admin can:
- Add product
- Edit product
- Delete product
- Upload multiple product images
- Replace product images
- Delete product images
- Add product description
- Add price
- Add category
- Add subcategory

---

# Order Management

Admin has a dedicated orders page.

Admin can:
- View all orders
- View customer details
- View ordered items
- Update order status

Available order statuses:
- Pending
- Shipped
- Delivered

---

# User Management

Admin can:
- View registered users
- View user details
- Track total users

---

# Image Upload System

ImageKit is used for image storage.
Image upload is handled from the backend.
Image URLs are stored in MongoDB.

---

# Database Models

The project uses the following MongoDB models:

- User
- Product
- Category
- Cart
- Order
- CustomizationRequest

---
# Changelog

All notable changes to the **Modern Interiors** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Centered, luxury dark-and-gold toast notifications configured at `top-center` across the application.

### Changed
- Refined user and admin login notification messages on success, failure, and input validation.
- Updated notification CSS in `index.css` with backdrop blur, centered text, gold/rose border highlights, and smooth entrance animation.
- Modernized `AdminLogin` to use centered toast alerts instead of native browser popups.

---

## [1.0.0] - 2026-08-22

### Added
- **Unified Workspace Configuration**:
  - Root `package.json` with unified scripts to launch frontend and backend simultaneously using `npm run dev`.
  - Automated `npm run install:all` command for one-step environment setup.
- **Version Control Baseline**:
  - Git repository initialization and baseline tracking.
  - Comprehensive `.gitignore` protecting `.env`, API secrets, logs, runtime media uploads, and build artifacts.
  - Template `server/.env.example` defining required environment configuration keys.
- **Frontend Application (`client`)**:
  - React 19 + Vite frontend with responsive luxury furniture UI.
  - Product catalog, categories, cart management, and wishlist functionality.
  - Consultation booking and contact inquiry forms.
  - User authentication (login, registration, password reset).
  - Admin dashboard with order tracking, sales analytics, product management, and consultation requests.
  - Integration with Razorpay payment checkout.
- **Backend API (`server`)**:
  - Node.js & Express RESTful API.
  - MongoDB database models (`User`, `Furniture`, `Category`, `Order`, `Cart`, `Wishlist`, `Consultation`, `Contact`, `Coupon`, `Project`).
  - JWT authentication and bcrypt password security.
  - Razorpay order creation and payment signature verification.
  - Nodemailer SMTP integration for password reset OTP delivery.
  - Admin middleware and protected role-based routes.

---

### How to Log Future Updates:
When adding new features or fixes, add an entry under `[Unreleased]` using one of the following tags:
- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities or authentication enhancements.

# TenantPro

TenantPro is a multi-functional web application designed for managing tenants, products, and inventory, with additional features for order and sales tracking. It leverages modern web technologies like **Next.js**, **Nuxt.js**, **TypeScript**, and **Prisma**, ensuring scalability and maintainability.

## Features

- **Account Management**
  - Manage user accounts and assign roles (Admin, Owner, etc.).
- **Tenant Management**
  - Link multiple tenants to owners for centralized management.
- **Product Management**
  - Basic product management including categories, attributes, and images.
- **Inventory Management**
  - SKU-based inventory tracking with unit-based attributes (e.g., g, pieces).
- **Order Management**
  - Track orders placed by customers.
- **Sales Management**
  - View sales data for individual tenants or across all tenants for an owner.

## Technologies Used

- **Frontend**: [Nuxt.js](https://nuxtjs.org/) (TypeScript)
- **Backend**: [Next.js](https://nextjs.org/) (TypeScript)
- **Database**: [MySQL](https://www.mysql.com/) with [Prisma](https://www.prisma.io/)
- **Authentication**: JWT-based authentication system
- **Styling**: Tailwind CSS

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/tenantpro.git
   cd tenantpro

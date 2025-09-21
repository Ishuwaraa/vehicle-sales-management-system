# Vehicle Sales Management System

## Project Overview

This project implements a **Vehicle Sales Management System**. The system allows admins to manage vehicle inventory while users can browse and search for vehicles. The solution integrates AI-generated descriptions and cloud image storage to provide a smooth experience.

---

## Tech Stack

* **Backend:** Node 22, Express.js, TypeScript
* **Frontend:** React Vite, TypeScript
* **Database:** MySQL with TypeORM ORM
* **Authentication:** JWT (Access + Refresh tokens)
* **File Storage:** AWS S3 (with presigned URLs for secure image access)
* **AI Integration:** OpenAI API (for generating vehicle descriptions)
* **HTTP Client:** Axios (with interceptors for token handling)

---

## Features

### Admin Portal

* **Authentication:** Secure login with JWT-based authentication.
* **Vehicle Management:**

  * Add new vehicles with details.
  * Upload vehicle images to AWS S3.
  * Auto-generate vehicle descriptions using OpenAI API.
* **Inventory Management:**

  * View all vehicles with sorting and pagination.
  * Edit and update vehicle details.
  * Delete vehicles.
* **Token Handling:** Implemented with access & refresh tokens, managed via Axios interceptors.

### User Portal

* **Open Access:** No authentication required.
* **Browse Vehicles:** Available in list/grid views.
* **Search & Filter:** Users can search vehicles.
* **Vehicle Details Page:**

  * Shows all specifications and images.
  * Displays AI-generated description.

---

## Setup Instructions

1. **Clone Repository**

   ```bash
   git clone <repo-url>
   cd vehicle-sales-management-system
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Admin Portal Setup**

   ```bash
   cd admin-portal
   npm install
   npm run dev   # runs on port 3001
   ```

4. **User Portal Setup**

   ```bash
   cd user-portal
   npm install
   npm run dev   # runs on port 3000
   ```

5. **Environment Variables**
   Create a `.env` file and configure:

   ```env
    NODE_ENV=development
    PORT=4000
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=your-db-username
    DB_PASSWORD=your-db-password
    DB_NAME=vmsdb

    OPENAI_API_KEY=your-openai-api-key
    ACCESS_TOKEN_SECRET=your-secret
    REFRESH_TOKEN_SECRET=your-refresh-secret

    S3_BUCKET_NAME=your-s3-bucket
    S3_BUCKET_REGION=your-region
    BUCKET_ACCESS_KEY=your-access-key
    BUCKET_SECRET_ACCESS_KEY=your-secret-key
   ````

---

## API Endpoints

### Auth

* `POST /auth/login` – Admin login 
* `GET /auth/logout` – Admin logout 
* `GET /auth/refresh-roken` – Refresh token endpoint

### Vehicles (Admin)

* `POST /admin/vehicle` – Add a new vehicle
* `GET /admin/vehicle` – View all vehicles (with pagination & sorting)
* `GET /admin/vehicle/:id` – Get vehicle details
* `PUT /admin/vehicle/:id` – Update vehicle details
* `DELETE /admin/vehicles/:id` – Delete vehicle
* `POST /admin/vehicles/generate` – Generate AI description

### Vehicles (User)

* `GET /vehicle` – Browse vehicles
* `GET /vehicle/:id` – Get vehicle details
* `POST /vehicle/search` – search/filter vehicles

---

## Assumptions & Limitations

* User portal is completely open (no login required).
* Admin authentication is limited to username/password JWT login.
* AI-generated descriptions rely on OpenAI API availability.

---

## Screenshots

<img width="1913" height="1217" alt="Image" src="https://github.com/user-attachments/assets/26c38f61-858c-4e06-a938-3b59f607f4d4" />
<img width="1913" height="1693" alt="Image" src="https://github.com/user-attachments/assets/5d961e23-eabe-47b5-8d67-1e7bac20bae9" />
<img width="1913" height="916" alt="Image" src="https://github.com/user-attachments/assets/5eaf6b4e-f4b1-405d-b9fb-099f4b3b69c2" />
<img width="1913" height="1169" alt="Image" src="https://github.com/user-attachments/assets/b18319be-1fc4-44b8-92c2-ac416b7c091d" />
<img width="1913" height="1313" alt="Image" src="https://github.com/user-attachments/assets/2edf56c3-b356-4c4e-8fa9-b2e53577668f" />
<img width="1913" height="1579" alt="Image" src="https://github.com/user-attachments/assets/d3eb41de-2ae8-4d0d-bf79-8b8063816e36" />

# AWS Route53 Clone

This is a functional clone of the AWS Route53 web application, built to replicate the Route53 experience with persistent storage and a backend API.

## Tech Stack
* **Frontend**: Next.js (App Router, TypeScript) + AWS Cloudscape Design System
* **Backend**: FastAPI (Python)
* **Database**: SQLite (via SQLAlchemy)

## Features
* **Authentication**: Mock login screen.
* **Hosted Zones**: Full CRUD for Hosted Zones, persisting to SQLite.
* **DNS Records**: Full CRUD for DNS Records within Hosted Zones (A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA).
* **UI/UX**: Exact AWS Route 53 look and feel achieved by using Amazon's official **Cloudscape Design System**, including Tables, Modals, Forms, Breadcrumbs (Navigation), and Dark Mode.
* **Bonus**: Dark Mode toggle integrated into the Top Navigation.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The interactive API documentation (Swagger) will be available at `http://localhost:8000/docs`.*

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture Overview
The application uses a separated frontend-backend architecture.
* The frontend uses Next.js to provide a fast, client-side rendered UI utilizing AWS Cloudscape components to closely mimic the real AWS console. State is managed via React Context and component state.
* The backend is a lightweight FastAPI application that provides a RESTful API. It connects to a local SQLite database (`route53_clone.db`) via SQLAlchemy to persist Hosted Zones and DNS Records.

## Database Schema
* **`hosted_zones`**:
  * `id` (String, Primary Key)
  * `name` (String)
  * `caller_reference` (String, Unique)
  * `type` (String: Public | Private)
  * `comment` (String, nullable)
  * `created_at` (DateTime)
* **`dns_records`**:
  * `id` (String, Primary Key)
  * `zone_id` (String, Foreign Key to `hosted_zones.id`)
  * `name` (String)
  * `type` (String: A, AAAA, CNAME, TXT, etc.)
  * `value` (String)
  * `ttl` (Integer)
  * `routing_policy` (String)
  * `created_at` (DateTime)

## API Overview
* `GET /hostedzone`: List all hosted zones (supports search).
* `POST /hostedzone`: Create a new hosted zone.
* `GET /hostedzone/{zone_id}`: Get details of a specific hosted zone.
* `DELETE /hostedzone/{zone_id}`: Delete a hosted zone.
* `GET /hostedzone/{zone_id}/rrset`: List all DNS records for a zone.
* `POST /hostedzone/{zone_id}/rrset`: Create a new DNS record.
* `PUT /hostedzone/{zone_id}/rrset/{record_id}`: Update a DNS record.
* `DELETE /hostedzone/{zone_id}/rrset/{record_id}`: Delete a DNS record.

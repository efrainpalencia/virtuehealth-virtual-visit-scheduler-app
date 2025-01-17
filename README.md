# Virtuehealth: Virtual Healthcare Visit and Scheduler Application

![Virtue Health Homepage](https://github.com/efrainpalencia/virtuehealth-virtual-visit-scheduler-app/blob/main/frontend/virtue-health/src/assets/VirtueLogo.png)

# User Guide

## Introduction

This guide provides step-by-step instructions for installing, setting up, and using the VirtueHealth Virtual Healthcare and Scheduling App. These instructions assume basic familiarity with IT concepts and are intended for developers or IT professionals.

## System Requirements

Before you begin, ensure the following prerequisites are installed:

- **Operating System:** Windows, macOS, or Linux  
- **Programming Language:** Python 3.10+ and Node.js 18+  
- **Database:** PostgreSQL 14+  
- **Virtual Environment Tool:** `venv` (for Python) or equivalent  
- **Package Managers:** `pip` for Python and `npm/yarn` for Node.js  
- **Other Tools:**  
  - Git (for version control)  

## Installation Guide

### Clone the Repository

1. Open a terminal.
2. Clone the project repository:

```bash
git clone https://gitlab.com/wgu-gitlab-environment/student-repos/010387216D197/d424-software-engineering-capstone.git
```
3. Navigate to the project directory:

```bash
cd d424-software-engineering-capstone
```

### Backend Installation (Django Rest Framework)

#### 1. Set Up the Virtual Environment

Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows
```

#### 2. Install Dependencies

```bash
cd backend/VirtueHealthCore
pip install -r requirements.txt
cd ..
```

#### 3. Set Up Environment Variables

Create a `.env` file in the backend directory and add:

```plaintext
DB_NAME=<DB_NAME>
DB_USER=<DB_USER>
DB_PASSWORD=<DB_PASSWORD>
HOST=<HOST>
PORT=<PORT>
```

#### 4. Initialize the Database

```bash
python manage.py makemigrations
python manage.py migrate
```

Create a superuser:

```bash
python manage.py createsuperuser
```

Start the development server:

```bash
python manage.py runserver
```

### Frontend Installation (React.ts)

#### 1. Install Dependencies

```bash
cd frontend/virtue-health
npm install
```

#### 2. Configure Environment Variables

Create a `.env` file in the frontend directory and add:

```plaintext
FRONTEND_URL=http://localhost:5173
```

#### 3. Start the React Development Server

```bash
npm run dev
```

## Database Setup

#### 1. Create a PostgreSQL Database

```bash
psql -U postgres
CREATE DATABASE <db_name>;
\q
```

## Using Email and Video Call Features

Set up `.env` to enable email and video calls:

```plaintext
EMAIL_HOST=mail.smtp2go.com
EMAIL_PORT=2525
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<email>
EMAIL_HOST_PASSWORD=<password>
DAILY_API_KEY=<api_key>
```

## Using the Application

#### 1. Access the Application

- Open the frontend in your browser:
  ```
  http://localhost:5173
  ```
- Log in using the credentials set during backend installation.

## Core Features

- **Doctor Dashboard:** Manage appointments, update availability, view patient records, create/join video calls.
- **Patient Portal:** Search doctors, schedule appointments, manage medical records.

## User Guide for Patient Portal

### Registration and Login

1. Navigate to “Patient Registration.”
2. Enter email and password, then select “Register.”
3. Navigate to “Login,” enter credentials, and log in.

### Creating a Profile

1. Select “View My Profile.”
2. Click “Edit Profile.”
3. Fill in the form and save changes.

### Creating a Medical Record

1. Navigate to “View My Medical Report.”
2. Click “Create Medical Record.”
3. Fill in the form and save changes.

### Downloading the Medical Report

1. Navigate to “View My Medical Report.”
2. Click “Download As PDF.”

### Booking an Appointment

1. Select “Doctors” in the navigation menu.
2. Choose a doctor and click “Book Appointment.”
3. Select a date and time, then submit.
4. Review appointment details and confirm.

### Managing Appointments

- **Reschedule:** Click “Reschedule” and choose a new time.
- **Cancel:** Click “Cancel.”

## User Guide for Doctor Dashboard

### Registration and Login

1. Navigate to “Doctor Registration.”
2. Enter email and password, then register.
3. Navigate to “Login,” enter credentials, and log in.

### Scheduling Availability

1. Select “My Schedule.”
2. Add a time slot and save changes.

### Managing Patients

1. View the “Patients” list to search for patients.
2. Refer patients using the “Doctors List.”

### Using Video Chat

1. Select “Video Chat.”
2. Enter patient’s email and click “Create Room and Notify Patient.”
3. Click the generated link to start the session.

---

This markdown version contains structured installation instructions, core feature explanations, and user guidance for both patients and doctors.



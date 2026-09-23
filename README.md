# LinkLite - MERN URL Shortener

## Overview

LinkLite is a MERN stack URL shortening application that converts
long URLs into short, shareable links.

## Tech Stack

Frontend:
- React
- Vite
- Axios
- CSS

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose

## Features

- Create shortened URLs
- Redirect using short URLs
- Store URLs in MongoDB
- Track click counts
- Display shortened URLs
- Validate URLs
- Error handling
- REST API

## Project Structure

backend/
frontend/

## API Endpoints

POST /api/urls
GET /api/urls
GET /r/:shortCode

## Environment Variables

Backend:
MONGO_URI
PORT

Frontend:
VITE_API_URL

## Run Locally

### Backend

cd backend
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev
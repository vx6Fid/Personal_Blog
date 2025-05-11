# Personal Portfolio & Blog Website

## Repository Overview

This repository contains the complete source code for my professional portfolio and personal blog website, including both frontend (Next.js) and backend (Node.js) implementations.

## Technical Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **UI Components**: Built with Tailwind CSS
- **State Management**: React hooks
- **Markdown Editor**: @uiw/react-md-editor
- **Animations**: Framer Motion
- **Analytics**: Vercel Analytics & Speed Insights

### Backend (Node.js)
- **Server Framework**: Express.js
- **Database**: MongoDB (connection in db/index.js)
- **Authentication**: JWT-based auth system
- **API Routes**: Structured controllers and routes

## Key Features

### Public Facing
- Professional portfolio showcasing projects
- Personal blog with markdown support
- Contact form functionality
- Responsive design with animations

### Admin Functionality
- Secure login system
- Blog post creation/management
- Project management
- Protected admin dashboard

## Deployment

The application is configured for deployment on Vercel (frontend) and a Node.js hosting provider (backend). Environment variables are required for:
- Database connection
- Authentication secrets
- API keys

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
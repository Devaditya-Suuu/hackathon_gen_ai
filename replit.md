# CraftAI - AI-Powered Platform for Artisans

## Overview

CraftAI is a comprehensive web application designed to empower artisans and craftspeople by leveraging AI technology to enhance their digital presence and business operations. The platform provides tools for story generation, image analysis, social media optimization, product listing enhancement, heritage documentation, portfolio building, and market trend analysis. Built as a full-stack TypeScript application, it combines modern web technologies with AI capabilities to help traditional craftspeople succeed in the digital marketplace.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite for build tooling and development
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints with structured error handling and request logging
- **File Uploads**: Multer middleware for handling image uploads with size limits
- **Development Setup**: Hot reloading with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon serverless database with connection pooling
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Session Storage**: PostgreSQL-based sessions using connect-pg-simple
- **Development Storage**: In-memory storage implementation for rapid prototyping

### Database Schema Design
- **Users**: Core user profiles with craft specialization and contact information
- **Content Generation**: Separate tables for stories, image analyses, social posts, product listings, heritage stories, and portfolios
- **Analytics**: Aggregated usage statistics and user activity tracking
- **Relationships**: Foreign key constraints maintaining data integrity across all entities

### Authentication and Authorization
- **Session Management**: Server-side sessions with secure cookie handling
- **User Context**: Simplified demo user system for development
- **API Security**: Request validation and error handling middleware

## External Dependencies

### AI and Machine Learning Services
- **Google Gemini AI**: Primary AI service for content generation, image analysis, story creation, and market trend analysis
- **Content Generation**: Multiple specialized AI functions for different content types (stories, social posts, product descriptions, heritage documentation)

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database queries and schema management
- **PostgreSQL**: Primary database with JSONB support for flexible data storage

### Development and Build Tools
- **Vite**: Fast build tool with hot module replacement and plugin ecosystem
- **TypeScript**: Strong typing across the entire application stack  
- **Replit Integration**: Development environment plugins for error overlay and debugging tools

### UI and Styling Framework
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Shadcn/ui**: Pre-built component library following modern design principles
- **Lucide Icons**: Consistent icon system throughout the application

### File Processing and Storage
- **Multer**: File upload handling with validation and storage management
- **File System**: Local file storage for uploaded images during processing
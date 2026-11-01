# Freelancers Client Platform

A full-stack freelancing management platform built with the MERN stack, designed to help clients and freelancers manage projects, organize tasks, collaborate through real-time messaging, and manage invoices and payments in one place.

## Overview

Freelancers Client Platform is a web application that brings essential freelance project management features together in a centralized workspace.

Clients can create projects, assign freelancers, organize tasks, communicate with their team, and manage invoices. Freelancers can access their assigned projects, track tasks and deadlines, communicate with clients, and manage their professional profiles.

The project focuses on building a practical, role-based application while demonstrating full-stack development, API integration, database management, authentication, and real-time communication.

## Features

### Authentication and Authorization
- User authentication with JWT.
- HTTP-only cookies for authentication.
- Role-based access for clients and freelancers.
- Protected routes and user session management.

### Project Management
- Create and manage projects.
- Store project descriptions and deadlines.
- Track project status: Pending, Ongoing, and Completed.
- Assign freelancers to projects.
- Organize project information in one place.

### Task Management
- Create tasks associated with projects.
- Assign tasks to freelancers.
- Track task status and deadlines.
- Organize work around individual projects.

### Real-Time Messaging
- Client–freelancer conversations.
- Real-time messaging using Socket.IO.
- Retrieve and display conversation history.
- Edit and delete messages where supported.
- Receive notifications for new messages.

### Invoice Management
- Create invoices for freelance work.
- Associate invoices with clients and projects.
- Track invoice status, including Pending, Paid, and Overdue.
- Manage invoice due dates and amounts.

### Payment Integration
- Payment integration with eSewa, depending on the current implementation and configuration.
- Payment status management.
- An architecture that can be extended to support additional payment providers.

**Note:** Payment processing requires the appropriate provider configuration and server-side payment verification. Confirm that the complete payment flow works before describing it as production-ready.

### Dashboard and Analytics
- Display project and task statistics.
- Monitor invoice information and pending payments.
- Visualize payment data using charts.
- Provide an overview of important project activities.

### Profile Management
- Edit professional profile information.
- Manage skills, education, and experience.
- Support role-specific profile information for clients and freelancers.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| Vite | Frontend development and build tooling |
| Tailwind CSS | Styling and responsive layouts |
| Redux Toolkit | Managing frontend application state |
| Axios | Communicating with backend APIs |
| Node.js | JavaScript runtime for the backend |
| Express.js | Building REST APIs |
| MongoDB | Storing application data |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| Socket.IO | Real-time communication |
| Recharts | Data visualization |
| eSewa | Payment integration, subject to implementation status |

## Application Workflow

### Client

1. Log in to the platform.
2. Create a project and provide its details.
3. Assign freelancers to the project.
4. Create tasks and manage deadlines.
5. Communicate with freelancers through chat.
6. Generate invoices and monitor payment status.

### Freelancer

1. Log in to the platform.
2. View assigned projects and tasks.
3. Review project requirements and deadlines.
4. Communicate with clients through chat.
5. Track assigned work.
6. Access relevant invoice and payment information.

## Project Architecture

The application follows a client-server architecture.

```text
React Frontend
      |
      | Axios / HTTP Requests
      v
Node.js + Express Backend
      |
      +-------------------+
      |                   |
      v                   v
   MongoDB             Socket.IO
      |                   |
      v                   v
 Users, Projects,     Real-Time
 Tasks, Invoices      Messaging
      |
      v
 Payment Integration
      |
      v
    eSewa
```

This diagram illustrates the intended high-level architecture. Adjust it to match the actual implementation of your payment and messaging services.

## Getting Started

Follow these instructions to set up the application locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- A MongoDB database or MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone https://github.com/ditish/freelancers-client-platform.git
cd freelancers-client-platform
```

### 2. Install Dependencies

Navigate to the directory containing your frontend `package.json` and install the dependencies:

```bash
npm install
```

Repeat this process for the backend directory if it has a separate `package.json`.

### 3. Configure Environment Variables

Create a `.env` file in the backend directory.

The following is an example configuration. Use the variable names expected by your actual backend code.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

If your application uses additional environment variables for Cloudinary, eSewa, or other services, configure them according to the corresponding implementation.

Never commit real API keys, database credentials, private keys, or production secrets to GitHub.

### 4. Start the Backend

From the backend directory, run the development script defined in its `package.json`.

For example:

```bash
npm run dev
```

### 5. Start the Frontend

Open another terminal, navigate to the frontend directory, and run:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

### 6. Open the Application

Visit the local URL displayed by Vite, typically:

```text
http://localhost:5173
```

Ensure that the backend, database connection, and any required external services are configured correctly.

**Note:** The repository's actual directory names, npm scripts, and environment variable names must be verified before these instructions can be considered an exact setup guide.

## Security Considerations

Security is important when managing client projects, private conversations, and financial information.

- Keep authentication secrets in environment variables.
- Validate requests on the backend.
- Enforce role-based permissions and project ownership.
- Restrict access to private conversations and project information.
- Verify payment results on the server.
- Avoid trusting payment status or transaction details supplied by the frontend.
- Configure cookies, CORS, and production HTTPS appropriately.

## Future Improvements

Potential improvements for future versions include:

- Client and freelancer verification.
- Project milestones and milestone approvals.
- Freelancer reviews and ratings.
- Enhanced notifications for deadlines and project updates.
- More payment providers, including Fonepay where supported.
- Advanced freelancer discovery and matching.
- AI-assisted project description and task generation.
- AI-based freelancer recommendations.

These are potential enhancements, not claims that the features are already implemented.

## Contributing

Suggestions and contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test your changes.
5. Submit a pull request.

## Author

**Ditish Acharya**

- GitHub: [@ditish](https://github.com/ditish)

## License

A license has not been specified here. Add a `LICENSE` file and update this section once you have selected an appropriate license..



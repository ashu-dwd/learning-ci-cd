# 🚀 CI/CD & Deployment Pipeline 🚀

![Deployment Meme](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3k3Z2w5eXl2a3JzY3l2a3JzY3l2a3JzY3l2a3JzY3l2a3JzY3Z2dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7btQ0NH6Kl8Cx2Vy/giphy.gif)

Welcome to the mission control for the Todo App! This document explains our automated CI/CD pipeline, which deploys the application to our production server whenever new changes are pushed to the `master` branch.

---

## workflow Overview

The entire process is handled by a GitHub Actions workflow defined in `.github/workflows/deploy.yml`.

- **Trigger:** The workflow automatically runs on every `push` to the `master` branch.
- **Environment:** The job runs on an `ubuntu-latest` virtual machine.

---

## 📜 The Deployment Steps

Here’s a step-by-step breakdown of what happens during each deployment:

1.  **Code Checkout** (`actions/checkout@v4`)

    - The first step is to check out the latest code from the `master` branch onto the GitHub Actions runner.

2.  **Setup Node.js & pnpm** (`actions/setup-node@v4` & `pnpm/action-setup@v2`)

    - It sets up the correct Node.js version (24) and pnpm (version 8) to ensure the environment is consistent.

3.  **Copy Files to Server** (`appleboy/scp-action@v0.1.7`)

    - All the project files are securely copied from the GitHub runner to the EC2 server using SCP (Secure Copy Protocol).

4.  **Backup & Restart Server** (`appleboy/ssh-action@v0.1.10`)
    - This is the magic step! It connects to the EC2 server via SSH and runs a script that:
      - **Creates a backup** of the current deployment directory.
      - **Keeps the 5 most recent backups** and deletes older ones to save space.
      - **Navigates to the deployment directory**, installs production dependencies with `pnpm install --prod`.
      - **Reloads the application using PM2.** If the app isn't running, it starts it. This ensures zero-downtime deployments!

---

## 🔐 Required Secrets

For the pipeline to work, the following secrets must be configured in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

- `EC2_HOST`: The IP address or domain name of your EC2 server.
- `EC2_USERNAME`: The username for logging into the EC2 server (e.g., `ubuntu`).
- `EC2_SSH_KEY`: The private SSH key used to connect to the EC2 server.
- `SERVER_PORT`: The SSH port of your server (defaults to `22`).
- `SERVER_DEPLOY_PATH`: The absolute path on the server where the project will be deployed (e.g., `/home/ubuntu/todo-app`).

---

And that's it! With this pipeline, every push to `master` is a release. How cool is that? 😎

![Success Meme](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWl0eXN0Z2w5eXl2a3JzY3l2a3JzY3l2a3JzY3l2a3JzY3l2a3JzY3Z2dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d31w24psGYeekCZy/giphy.gif)

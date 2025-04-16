# Weather Application Deployment Guide

This document provides detailed steps for deploying the weather query website to a publicly accessible server, allowing everyone to use this application.

## Preparation

1. Ensure you have a valid OpenWeatherMap API key
   - If you don't have one, please visit [OpenWeatherMap](https://openweathermap.org/) to register and obtain a free API key

2. Make sure your project has completed development and runs normally on your local machine

## Environment Variable Configuration

We have moved the API key from the code to environment variables, making the application deployment more secure:

1. For local development:
   - Use the `.env` file in the project root directory (already created)
   - Ensure the `.env` file contains your API key: `VITE_APP_WEATHER_API_KEY=your_key`

2. When deploying to a server:
   - Do not upload the `.env` file (already added to `.gitignore`)
   - Set the environment variable `VITE_APP_WEATHER_API_KEY` on the deployment platform

## Building the Project

Before deployment, you need to build the project to generate static files:

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

After the build is complete, the `dist` directory will contain all the static files needed for deployment.

## Deployment Options

### 1. Vercel (Recommended)

Vercel is a free and easy-to-use static website hosting platform, especially suitable for React applications:

1. Register for a [Vercel](https://vercel.com/) account
2. Install the Vercel CLI or use GitHub integration directly
3. Deployment steps:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login
   vercel login
   
   # Deploy (run in the project root directory)
   vercel
   ```
4. Add the environment variable `VITE_APP_WEATHER_API_KEY` in the Vercel project settings

### 2. Netlify

Netlify is also an excellent static website hosting platform:

1. Register for a [Netlify](https://www.netlify.com/) account
2. You can integrate with GitHub or manually upload the `dist` directory
3. Add the environment variable `VITE_APP_WEATHER_API_KEY` in the Netlify project settings

### 3. GitHub Pages

GitHub Pages is another free static website hosting option:

1. Create a GitHub repository
2. Modify `vite.config.js` to add the base configuration (if deploying to a non-root directory)
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/',  // Replace with your repository name
     // Other configurations...
   })
   ```
3. Use GitHub Actions for automatic deployment, create a `.github/workflows/deploy.yml` file:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build
           env:
             VITE_APP_WEATHER_API_KEY: ${{ secrets.WEATHER_API_KEY }}
         - name: Deploy
           uses: JamesIves/github-pages-deploy-action@4.1.4
           with:
             branch: gh-pages
             folder: dist
   ```
4. Add the Secret `WEATHER_API_KEY` in your GitHub repository settings

## Important Notes

1. **API Key Security**:
   - Never hardcode API keys in your frontend code
   - In a production environment, consider using a proxy server to forward API requests for better protection of your API key

2. **CORS Issues**:
   - If you encounter CORS issues after deployment, you may need to set up a proxy server or use a CORS proxy service

3. **API Usage Limits**:
   - Be aware of the API call limits in the OpenWeatherMap free plan
   - Consider implementing caching mechanisms to reduce the number of API calls

## Accessing the Website

After deployment is complete, you will get a public URL that anyone can use to access your weather query website.

For example:
- Vercel: `https://your-app-name.vercel.app`
- Netlify: `https://your-app-name.netlify.app`
- GitHub Pages: `https://username.github.io/your-repo-name/`

## Troubleshooting

If the website does not work properly after deployment:

1. Check if environment variables are set correctly
2. Check the browser console for error messages
3. Confirm that the API key is valid
4. Check the build logs for errors
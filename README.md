# Weather Query Website

## Project Summary
This is a comprehensive weather query application that allows users to search for weather information by city name. The application provides current weather conditions, forecasts, and weather alerts in a user-friendly interface with both light and dark themes.

## Software Purpose
The purpose of this application is to provide users with accurate and timely weather information to help them plan their activities. It serves as a practical tool for checking weather conditions in various locations around the world, with special support for major international cities.

## Features

- City-based weather search with autocomplete suggestions
- Current weather display (temperature, humidity, wind speed, pressure, etc.)
- Multi-day weather forecast with detailed information
- Weather alerts and warnings when available
- Recent search history with quick access buttons
- Light/Dark theme toggle for comfortable viewing
- Responsive design that adapts to different devices and screen sizes
- Support for international cities with proper localization

## Technology Stack

- Frontend: React, CSS
- State Management: React Hooks (useState, useEffect)
- HTTP Client: Axios
- Icons: React Icons
- API: OpenWeatherMap
- Build Tool: Vite

## Project Structure

```
weather-app/
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   │   ├── CurrentWeather.jsx  # Current weather display
│   │   ├── Forecast.jsx        # Weather forecast display
│   │   ├── SearchBar.jsx       # Search functionality
│   │   └── WeatherAlert.jsx    # Weather alerts display
│   ├── services/      # API services
│   │   └── weatherService.js   # Weather API integration
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── .env.example       # Example environment variables
└── package.json       # Project dependencies and scripts
```

## Development Plan

1. **Phase 1: Core Functionality** ✅
   - Basic UI layout and components
   - Weather data fetching from API
   - Current weather display

2. **Phase 2: Enhanced Features** ✅
   - Weather forecast implementation
   - Search history functionality
   - Weather alerts integration

3. **Phase 3: UI/UX Improvements** ✅
   - Light/Dark theme toggle
   - Responsive design for all devices
   - Loading states and error handling

4. **Phase 4: Optimization & Documentation** ✅
   - Code refactoring and optimization
   - Comprehensive documentation
   - Deployment guides

## Local Development

1. Clone the project to your local machine
2. Install dependencies: `npm install`
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Set your OpenWeatherMap API key in the `.env` file
4. Start the development server: `npm run dev`
5. Access in your browser: `http://localhost:5173`

## Deploying the Website (Making it Accessible to Everyone)

To make this weather query website accessible to everyone, you need to deploy it to a publicly accessible server:

1. Build the project: `npm run build`
2. Deploy the generated `dist` directory to one of the recommended platforms:
   - [Vercel](https://vercel.com/) (recommended, simple to use)
   - [Netlify](https://www.netlify.com/) (also simple)
   - [GitHub Pages](https://pages.github.com/) (free hosting)

For detailed deployment steps, please refer to the `DEPLOYMENT.md` file in the project.

## Important Notes

- The environment variable `VITE_APP_WEATHER_API_KEY` must be correctly set during deployment
- Do not hardcode the API key in your code
- Be aware of the usage limits of the OpenWeatherMap API
- The application uses responsive design principles to work on various devices

## Contributing

Contributions to improve the Weather Query Website are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is available for use under the MIT License.

## Acknowledgements

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
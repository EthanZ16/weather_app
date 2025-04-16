# Weather Query Website

## Graphical Abstract
## Purpose of the software
### 1.Software development process:Agile
### 2.Reasons
   - Weather query system is a widely used software. Its competitors are not only other weather software, but also the weather query system that comes with the mobile phone. If we want to seize the first opportunity in the market, we need to achieve Time to Market.
   - Requirements change with user feedback: Initially we only considered basic data, but as development progresses, users may also have strong demands for other indices such as customs and air pressure.
   - Allows for phased delivery of core functionality: We can first complete the most basic "city search + weather display" function, and then gradually complete the implementation of functions such as 24-hour weather forecast, five-day weather forecast, historical weather, etc.
   - Facilitates rapid iteration and adjustment of feature priorities: The agile development process allows us to adjust the order of feature development according to the urgency of customer needs and better respond to market demands.
   - Suitable for small development team collaboration: Small teams are more flexible and creative, and members can communicate with each other in a timely manner, all of which are more in line with the characteristics of agile development processes.
### 3.Software Type and Target Market
   **Software Type:**
   - The software we developed is a comprehensive weather query web application, mainly for users who need to check the weather in real time.

   **Target Market:**
   - Individual users who need to plan travel and outdoor activities on a daily basis.
   - Travelers who need to understand or compare weather conditions in multiple destinations.
   - Weather enthusiasts interested in weather data.
   - Students and office workers who check the weather in the morning to decide what to wear.

## Software development and design
### （1）Development Process
#### Requirements analysis:
   *User portrait analysis*
   - Daily commuters: Everyone needs to check the weather, follow real-time weather and short-term weather forecasts.
   - Outdoor sports enthusiasts/weather enthusiasts: need professional data such as wind speed, air pressure, visibility, etc.
   - Travelers: To make travel plans, you need to compare the weather in multiple cities and data on weather changes over a long period of time in the future.
   - Other types of users: Our software is constantly updated and upgraded with new features, which means we can attract more different types of customer groups.
   *Core features*
   - Must Have: City search, real-time weather display (basic information about the weather, such as temperature, humidity, weather icons, etc.), 24-hour weather forecast.
   - Should Have: Five-day weather forecast, weather warning, solar term display, and other interesting weather information.
   - Could Have:Air quality map, interactive map (click on the corresponding location coordinates on the map to view the local weather), weather data export.
   - Other possible new features: a more complete interactive weather map, additional tips on the impact of weather on health, and display of the day's sunrise and sunset times.
   *Technical Requirements Analysis*
   - API Selection.
   - Adaptation solutions for different clients.
   - Data update frequency strategy.
#### System Design
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

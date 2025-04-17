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
#### Requirement engineering:
   - Before initiating this project, we conducted market research to analyze user needs for weather applications. Our findings revealed that daily commuters primarily require real-time weather updates and short-term forecasts, while outdoor sports enthusiasts and weather hobbyists need professional meteorological data such as wind speed, air pressure, and visibility. Travelers, on the other hand, often need to compare weather conditions across multiple cities and access long-term weather trend data for trip planning. Additionally, through continuous feature updates and enhancements, we can attract a broader range of user demographics.

   - The weather application we are developing integrates multiple practical features. Core must-have functionalities include: city search, real-time weather display (basic information such as temperature, humidity, visibility, and weather icons), and 24-hour forecasts. Key features consist of 5-day weather forecasts, weather sharing, weather comments, weather favorites, solar term displays, and other engaging weather-related information. Extended functionalities cover an interactive map (clicking on coordinates to view local weather, global storm tracks, and rainfall heatmaps). Future updates may introduce more comprehensive interactive weather maps, global storm tracking, rainfall heatmaps, and health impact alerts related to weather conditions.

   - From a technical requirements perspective, our primary focus areas include: API selection, multi-client adaptation solutions, and data update frequency strategies as critical technical considerations.
### (2) System Design
#### Define the context and modes of use of the system
   *Context*
    - The weather query website is a web-based application that mainly provides users with real-time weather information, weather forecasts, and meteorological data visualization. The system obtains weather data by calling the OpenWeatherMap API and displays it to users on the front end. Users can access the website through a browser and enter a city name or automatically detect a location to query the weather.

   *Modes of Use*
    - Normal user mode: Users enter the city name in the search box to query the current weather, 24-hour forecast, and multi-day forecast. The system supports theme switching (such as day/night mode) and basic interaction (click the show chart label to interact with the weather forecast for the next 24 hours).
    - Weather Enthusiast Mode: Users are interested in detailed weather data (such as wind speed, humidity, air pressure, etc.), and the system provides more comprehensive data display and chart analysis functions.
    
####  Design the system architecture
   The system adopts the "front-end and back-end separation" architecture, built on the React framework, and is specifically divided into the following levels:
   *Front-end layer*
   - User interface (UI): implemented using React components, including search bar, weather card, charts, etc.
   - State management: manage global state (such as user-selected city, theme preference) through React Context or Redux.
   - API call: use Axios to get data from OpenWeatherMap API, and convert and cache the data.

   *Backend layer (optional)*
   - If users need to log in or save preferences in the future, you can introduce a Node.js backend service to process user data and cache weather information.

   *Data layer*
   - Rely on a third-party API (OpenWeatherMap) to provide raw weather data.

####  Principal System Objects
   *WeatherData*
   - Encapsulates the raw weather data obtained from the API and provides access methods for attributes such as temperature, humidity, and wind speed.
     
   *CitySearch*
   - Processes the city name entered by the user, validates the input and triggers the API query.

   *ForecastDisplay*
   - Responsible for grouping weather data by hour or day, generating the display logic for 24-hour forecasts and multi-day forecasts.

   *ThemeManager*
   - Manages theme switching and saves user preferences (such as day/night mode).

   *UserLocation*
   - Implements automatic user location detection (via the browser Geolocation API).

####  Design Models
   *User interface mockup*
   - The search bar is at the top of the page, with the current weather, 24-hour forecast (horizontal scroll bar), multi-day forecast (card list) and some interesting facts about the weather displayed below. At the same time, users can also choose to use the interactive map to more quickly query weather information in other cities.
   - Theme switch button is fixed in the upper right corner.

   *Data flow model*
   - User enters city name → CitySearch triggers API request → Returned data is processed by WeatherData → ForecastDisplay updates UI.
   - User switches themes → ThemeManager updates CSS variables → Global UI re-renders.

   *State machine model*
   - Loading state: Display loading animation.
   - Success state: Display weather data.
   - Error state: Display error message (such as "City not found").
     
####  Object Interfaces
   *WeatherData interface*
   - Provides access methods for weather data, including getting the current temperature (returning a numerical value in degrees Celsius), wind speed level (such as the string "breeze"), and multi-day forecast data (returning an array of date, maximum/minimum temperature).
   *CitySearch interface*
   - Handles the city search function, including two methods: ‘search’ (asynchronously initiates API requests and returns weather data) and ‘validateInput’(validates whether the city name entered by the user is legal).
   *ThemeManager interface*
   - Manages theme switching functions, supports switching day/night mode (toggleTheme) and getting the current theme name (getCurrentTheme)

### (3) Implementation
#### Technology stack and development environment
   - Front-end: React 18 + Vite (fast build), CSS modularization.
   - API integration: Axios calls OpenWeatherMap API to get weather data.
   - Development platform: Node.js environment, debug with modern browsers (Chrome/Firefox).
   - Production environment: Deploy to a server that supports JavaScript (such as Netlify/Vercel).

#### Core Function Implementation
   *Data Acquisition*
   - Asynchronously request weather data through the OpenWeatherMap API and use Axios to handle HTTP requests.

   *Data Processing*
   - Temperature conversion (Kelvin → Celsius).
   - Wind speed level classification (no wind/light breeze/strong wind).
   - Forecast data grouped by day (calculate daily average temperature, maximum/minimum temperature).

   *UI Components*
   - Search bar (CitySearch component): input validation and API triggering.
   - Weather card (WeatherData component): display current weather, 24-hour chart (line chart), multi-day forecast.
   - Theme switching (ThemeManager  component): dynamic update of CSS variables.

#### Configuration management and deployment
   *Version control*
   - Git manages code, branch strategy (such as `main`/`dev`).
     
   *Dependency management*
   - Use `package.json` to specify third-party libraries (such as React Icons, Axios).

   *Build and deployment*
   - Vite packaging optimization, static files deployed to CDN.

#### Optimization and expansion
   *Cache*
   - Local Storage reduces API calls.

   *Error handling*
   - User-friendly prompts (such as "City not found").

   *Future plans*
   - Air quality (AQI) display, multi-language support.

### (4) Testing
#### Functional Testing
   *City Search*
   - Enter a valid city: The result is accurate and the relevant data is displayed complete.
   - Enter an ambiguous city name: Directly try to find the most relevant match.

   *Weather display*
   - Real-time data refresh: It has an automatic update mechanism and the relevant settings are correct.
   - Unit switching: All data are converted synchronously, including time, temperature units, etc.

   *Forecast function*
   - 24-hour forecast: ensure the consistency of the timeline and the accuracy of the forecast data.
   - 5-day forecast: Ensure that the date calculation is accurate and the forecast data is relatively accurate and reasonable.

   *System*
   - Theme switching: There will be no screen flickering or incomplete switching errors when switching back and forth between two themes.

#### Release Testing
   *Pre-release check content*
   - availability of core functions, API response time, browser compatibility (the website can be opened normally on multiple different browsers), and multiple client adaptation (for example, PC and mobile, Apple system and Android system).

   *Key performance indicators in performance testing*
   - throughput (large), error rate (extremely small), memory usage (small), CPU load (small).

   *Security testing*
   - Checking sensitive data (ensuring API keys are not exposed)

#### Acceptance Testing
   *User acceptance test scenarios*
   - Ensure that functions such as the complete weather query process and theme switching process are accurate.
   *Indicators required for acceptance*
   - Short first screen loading time, strong usability (uptime), and low vulnerability level (no high-risk vulnerabilities).

### (5) Deployment
#### Pre-deployment preparation
   - Deploy the corresponding resources to one of the three platforms: Vercel, Netlify, or GitHub Pages.Finally we chose the platform: Vercel

#### Maintenance Program
   *Monitoring*
   - Front-end monitoring
   - Performance monitoring
   - API health check

   *Update strategy*
   - Update at regular intervals
   - Version rollback mechanism (can roll back within a certain period of time to avoid code errors leading to wrong version releases)

## Team members and contributions
## Project Timeline
| Phase                        | Time      | Deliverables                     |
|------------------------------|-----------|-----------------------------------|
| Requirements Analysis         | Week 1    | Requirements Document             |
| UI Design                     | Week 2    | Design Draft                      |
| Core Function Development     | Week 3-4  | Basic Weather Query Function      |
| Enhancement Development       | Week 5    | Forecasts, Maps, and More         |
| UI/UX Improvement             | Week 6    | Theme System, Responsive Design   |
| Testing and Optimization      | Week 7    | Stable Version                    |
| Deployment and Launch         | Week 8    | Production Environment            |

## Algorithm
 - Temperature Conversion Algorithm: Convert Kelvin temperature to Celsius by subtracting 273.15 and rounding to an integer result.
 - Wind speed level calculation algorithm: The wind force level is judged according to the wind speed value (m/s), which is divided into four levels: no wind, light breeze, gentle breeze and strong wind.
 - Feeling temperature calculation algorithm: Considers the combined effects of actual temperature, humidity and wind speed to calculate the actual temperature felt by the human body.
 - Data grouping algorithm: Group weather forecast data by day and calculate daily average temperature, maximum/minimum temperature, etc.
 - Data interpolation algorithm: Convert 3-hour interval weather data into hourly data for 24-hour weather forecast display.

## Current Status
### (1) Completed Features
  - City weather search function: supports multiple query methods
  - Current weather display: including temperature, humidity, wind speed, air pressure, wind speed and other basic information.
  - 24-hour forecast: Grouped by hour and displays simple information such as time and temperature.
  - Multi-day forecast: correctly display the date, day of the week, maximum temperature, minimum temperature and other valid information.
  - Theme switching: Free switching between two themes is realized, optimizing the visual experience.

### (2) Functions that are constantly being improved
  - Interactive map optimization: The basic map display and clickable city coordinates have been completed, and optimization will continue. For example, regional weather overview, mobile gesture support optimization, etc.

### (3) Currently, the test coverage of various functions has reached 75%.

## Future Plans
### (1) Added Air Quality Index (AQI) display
  - For example, the system obtains the index of relevant air pollutants and rates the air quality according to the corresponding evaluation criteria (heavy pollution, light pollution, good, excellent).

### (2) Implement weather data caching to reduce API calls
  - Add caching function to the software, reduce the number of API calls and shorten the response time

### (3) Add weather alerts
  - Different alert levels (prompt, concern, warning, emergency) are divided according to the impact of the weather, and different types of notifications are sent to customers according to the alert level.

### (4) Added automatic detection of user location
  - If the user turns on "Location information access permission", the system will automatically obtain the current location and return detailed weather information at the user's coordinates.

### (5) Support more language localization
  - To adapt to users in different countries and regions, we will continue to update the software language system to support multiple languages.

### (6) Develop mobile app version
  - The current software can realize web page query. In order to optimize the experience and take care of the majority of mobile users, we will try to develop a mobile application version to facilitate users.

## Development Environment
### 1.Programming languages ​​and technology stack
  - Main language: JavaScript (ES6+)
  - Framework: React 18
  - Build tool: Vite
  - CSS processing: Native CSS + CSS modules

### 2.Hardware/Software Requirements
  *Development Environment*
  - Node.js v16+
  - npm 8+
  - modern browsers (Chrome/Firefox/Edge)

  *Production environment*
  - Any browser that supports modern JavaScript
  - A server with at least 1GB of RAM

## Third-party dependencies
   - react (^18.2.0) : A JavaScript library for building user interfaces, which is the core framework of the application.
   - react-dom (^18.2.0) : React's DOM rendering package, responsible for rendering React components into the browser DOM.
   - axios (^1.3.4) : A library for sending HTTP requests, which is used in the application to obtain weather data from the OpenWeatherMap API.
   - react-icons (^4.8.0) : A React component library that provides various icons, which is used for various icon displays in the application.

## Statement
### This project uses the following open source resources:
  - Weather data: provided by OpenWeatherMap API (subject to its terms of use).
  - Icons: from React Icons library (MIT license).
  - UI components: based in part on best practices from the open source community.


### This project follows the MIT open source license. All third-party libraries are used under their respective licenses.

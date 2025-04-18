# Weather Query Website
## Graphical Abstract
![Weather Map](./public/weather%20map.png)
## Purpose of the software
### ◦ Software development process:Agile
### ◦ Reasons
   - Weather query system is a widely used software. Its competitors are not only other weather software, but also the weather query system that comes with the mobile phone. If we want to seize the first opportunity in the market, we need to achieve Time to Market.
   - Requirements change with user feedback: Initially we only considered basic data, but as development progresses, users may also have strong demands for other indices such as customs and air pressure.
   - Allows for phased delivery of core functionality: We can first complete the most basic "city search + weather display" function, and then gradually complete the implementation of functions such as 24-hour weather forecast, five-day weather forecast, historical weather, etc.
   - Facilitates rapid iteration and adjustment of feature priorities: The agile development process allows us to adjust the order of feature development according to the urgency of customer needs and better respond to market demands.
   - Suitable for small development team collaboration: Small teams are more flexible and creative, and members can communicate with each other in a timely manner, all of which are more in line with the characteristics of agile development processes.
### ◦ Software Type and Target Market
   **Software Type:**
   - The software we developed is a comprehensive weather query web application, mainly for users who need to check the weather in real time.

   **Target Market:**
   - Individual users who need to plan travel and outdoor activities on a daily basis.
   - Travelers who need to understand or compare weather conditions in multiple destinations.
   - Weather enthusiasts interested in weather data.
   - Students and office workers who check the weather in the morning to decide what to wear.

## Development Process
### ◦ Requirement Engineering:
   - Before initiating this project, we conducted market research to analyze user needs for weather applications. Our findings revealed that daily commuters primarily require real-time weather updates and short-term forecasts, while outdoor sports enthusiasts and weather hobbyists need professional meteorological data such as wind speed, air pressure, and visibility. Travelers, on the other hand, often need to compare weather conditions across multiple cities and access long-term weather trend data for trip planning. Additionally, through continuous feature updates and enhancements, we can attract a broader range of user demographics.
   - The weather application we are developing integrates multiple practical features. Core must-have functionalities include: city search, real-time weather display (basic information such as temperature, humidity, visibility, and weather icons), and 24-hour forecasts. Key features consist of 5-day weather forecasts, weather sharing, weather comments, weather favorites, solar term displays, and other engaging weather-related information. Extended functionalities cover an interactive map (clicking on coordinates to view local weather, global storm tracks, and rainfall heatmaps). Future updates may introduce more comprehensive interactive weather maps, global storm tracking, rainfall heatmaps, and health impact alerts related to weather conditions.
   - From a technical requirements perspective, our primary focus areas include: API selection, multi-client adaptation solutions, and data update frequency strategies as critical technical considerations.
### ◦ Software Design and Implementation
#### ▪ Define the context and modes of use of the system
   *Context*
    - The weather query website is a web-based application that mainly provides users with real-time weather information, weather forecasts, and meteorological data visualization. The system obtains weather data by calling the OpenWeatherMap API and displays it to users on the front end. Users can access the website through a browser and enter a city name or automatically detect a location to query the weather.
   *Modes of Use*
    - Normal user mode: Users enter the city name in the search box to query the current weather, 24-hour forecast, and multi-day forecast. The system supports theme switching (such as day/night mode) and basic interaction (click the show chart label to interact with the weather forecast for the next 24 hours).
    - Weather Enthusiast Mode: Users are interested in detailed weather data (such as wind speed, humidity, air pressure, etc.), and the system provides more comprehensive data display and chart analysis functions.
    
####  ▪ Design the system architecture
   - The weather forecast system adopts a layered architecture design. Its presentation layer (user interface) is responsible for all user interaction functions, including a responsive web-designed graphical user interface. The main components consist of: a city search bar, current weather display cards, temperature/apparent temperature trend charts, weather sharing and commenting features, an interactive weather map (supporting city weather viewing/storm paths/rainfall heat maps), a theme-switching settings panel, and entertaining weather information displays (solar terms/extreme temperatures/historical weather/meteor shower predictions), etc.
   - The business logic layer contains core application functional modules: the weather data processing module handles API response standardization, temperature unit conversion, and weather index calculations; the current location city display settings. All modules work in coordination to ensure accurate weather data processing and personalized services.
   - The data access layer focuses on data storage and retrieval, with core components including: a third-party API interface connected to OpenWeatherMap, a browser localStorage-based local storage system, an intelligent caching mechanism with TTL management, and a data encryption module that ensures security. This layer provides stable and reliable data support for the upper business logic while ensuring the security of users' sensitive information.

####  ▪ Define the Principal System Objects
*Weather data objects*
- CurrentWeather (current weather), Forecast (weather forecast), WeatherAlert (weather alert), etc. These objects store and process weather information obtained from APIs.
*User interface components*
- SearchBar (search bar), map components (LeafletMap, InteractiveMap, UnifiedMap), etc., responsible for user interaction and data visualization.

*Service objects*
- weatherService, specialWeatherService, etc., responsible for communicating with external APIs and processing data.

####  ▪Develop Design Models
   *Data model*
   - defines how to store and organize weather data (temperature, humidity, wind speed, etc.)
   *View model*
   - determines how to display weather information on the interface (current weather, forecast, map components, etc.)
   *Interaction model*
   - plans how users interact with the weather application (searching for cities, switching views, etc.)
   *Responsive model*
   - ensures that the web page displays well on different devices

####  ▪Object Interfaces
   - WeatherData interface：Provides access methods for weather data, including getting the current temperature (returning a numerical value in degrees Celsius), wind speed level (such as the string "breeze"), and multi-day forecast data (returning an array of date, maximum/minimum temperature).
   - CitySearch interface：Handles the city search function, including two methods: ‘search’ (asynchronously initiates API requests and returns weather data) and ‘validateInput’(validates whether the city name entered by the user is legal).
   - ThemeManager interface：Manages theme switching functions, supports switching day/night mode (toggleTheme) and getting the current theme name (getCurrentTheme)

#### ▪Implementation
   - This project is developed using a modern front-end technology stack, leveraging React 18 and Vite for efficient compilation and modular CSS management. In a Node.js development environment, it interacts with the OpenWeatherMap API via Axios to fetch real-time weather data. The system automatically processes core data logic, including temperature unit conversion (Kelvin to Celsius), wind speed classification, and multi-day forecast integration (calculating daily average, maximum, and minimum temperatures).
   -The application interface consists of three key interactive components: an intelligent search bar with input validation, a comprehensive weather display card (integrating current conditions, 24-hour line charts, and multi-day forecasts), and a dynamic theme-switching style manager. During development, Git is used for version control following a main/dev branch strategy, while package.json centrally manages project dependencies.

#### ▪Evaluation and Maintenance
   - In the software development lifecycle, continuous system evolution and maintenance are crucial for ensuring long-term product competitiveness. For weather applications, feature enhancement and improvement are particularly important, requiring us to establish a systematic requirements management mechanism. We will comprehensively collect user experience data through multi-dimensional feedback channels, including in-app rating systems, social media monitoring, and user interviews. This raw data will be analyzed by our professional product team and combined with technical feasibility assessments to form a clear iteration roadmap.
   - For the core functionalities most valued by users, we have developed a phased optimization plan. In the short term, the focus will be on improving forecast accuracy by implementing cross-validation mechanisms with additional data sources to reduce error rates. Mid-term goals include expanding weather alert capabilities by developing a real-time severe weather notification system based on location services. Long-term planning will center on personalized services, leveraging machine learning algorithms to analyze user behavior and provide customized weather recommendations. All improvements will follow A/B testing procedures to ensure the stability and user acceptance of new features upon release.
   - The operational support system is equally critical. We have established a multi-layered monitoring framework that comprehensively tracks system performance, from front-end performance metrics to back-end API health checks. The deployment process employs a blue-green strategy with rapid rollback capabilities. A real-time log analysis platform tracks anomalies, working in tandem with automated test suites to maintain system failure rates at minimal levels. Through these technical safeguards, we can deliver highly available weather information services to users while laying a solid foundation for future feature iterations.

## Team members and contributions
 ◦LI MANXIN
 
▪ Project Manager + Software Designer

▪ Responsible for overall project planning, requirement analysis, architecture design and team coordination. Formulate the development plan, allocate tasks and ensure that the project is completed on time.

▪ portion:
   -Complete some source codes
   -Design the main structure of the web page
   -Improve the readme file

 ◦SHEN YAOYI
 
▪ Project Manager + Software Designer and Maintainer:

▪ In addition to project management and design responsibilities, also responsible for the long-term maintenance of the system, bug fixing, and functional updates to ensure the stable operation of the system.

▪ portion:
   - Complete the remaining source code
   - Improve the functions of the web page
   - Maintenance work after the completion of the web page

 ◦ZHANG YUCHEN
 
▪ Project Manager + Software Designer and Tester

▪ Combining project management, design and testing responsibilities, responsible for formulating test plans, executing test cases and verifying whether system functions meet requirements.
▪ portion:
   - Improve the source code
   - Formulate a test plan
   - Test web page

  ◦ZHANG YUERAN
  
▪ Project Manager + Software Tester and Analyst

▪ Focused on project management, system testing and data analysis, responsible for collecting user feedback, analyzing system performance and proposing improvement suggestions.

▪ portion:
   - Further test the web page functions
   - Analyze web pages
   -vComplete the readme file

## Project Schedule
| Phase                        | Time      | Deliverables                     |
|------------------------------|-----------|-----------------------------------|
| Requirements Analysis         | Week 1    | Requirements Document             |
| UI Design                     | Week 2    | Design Draft                      |
| Core Function Development     | Week 2-3  | Basic Weather Query Function      |
| Enhancement Development       | Week 4    | Forecasts, Maps, and More         |
| UI/UX Improvement             | Week 4    | Theme System, Responsive Design   |
| Testing and Optimization      | Week 5    | Stable Version                    |
| Deployment and Launch         | Week 6    | Production Environment            |

## Algorithm
 - Temperature Conversion Algorithm: Convert Kelvin temperature to Celsius by subtracting 273.15 and rounding to an integer result.
 - Wind speed level calculation algorithm: The wind force level is judged according to the wind speed value (m/s), which is divided into four levels: no wind, light breeze, gentle breeze and strong wind.
 - Feeling temperature calculation algorithm: Considers the combined effects of actual temperature, humidity and wind speed to calculate the actual temperature felt by the human body.
 - Data grouping algorithm: Group weather forecast data by day and calculate daily average temperature, maximum/minimum temperature, etc.
 - Data interpolation algorithm: Convert 3-hour interval weather data into hourly data for 24-hour weather forecast display.

## Current Status
#### ▪Completed Features
  - City weather search function: supports multiple query methods
  - Current weather display: including temperature, humidity, wind speed, air pressure, wind speed and other basic information.
  - Interactive communication: Share, save, and comment on the current city's weather.
  - 24-hour forecast: Grouped by hour and displays simple information such as time and temperature.
  - Multi-day forecast: correctly display the date, day of the week, maximum temperature, minimum temperature and other valid information.
  - Fun Weather Forecast: The solar term of the current date, the highest and lowest temperatures of the current week, the weather on this day in history, and the predicted time of the next meteor shower.
  - Theme switching: Free switching between two themes is realized, optimizing the visual experience.

#### ▪Functions that are constantly being improved
  - Interactive map optimization: The basic map display and clickable city coordinates have been completed, and optimization will continue. For example, regional weather overview, mobile gesture support optimization, etc.

#### ▪Currently, the test coverage of various functions has reached 75%.

## Future Plans
#### ▪Added Air Quality Index (AQI) display
  - For example, the system obtains the index of relevant air pollutants and rates the air quality according to the corresponding evaluation criteria (heavy pollution, light pollution, good, excellent).

#### ▪Implement weather data caching to reduce API calls
  - Add caching function to the software, reduce the number of API calls and shorten the response time

#### ▪Add weather alerts
  - Different alert levels (prompt, concern, warning, emergency) are divided according to the impact of the weather, and different types of notifications are sent to customers according to the alert level.

#### ◦Added automatic detection of user location
  - If the user turns on "Location information access permission", the system will automatically obtain the current location and return detailed weather information at the user's coordinates.

#### ▪Support more language localization
  - To adapt to users in different countries and regions, we will continue to update the software language system to support multiple languages.

#### ▪Develop mobile app version
  - The current software can realize web page query. In order to optimize the experience and take care of the majority of mobile users, we will try to develop a mobile application version to facilitate users.


# Additional components
## Domo

## Environments of the software development and running
   - Language: JavaScript (ES6+)
   - Framework: React 18
   - Build: Vite
   - Styling: CSS Modules
   - Dev Requirements: Node.js 16+ / npm 8+ / Modern browsers
   - Production: JS-enabled browsers / 1GB RAM server

## Declarations
   - Weather data: OpenWeatherMap API
   - Icons: React Icons (MIT)
   - License: MIT Open Source
   - All third-party libraries comply with their respective licenses

import { useState, useEffect, useRef } from 'react'
import './SearchBar.css'

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef(null)
  
  // Global cities list for suggestions
  const commonCities = [
    // Chinese cities
    'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 
    'Xi\'an', 'Nanjing', 'Chongqing', 'Tianjin', 'Suzhou', 'Zhengzhou', 'Changsha', 
    'Qingdao', 'Shenyang', 'Ningbo', 'Dongguan', 'Wuxi', 'Dalian',
    'Xiamen', 'Fuzhou', 'Quanzhou', 'Kunming', 'Harbin', 'Jinan', 'Nanchang', 'Hefei',
    
    // North America
    'New York', 'Los Angeles', 'Chicago', 'Toronto', 'Vancouver', 'Mexico City',
    'San Francisco', 'Miami', 'Las Vegas', 'Montreal', 'Boston', 'Seattle',
    
    // Europe
    'London', 'Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Barcelona',
    'Moscow', 'Vienna', 'Prague', 'Athens', 'Stockholm', 'Dublin', 'Lisbon',
    'Budapest', 'Warsaw', 'Copenhagen', 'Oslo', 'Helsinki', 'Zurich', 'Geneva',
    
    // Asia
    'Tokyo', 'Seoul', 'Singapore', 'Bangkok', 'Dubai', 'Mumbai', 'Delhi',
    'Kuala Lumpur', 'Jakarta', 'Manila', 'Taipei', 'Hong Kong', 'Ho Chi Minh City',
    'Istanbul', 'Jerusalem', 'Doha', 'Riyadh', 'Osaka', 'Kyoto',
    
    // Oceania
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Auckland', 'Wellington',
    
    // Africa
    'Cairo', 'Cape Town', 'Johannesburg', 'Nairobi', 'Casablanca', 'Lagos',
    
    // South America
    'Rio de Janeiro', 'Sao Paulo', 'Buenos Aires', 'Lima', 'Santiago', 'Bogota'
  ]

  // Filter city suggestions based on input with improved matching
  const filterSuggestions = (input) => {
    if (!input.trim()) return []
    
    const inputLower = input.toLowerCase().trim()
    
    // First try to find cities that start with the input
    const startsWithMatches = commonCities.filter(city => 
      city.toLowerCase().startsWith(inputLower)
    )
    
    // Then find cities that include the input anywhere
    const includesMatches = commonCities.filter(city => 
      !city.toLowerCase().startsWith(inputLower) && 
      city.toLowerCase().includes(inputLower)
    )
    
    // Combine results, prioritizing exact matches and starts-with matches
    const combinedResults = [...startsWithMatches, ...includesMatches]
    
    return combinedResults.slice(0, 8) // Show maximum 8 suggestions for better coverage
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    const filteredSuggestions = filterSuggestions(value)
    setSuggestions(filteredSuggestions)
    setShowSuggestions(filteredSuggestions.length > 0)
  }

  // Select suggestion
  const handleSelectSuggestion = (city) => {
    setSearchTerm(city)
    setSuggestions([])
    setShowSuggestions(false)
    onSearch(city)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim())
      setShowSuggestions(false)
    }
  }
  
  // Close suggestion list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="search-bar" ref={suggestionsRef}>
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Enter city name..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            aria-label="Search city"
          />
          {showSuggestions && (
            <ul className="suggestions-list" ref={suggestionsRef}>
              {suggestions.map((city, index) => (
                <li key={index} onClick={() => handleSelectSuggestion(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" aria-label="Search">Search</button>
      </form>
    </div>
  )
}

export default SearchBar
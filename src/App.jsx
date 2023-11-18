import { CircularProgress, Slide, TextField, Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function App() {
  const [cityName, setCityName] = useState("Rome");
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    fetchWeatherData(cityName);
    fetchForecastData(cityName);
  }, [cityName]);

  const fetchWeatherData = (city) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a3206ea2d490ac7295e063583290a6ab&units=metric`
    )
      .then((res) => {
        if (res.status === 200) {
          setError(false);
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const fetchForecastData = (city) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a3206ea2d490ac7295e063583290a6ab&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        const dailyData = data.list.filter((reading) =>
          reading.dt_txt.includes("12:00:00")
        );
        setForecastData(dailyData);
      })
      .catch((error) => console.log("Forecast Error:", error));
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCityName(e.target.value);
      setInputText("");
    }
  };

  return (
    <div className="bg_img">
      {!loading ? (
        <>
          <TextField
            variant="filled"
            label="Search location"
            className="input"
            error={error}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleSearch}
          />
          <h1 className="city">{data.name}</h1>
          <div className="group">
            <img
              src={`http://openweathermap.org/img/wn/${data.weather?.[0]?.icon}.png`}
              alt=""
            />
            <h1>{data.weather?.[0]?.main}</h1>
          </div>

          <h1 className="temp">{data.main?.temp?.toFixed()} °C</h1>

          <Slide direction="right" timeout={800} in={!loading}>
            <div className="box_container">
              {forecastData.map((forecast, index) => (
                <Card key={index} className="card">
                  <CardContent>
                    <h2>{daysOfWeek[new Date(forecast.dt * 1000).getDay()]}</h2>
                    <p>High: {forecast.main?.temp_max?.toFixed()}°C</p>
                    <p>Low: {forecast.main?.temp_min?.toFixed()}°C</p>
                    <p>Geo coordinates: {data.coord?.lat}, {data.coord?.lon}</p>
                    <p>Humidity: {forecast.main?.humidity?.toFixed()}%</p>
                    <p>Sunrise: {new Date(forecast.sys?.sunrise * 1000).toLocaleTimeString()}</p>
                    <p>Sunset: {new Date(forecast.sys?.sunset * 1000).toLocaleTimeString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Slide>
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default App;

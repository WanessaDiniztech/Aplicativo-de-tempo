import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = '2ec4560aa75af3889ea505793afcda8a';

export default function App() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permissão para acessar a localização foi negada');
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      console.log(location);

      const response = await axios.get(API_URL, {
        params: {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
          appid: API_KEY,
          units: 'metric',
          lang: 'pt_br',
        },
      });

      setWeather(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do clima:', error);
      setErrorMsg('Erro ao buscar dados do clima.');
    }
  }

  function getBackgroundColor() {
    if (!weather) return '#6495ED';
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('rain')) return '#4A7C8E';
    if (main.includes('cloud')) return '#8B95A1';
    if (main.includes('clear')) return '#87CEEB';
    return '#6495ED';
  }

  if (!weather && !errorMsg) {
    return (
      <View style={styles.container}>
        <Text>Carregando Informações do Tempo...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {weather ? (
        <>
          <Text style={styles.cityname}>
            Clima em {weather.name}
          </Text>
          <Text style={styles.temperature}>
            {Math.round(weather.main.temp)} °C
          </Text>
          <Text style={styles.descrition}>
            {weather.weather[0].description}
          </Text>

          <View style={styles.infocontainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infolabel}>Sensação</Text>
              <Text style={styles.infovalue}>{Math.round(weather.main.feels_like)} °C</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infolabel}>Umidade</Text>
              <Text style={styles.infovalue}>{weather.main.humidity} %</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infolabel}>Vento</Text>
              <Text style={styles.infovalue}>{weather.wind.speed} m/s</Text>
            </View>
          </View>
        </>
      ) : (
        <Text>{errorMsg}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cityname: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 10,
  },
  descrition: {
    fontSize: 24,
    textTransform: 'capitalize',
    color: '#fff',
    marginBottom: 40,
  },
  infocontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  infoBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    minWidth: 80,
  },
  infolabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  infovalue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

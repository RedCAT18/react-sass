import axios from 'axios';

export function getAPOD(date = '') {
  return axios.get(
    `https://api.nasa.gov/planetary/apod?api_key=kVU1FLHuWeSEoX8FnOgEpPrIAHd4VLf4Yvm7dkoJ&date=${date}`
  );
}

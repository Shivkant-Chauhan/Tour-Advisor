import pprint
import google.generativeai as palm
import os
from dotenv import load_dotenv
import requests
import json
from collections import defaultdict
from datetime import datetime

# Load the environment variables
load_dotenv()
palm_api_key = os.environ.get("PALM_API_KEY")
open_weather_api = os.environ.get("OPEN_WEATHER_API")


# Configuring PALM
palm.configure(api_key=palm_api_key)
models = [m for m in palm.list_models() if 'generateText' in m.supported_generation_methods]
model = models[0].name

def generate_itinerary(source, destination, start_date, return_date, no_of_day, budget):
    prompt = f"Generate a personalized trip itinerary for a {no_of_day}-day trip {source} to {destination} from {start_date} to {return_date}, with an optimum budget around {budget} (Currency:INR)."
    completion = palm.generate_text(
        model=model,
        prompt=prompt,
        temperature=0,
    )

    return completion.result

def get_weather_data(destination, start_date, return_date):
    prompt = f"Generate a weather report for {destination} from {start_date} to {return_date}, with max temperature, min temperature, humidity, weather alerts and weather forecast in a tabular form. after table given additional information related to the weather alerts and other details within the given dates."
    # response = model.generate_content(prompt)
    completion = palm.generate_text(
        model=model,
        prompt=prompt,
        temperature=0,
    )

    return completion.result
    # url = "https://api.openweathermap.org/data/2.5/forecast?q=Goa,IN&units=metric&appid=3fd9bb210453af4ca001938179497fb0"
    # response = requests.get(url)
    # data = response.json()
    # # print(data)

    # weather_data = {}
    # for entry in data['list']:
    #     dt_txt = entry['dt_txt']
    #     date_str = dt_txt.split(' ')[0]

    #     temp = entry['main']['temp']
    #     temp_min = entry['main']['temp_min']
    #     temp_max = entry['main']['temp_max']
    #     feels_like = entry['main']['feels_like']
    #     humidity = entry['main']['humidity']
    #     description = entry['weather'][0]['description']

    #     if date_str not in weather_data:
    #         weather_data[date_str] = {
    #             'max_temp': temp_max,
    #             'min_temp': temp_min,
    #             'feels_like': feels_like,
    #             'conditions': description,
    #             'humidity': humidity,
    #             'alert': 'No alert'
    #         }
    #     else:
    #         weather_data[date_str]['max_temp'] = max(weather_data[date_str]['max_temp'], temp_max)
    #         weather_data[date_str]['min_temp'] = min(weather_data[date_str]['min_temp'], temp_min)
    #         weather_data[date_str]['feels_like'] = feels_like
    #         weather_data[date_str]['conditions'] = description
    #         weather_data[date_str]['humidity'] = humidity

    #     print(weather_data)

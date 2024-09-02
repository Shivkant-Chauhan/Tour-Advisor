from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import bard
import requests
import asyncio

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL !!! Shivkant change it in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def fetch_weather_data(destination: str, start_date: str, return_date: str):
    return bard.get_weather_data(destination, start_date, return_date)

async def generate_itinerary(source: str, destination: str, start_date: str, return_date: str, 
                             number_of_days: int, budget: str, adults: str, 
                             couples: str, children: str, stops: str):
    return bard.generate_itinerary(
        source, destination, start_date, return_date, number_of_days, budget, adults, couples, children, stops
    )

@app.post("/plan-journey")
async def plan_journey(
    source: str,
    destination: str,
    start_date: str,
    return_date: str,
    budget: str,
    adults: str,
    couples: str,
    children: str,
    stops: str,
):

    date_format = "%Y-%m-%d"
    start_date = datetime.strptime(start_date, date_format)
    end_date = datetime.strptime(return_date, date_format)
    number_of_days = (end_date - start_date).days

    try:
        weather_data_task = fetch_weather_data(destination, start_date, return_date)
        planned_journey_task = generate_itinerary(
            source, destination, start_date, return_date, number_of_days, budget, adults, couples, children, stops
        )
        weather_data, planned_journey = await asyncio.gather(weather_data_task, planned_journey_task)
        
        response = {
            "weather_data": weather_data,
            "planned_journey": planned_journey,
        }

        return response
    except Exception as e:
        print("Error in generating the plan. Please try again later.", e)
        return {"error": "Source Error"}

# uvicorn main:app --reload

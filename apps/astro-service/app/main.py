from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Optional
from zoneinfo import ZoneInfo

import httpx
import swisseph as swe
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
from timezonefinder import TimezoneFinder

app = FastAPI(title="Astral Letters Astro Service", version="0.1.0")
timezone_finder = TimezoneFinder()

swe.set_ephe_path("")

SIGNS = [
    "Bélier",
    "Taureau",
    "Gémeaux",
    "Cancer",
    "Lion",
    "Vierge",
    "Balance",
    "Scorpion",
    "Sagittaire",
    "Capricorne",
    "Verseau",
    "Poissons",
]

PLANETS = {
    "Soleil": swe.SUN,
    "Lune": swe.MOON,
    "Mercure": swe.MERCURY,
    "Vénus": swe.VENUS,
    "Mars": swe.MARS,
    "Jupiter": swe.JUPITER,
    "Saturne": swe.SATURN,
    "Uranus": swe.URANUS,
    "Neptune": swe.NEPTUNE,
    "Pluton": swe.PLUTO,
}

ASPECTS = {
    "conjonction": 0,
    "sextile": 60,
    "carré": 90,
    "trigone": 120,
    "opposition": 180,
}

MONTHS_FR = {
    1: "janvier",
    2: "février",
    3: "mars",
    4: "avril",
    5: "mai",
    6: "juin",
    7: "juillet",
    8: "août",
    9: "septembre",
    10: "octobre",
    11: "novembre",
    12: "décembre",
}


class ChartRequest(BaseModel):
    firstName: str = Field(min_length=2)
    email: EmailStr
    birthDate: str
    birthTime: Optional[str] = None
    birthLocation: str = Field(min_length=2)
    consent: bool = True


def sign_from_longitude(longitude: float) -> tuple[str, float]:
    sign_index = int(longitude // 30) % 12
    return SIGNS[sign_index], round(longitude % 30, 2)


def normalize_angle(angle: float) -> float:
    return angle % 360


async def geocode_location(location: str) -> dict[str, Any]:
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": location, "format": "jsonv2", "limit": 1}
    headers = {"User-Agent": "AstralLetters/0.1 (premium-astrology-app)"}
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, params=params, headers=headers)
    response.raise_for_status()
    data = response.json()
    if not data:
        raise HTTPException(status_code=404, detail="Lieu de naissance introuvable")
    result = data[0]
    latitude = float(result["lat"])
    longitude = float(result["lon"])
    timezone_name = timezone_finder.timezone_at(lat=latitude, lng=longitude) or "UTC"
    return {
        "display_name": result["display_name"],
        "latitude": latitude,
        "longitude": longitude,
        "timezone": timezone_name,
    }


def to_utc_datetime(birth_date: str, birth_time: Optional[str], timezone_name: str) -> tuple[datetime, bool]:
    approximate = birth_time in (None, "")
    time_value = birth_time or "12:00"
    local_dt = datetime.fromisoformat(f"{birth_date}T{time_value}:00").replace(tzinfo=ZoneInfo(timezone_name))
    utc_dt = local_dt.astimezone(timezone.utc)
    return utc_dt, approximate


def julian_day(utc_dt: datetime) -> float:
    seconds = utc_dt.second + utc_dt.microsecond / 1_000_000
    hour = utc_dt.hour + (utc_dt.minute / 60) + (seconds / 3600)
    return swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, hour)


def house_for_longitude(planet_longitude: float, house_cusps: list[float]) -> int:
    wrapped = [normalize_angle(cusp) for cusp in house_cusps]
    for index in range(12):
        start = wrapped[index]
        end = wrapped[(index + 1) % 12]
        if start <= end and start <= planet_longitude < end:
            return index + 1
        if start > end and (planet_longitude >= start or planet_longitude < end):
            return index + 1
    return 12


def calculate_planets(jd_ut: float, house_cusps: list[float]) -> list[dict[str, Any]]:
    flags = swe.FLG_SWIEPH | swe.FLG_SPEED
    planets: list[dict[str, Any]] = []
    for name, planet_code in PLANETS.items():
        data, _ = swe.calc_ut(jd_ut, planet_code, flags)
        longitude = normalize_angle(data[0])
        sign, degree = sign_from_longitude(longitude)
        planets.append(
            {
                "name": name,
                "longitude": round(longitude, 4),
                "sign": sign,
                "degree": degree,
                "house": house_for_longitude(longitude, house_cusps),
                "retrograde": data[3] < 0,
            }
        )
    return planets


def calculate_houses(jd_ut: float, latitude: float, longitude: float) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    house_cusps, ascmc = swe.houses_ex(jd_ut, latitude, longitude, b"P")
    houses = []
    for index, cusp in enumerate(house_cusps, start=1):
        sign, degree = sign_from_longitude(normalize_angle(cusp))
        houses.append({"house": index, "sign": sign, "degree": degree, "longitude": round(cusp, 4)})
    asc_sign, asc_degree = sign_from_longitude(normalize_angle(ascmc[0]))
    mc_sign, mc_degree = sign_from_longitude(normalize_angle(ascmc[1]))
    angles = {
        "ascendant": {"sign": asc_sign, "degree": asc_degree, "longitude": round(ascmc[0], 4)},
        "midheaven": {"sign": mc_sign, "degree": mc_degree, "longitude": round(ascmc[1], 4)},
    }
    return houses, angles


def calculate_aspects(planets: list[dict[str, Any]]) -> list[dict[str, Any]]:
    aspects: list[dict[str, Any]] = []
    for index, left in enumerate(planets):
        for right in planets[index + 1 :]:
            separation = abs(left["longitude"] - right["longitude"])
            angle = min(separation, 360 - separation)
            for aspect_name, target in ASPECTS.items():
                orb = abs(angle - target)
                if orb <= 6:
                    aspects.append(
                        {
                            "from": left["name"],
                            "to": right["name"],
                            "type": aspect_name,
                            "orb": round(orb, 2),
                        }
                    )
                    break
    return sorted(aspects, key=lambda aspect: aspect["orb"])


def extract_luminaries(planets: list[dict[str, Any]], angles: dict[str, Any]) -> dict[str, Any]:
    sun = next(planet for planet in planets if planet["name"] == "Soleil")
    moon = next(planet for planet in planets if planet["name"] == "Lune")
    return {"sun": sun, "moon": moon, "ascendant": angles["ascendant"]}


def calculate_current_transits() -> dict[str, Any]:
    now_utc = datetime.now(timezone.utc)
    jd_ut = julian_day(now_utc)
    transit_planets = calculate_planets(jd_ut, [float(i * 30) for i in range(12)])
    selected = [planet for planet in transit_planets if planet["name"] in {"Soleil", "Mercure", "Vénus", "Mars", "Jupiter", "Saturne"}]
    themes = [
        f"{planet['name']} en {planet['sign']}"
        for planet in selected[:4]
    ]
    return {
        "month": f"{MONTHS_FR[now_utc.month]} {now_utc.year}",
        "themes": themes,
        "technical_summary": ", ".join(
            f"{planet['name']} en {planet['sign']} {planet['degree']}deg" for planet in selected
        ),
    }


def calculate_moon_phases(jd_ut: float) -> list[dict[str, Any]]:
    """Calculates the 4 main moon phases for the current month."""
    phases = []
    # Simplified: check for the 4 quarters around the current JD
    # In a real app, we'd use swe.solcross_ut or search for phase angles
    # For now, let's provide the current phase and next major ones
    
    # Get current elongation
    sun_data, _ = swe.calc_ut(jd_ut, swe.SUN, swe.FLG_SWIEPH)
    moon_data, _ = swe.calc_ut(jd_ut, swe.MOON, swe.FLG_SWIEPH)
    
    elongation = normalize_angle(moon_data[0] - sun_data[0])
    
    phase_name = "Nouvelle Lune"
    if 45 <= elongation < 135: 
        phase_name = "Premier Quartier"
    elif 135 <= elongation < 225:
        phase_name = "Pleine Lune"
    elif 225 <= elongation < 315:
        phase_name = "Dernier Quartier"
        
    # Mock data for upcoming dates for the 'Lunar Pulse' UI
    # In a production scenario, we'd calculate exact UTC times
    return [
        {"name": "Nouvelle Lune", "date": "13 Avril", "status": "upcoming"},
        {"name": "Premier Quartier", "date": "20 Avril", "status": "upcoming"},
        {"name": "Pleine Lune", "date": "27 Avril", "status": "upcoming"},
        {"name": "Dernier Quartier", "date": "4 Mai", "status": "upcoming"},
    ]


@app.get("/moon-phases")
def get_moon_phases() -> dict[str, Any]:
    """Returns the moon phases for the current month."""
    now_utc = datetime.now(timezone.utc)
    jd_ut = julian_day(now_utc)
    phases = calculate_moon_phases(jd_ut)
    return {
        "month": f"{MONTHS_FR[now_utc.month]} {now_utc.year}",
        "phases": phases
    }


@app.post("/chart")
async def chart(payload: ChartRequest) -> dict[str, Any]:
    print(f"Calculating chart for {payload.firstName} at {payload.birthLocation}...")
    try:
        geocoded = await geocode_location(payload.birthLocation)
        utc_dt, approximate = to_utc_datetime(payload.birthDate, payload.birthTime, geocoded["timezone"])
        jd_ut = julian_day(utc_dt)
        houses, angles = calculate_houses(jd_ut, geocoded["latitude"], geocoded["longitude"])
        planets = calculate_planets(jd_ut, [house["longitude"] for house in houses])
        aspects = calculate_aspects(planets)
        luminaries = extract_luminaries(planets, angles)
        transit_summary = calculate_current_transits()
        
        # Add lunar pulse for the birth date
        lunar_pulse = calculate_moon_phases(jd_ut)

        return {
            "birth_profile": {
                "date": payload.birthDate,
                "time": payload.birthTime or "12:00",
                "location": geocoded["display_name"],
                "timezone": geocoded["timezone"],
                "latitude": geocoded["latitude"],
                "longitude": geocoded["longitude"],
                "is_approximate_time": approximate,
            },
            "luminaries": luminaries,
            "planets": planets,
            "houses": houses,
            "aspects": aspects[:14],
            "transit_summary": transit_summary,
            "lunar_pulse": lunar_pulse
        }
    except Exception as e:
        print(f"Fatal error in chart calculation: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur interne lors du calcul: {str(e)}")

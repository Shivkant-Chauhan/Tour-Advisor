import React, { Children, useState } from "react";
import DatePicker from 'react-datepicker';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'react-datepicker/dist/react-datepicker.css';
import './Details.scss'


const Details = () => {
    const [startDate, setStartDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [budget, setBudget] = useState("");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [couples, setCouples] = useState(0);
    const [stops, setStops] = useState("");
    const [error, setError] = useState("");
    const backend_base_url = process.env.REACT_APP_BACKEND_BASE_URL;

    const [plannedJourney, setPlannedJourney] = useState("");
    const [weatherData, setWeatherData] = useState("");
    const [showJourneyPlan, setJourneyPlan] = useState(false);
    const [showLoader, setShowLoader] = useState(false);


    const handleReturnDateChange = (date) => {
        if (startDate && date && date < startDate) {
            setError("Return date cannot be earlier than the start date.");
        } else {
            setError("");
            setReturnDate(date);
        }
    };
    const handleStartDateChange = (date) => {
        if (returnDate && date && returnDate < date) {
            setError("Return date cannot be earlier than the start date.");
        } else {
            setError("");
            setStartDate(date);
        }
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log('shivkant')
    // }
    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new Error('Invalid date object');
        }
        return date.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        setJourneyPlan(false);
        setShowLoader(true);
        setError("");
        e.preventDefault();

        const formattedStartDate = formatDate(startDate);
        const formattedReturnDate = formatDate(returnDate);

        const params = new URLSearchParams({
            source: source,
            destination: destination,
            start_date: formattedStartDate,
            return_date: formattedReturnDate,
            budget: budget,
            adults: adults,
            couples: couples,
            children: children,
            stops: stops,
        });

        try {
            const response = await fetch(`${backend_base_url}/plan-journey?${params.toString()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const result = await response.json();
            console.log('Response:', result);
            if (result.error) {
                setError(result.error)
            } else {
                setWeatherData(result.weather_data)
                setPlannedJourney(result.planned_journey)
                setJourneyPlan(true);
                setShowLoader(false);
            }

        } catch (error) {
            setJourneyPlan(false);
            setShowLoader(false);
            console.error('There was a problem with the fetch operation:', error);
            setError("Source Failure. Unable to send request")
        }
    };

    return (
        <div>
            <div className="details_input">
                <div className="form-container">
                    <h3>Plan your Journey</h3> <br />
                    <form className="form-inline">
                        <div className="form-group">
                            <label htmlFor="source">From:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="source"
                                id="source"
                                placeholder="Enter your boarding point"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="destination">To:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="destination"
                                id="destination"
                                placeholder="Enter your destination"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="destination">In-between stops (if any):</label>
                            <input
                                type="text"
                                className="form-control"
                                name="destination"
                                id="destination"
                                placeholder="Provide in-between stops during the trip, if any"
                                value={stops}
                                onChange={(e) => setStops(e.target.value)}
                                required
                            />
                        </div>
                        <span className="form-group">
                            <div>
                                <label htmlFor="date">Travel Date:</label>
                                <br />
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    className="form-control"
                                    placeholderText="select start date"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="return">Return Date:</label>
                                <br />
                                <DatePicker
                                    selected={returnDate}
                                    onChange={handleReturnDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    className="form-control"
                                    placeholderText="select return date"
                                    required
                                />
                            </div>
                        </span>
                        <div className="form-group">
                            <label htmlFor="budget">Budget (in INR):</label>
                            <input
                                type="number"
                                className="form-control"
                                name="budget"
                                id="budget"
                                placeholder="Enter your expected budget"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                            />
                        </div>
                        <span className="form-group">
                            <div>
                                <label htmlFor="date">No. of Adults:</label>
                                <br />
                                <input
                                    type="number"
                                    className="form-control"
                                    name="destination"
                                    id="destination"
                                    placeholder="Number of Adults"
                                    value={adults}
                                    onChange={(e) => setAdults(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="date">No. of Couple pairs (for separate rooms):</label>
                                <br />
                                <input
                                    type="number"
                                    className="form-control"
                                    name="destination"
                                    id="destination"
                                    placeholder="Number of Couples"
                                    value={couples}
                                    onChange={(e) => setCouples(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="date">No. of Children (below 15):</label>
                                <br />
                                <input
                                    type="number"
                                    className="form-control"
                                    name="destination"
                                    id="destination"
                                    placeholder="Number of Children"
                                    value={children}
                                    onChange={(e) => setChildren(e.target.value)}
                                    required
                                />
                            </div>
                        </span>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!startDate || !returnDate || !!error || !source || !destination || !budget}
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>

                        {error && <div className="error-message">{error}</div>}
                    </form>
                </div>
            </div>
            {showLoader && (<div className="loader">
                <br /><br />
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>)}
            {showJourneyPlan && (<div className="itenary">
                <br /><br />
                <h3>Weather Report for {destination} during your journey</h3>
                <div className="markdown-container">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {weatherData}
                    </ReactMarkdown>
                </div>
                <br /><br /><br />
                <h3>Your Personalised Travel Itenary</h3>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {plannedJourney}
                </ReactMarkdown>
                <br /><br />
                <h2 style={{ fontFamily: "'Poppins', sans-serif" }}>May this journey bring peace to your mind and joy to your heart. Have a happy and safe journey!</h2>
                <br /><br />
            </div>)}
        </div>
    );
}

export default Details;
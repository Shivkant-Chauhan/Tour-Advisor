import React from "react";
import './Dashboard.scss'
import Details from "../Details/Details";


const Dashboard = () => {
    return (
        <div>
            <nav className="navbar navbar-dark bg-dark navbar_top">
                <h1>Tour Advisor</h1>
                <p>your own personalised travel itinerary generator</p>
            </nav>

            <Details />
        </div>
    );
}

export default Dashboard;
import { Suspense } from "react";
import { Routes, Route } from 'react-router-dom'
import Summary from "../Summary/Summary";
import Card from '../Card/Card';
import React from "react";

const Navigation: React.FC = (props) => {
    return (
        <Suspense fallback={ <div>...loading</div> }>
            <Routes>
                <Route path="/" element={<Summary />} />
                <Route path={`/cards/:cardId`} element={<Card />} />
                <Route element={<div>there was an error</div>} />
            </Routes>
        </Suspense>
    )
}

export default Navigation;
import "./App.css";
// Import the functions you need from the SDKs you need
import { notifications } from '@mantine/notifications';
import { getDatabase, ref, set } from "firebase/database";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getFirebaseApp, setFirebaseAppsWithConfig } from "./firebase";
import Loading from "./pages/Loading/Loading";
import Login from "./pages/Login/Login";
import { Box, Container } from "@mantine/core";
import Card from "./pages/Card/Card";
import CardsSummaryTimeline from "./pages/CardsSummaryTimeline/CardsSummaryTimeline";
import CardSummary from "./pages/CardsSummary/CardSummary";

// const writeUserData = (userId: string, name: string, email: string, imageUrl: string) => {
//     const db = getDatabase();
//     const reference = ref(db, 'users/' + userId)

//     set(reference, {
//         username: name,
//         email: email,
//         profile_pic: imageUrl
//     })
// }

// writeUserData('3w948ub', 'bob boo', 'bob.bee@gmail.com', 'bob-pics.png')
// writeUserData('3w948uc', 'tot too', 'tot.too@gmail.com', 'tot-pics.png')
// writeUserData('3w948uc', 'tot too', 'tot.too@gmail.com', 'tot-pics.png')

function App() {
    useEffect(() => {
        const app = getFirebaseApp();

        if (!app) {
            setFirebaseAppsWithConfig({
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_FIREBASE_APP_ID,
                measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
            });
        }
    }, [])

    // const options: {
    //     series: ApexAxisChartSeries,
    //     options: ApexOptions
    // } = {
    //     series: [
    //         {
    //             name: 'Bob',
    //             data: [
    //                 {
    //                     x: 'Design',
    //                     y: [
    //                         new Date('2020-03-05').getTime(),
    //                         new Date('2020-03-08').getTime()
    //                     ]
    //                 },
    //                 {
    //                     x: 'Code',
    //                     y: [
    //                         new Date('2019-03-02').getTime(),
    //                         new Date('2019-03-05').getTime()
    //                     ]
    //                 },
    //                 {
    //                     x: 'Code',
    //                     y: [
    //                         new Date('2019-03-05').getTime(),
    //                         new Date('2019-03-07').getTime()
    //                     ]
    //                 },
    //                 {
    //                     x: 'Test',
    //                     y: [
    //                         new Date('2019-03-03').getTime(),
    //                         new Date('2019-03-09').getTime()
    //                     ]
    //                 },
    //                 {
    //                     x: 'Test',
    //                     y: [
    //                         new Date('2019-03-08').getTime(),
    //                         new Date('2019-03-11').getTime()
    //                     ]
    //                 },
    //                 {
    //                     x: 'Validation',
    //                     y: [
    //                         new Date('2019-03-11').getTime(),
    //                         new Date('2019-03-16').getTime()
    //                     ]
    //                 },
    //                 {
    //                     x: 'Design',
    //                     y: [
    //                         new Date('2020-03-09').getTime(),
    //                         new Date('2021-03-07').getTime()
    //                     ],
    //                 }
    //             ]
    //         },
    //         {
    //             name: 'Joe',
    //             data: [
    //                 {
    //                     x: 'Design',
    //                     y: [
    //                         new Date('2019-03-02').getTime(),
    //                         new Date('2019-03-05').getTime()
    //                     ]
    //                 },
    //                 {
    //                     x: 'Test',
    //                     y: [
    //                         new Date('2019-03-06').getTime(),
    //                         new Date('2019-03-16').getTime()
    //                     ],
    //                     goals: [
    //                         {
    //                             name: 'Break',
    //                             value: new Date('2019-03-10').getTime(),
    //                             strokeColor: '#CD2F2A'
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     x: 'Code',
    //                     y: [
    //                         new Date('2019-03-03').getTime(),
    //                         new Date('2019-03-07').getTime()
    //                     ]
    //                 },
    //                 {
    //                     x: 'Deployment',
    //                     y: [
    //                         new Date('2019-03-20').getTime(),
    //                         new Date('2019-03-22').getTime()
    //                     ]
    //                 },
    //                 {
    //                     x: 'Design',
    //                     y: [
    //                         new Date('2019-03-10').getTime(),
    //                         new Date('2019-03-16').getTime()
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             name: 'Dan',
    //             data: [
    //                 {
    //                     x: 'Code',
    //                     y: [
    //                         new Date('2019-03-10').getTime(),
    //                         new Date('2019-03-17').getTime()
    //                     ]
    //                 },
    //                 {
    //                     x: 'Validation',
    //                     y: [
    //                         new Date('2019-03-05').getTime(),
    //                         new Date('2019-03-09').getTime()
    //                     ],
    //                     goals: [
    //                         {
    //                             name: 'Break',
    //                             value: new Date('2019-03-07').getTime(),
    //                             strokeColor: '#CD2F2A'
    //                         }
    //                     ]
    //                 },
    //             ]
    //         }
    //     ],
    //     options: {
    //         plotOptions: {
    //             bar: {
    //                 horizontal: true,
    //                 barHeight: '80%'
    //             }
    //         },
    //         xaxis: {
    //             type: 'datetime',
    //         },
    //         stroke: {
    //             width: 1
    //         },
    //         fill: {
    //             type: 'solid',
    //             opacity: 0.6
    //         },
    //         legend: {
    //             position: 'top',
    //             horizontalAlign: 'left'
    //         }
    //     },
    // };

    // return (
    //     <div style={{ width: '100%' }} id="chart">
    //         <ReactApexChart series={options.series} options={options.options} type="rangeBar" height={450} width={1200} />
    //     </div>
    // )

    return (
        <BrowserRouter>
            <Routes >
                <Route path="/cards/:cardId" element={<Card />} />
                <Route path="/cards-summary" element={<CardSummary />} />
                <Route path="/cards-summary-timeline" element={<CardsSummaryTimeline />} />
                <Route path="*" element={<Navigate to="/cards-summary" replace={true} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;

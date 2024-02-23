import { ApexOptions } from 'apexcharts';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getFirebaseApp } from '../../configs';
import { ICard } from '../../models';
import classes from './CardSummaryTimelineView.module.css';

const CHART_OPTIONS: ApexOptions = {
    plotOptions: {
        bar: {
            horizontal: true,
            barHeight: '80%'
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            style: {
                colors: ['#fff']
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: ['#fff']
            }
        }
    },
    dataLabels: {
        style: {
            colors: ['#fff']
        }
    },
    stroke: {
        width: 1,
    },
    fill: {
        type: 'solid',
        opacity: 0.6,
        colors: ['#ffffff']
    },
    legend: {
        show: false
    },
    tooltip: {
        custom: ({ ctx, dataPointIndex, series, seriesIndex, w, y1, y2 }) => {
            const datapoint = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            return `
                <div style="padding: 1rem; text-align: start">
                    <b>${datapoint.x as string}</b>
                    <br />
                    You've had this card for ${Math.round((y2 - y1) / (1000 * 60 * 60 * 24))} days
                    <br />
                    ${new Date(y1).toDateString()} - ${new Date(y2).toDateString()}
                </div>
            `
        }
    }
};

function CardSummaryTimelineView() {
    const [series, setSeries] = useState<ApexAxisChartSeries>();

    useEffect(() => {
        const app = getFirebaseApp();
        const db = getDatabase(app);
        const reference = ref(db, `cards/`);
        const unsub = onValue(reference, (snapshot) => {
            const cardsFromDB = Object.entries(snapshot.val() as {[id:string]: Partial<ICard>}).map(([key, value]) => ({
                id: key,
                ...value,
            }))

            const newSeries: ApexAxisChartSeries = [];
            cardsFromDB.forEach((card) => {
                const tradeline = card.tradeline || [];
                newSeries.push({
                    name: card.name || '',
                    data: [
                        {
                            x: card.name,
                            y: [
                                new Date(card.openDate || '').getTime(),
                                new Date().getTime()
                            ],
                        },
                    ],
                })
            })

            setSeries(newSeries);
        })

        return () => unsub();
    }, [])

    // const series = useMemo(() => {

    // }, [allAccounts])
    // const series = [
    //     {
    //         name: 'Bob',
    //         data: [
    //             {
    //                 x: 'Design',
    //                 y: [
    //                     new Date('2020-03-05').getTime(),
    //                     new Date('2020-03-08').getTime()
    //                 ]
    //             },
    //             {
    //                 x: 'Code',
    //                 y: [
    //                     new Date('2019-03-02').getTime(),
    //                     new Date('2019-03-05').getTime()
    //                 ]
    //             },
    //             {
    //                 x: 'Code',
    //                 y: [
    //                     new Date('2019-03-05').getTime(),
    //                     new Date('2019-03-07').getTime()
    //                 ]
    //             },
    //             {
    //                 x: 'Test',
    //                 y: [
    //                     new Date('2019-03-03').getTime(),
    //                     new Date('2019-03-09').getTime()
    //                 ]
    //             },
    //             {
    //                 x: 'Test',
    //                 y: [
    //                     new Date('2019-03-08').getTime(),
    //                     new Date('2019-03-11').getTime()
    //                 ]
    //             },
    //             {
    //                 x: 'Validation',
    //                 y: [
    //                     new Date('2019-03-11').getTime(),
    //                     new Date('2019-03-16').getTime()
    //                 ]
    //             },
    //             {
    //                 x: 'Design',
    //                 y: [
    //                     new Date('2020-03-09').getTime(),
    //                     new Date('2021-03-07').getTime()
    //                 ],
    //             }
    //         ]
    //     },
    //     {
    //         name: 'Joe',
    //         data: [
    //             {
    //                 x: 'Design',
    //                 y: [
    //                     new Date('2019-03-02').getTime(),
    //                     new Date('2019-03-05').getTime()
    //                 ]
    //             },
    //             {
    //                 x: 'Test',
    //                 y: [
    //                     new Date('2019-03-06').getTime(),
    //                     new Date('2019-03-16').getTime()
    //                 ],
    //                 goals: [
    //                     {
    //                         name: 'Break',
    //                         value: new Date('2019-03-10').getTime(),
    //                         strokeColor: '#CD2F2A'
    //                     }
    //                 ]
    //             },
    //             {
    //                 x: 'Code',
    //                 y: [
    //                     new Date('2019-03-03').getTime(),
    //                     new Date('2019-03-07').getTime()
    //                 ]
    //             },
    //             {
    //                 x: 'Deployment',
    //                 y: [
    //                     new Date('2019-03-20').getTime(),
    //                     new Date('2019-03-22').getTime()
    //                 ]
    //             },
    //             {
    //                 x: 'Design',
    //                 y: [
    //                     new Date('2019-03-10').getTime(),
    //                     new Date('2019-03-16').getTime()
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         name: 'Dan',
    //         data: [
    //             {
    //                 x: 'Code',
    //                 y: [
    //                     new Date('2019-03-10').getTime(),
    //                     new Date('2019-03-17').getTime()
    //                 ]
    //             },
    //             {
    //                 x: 'Validation',
    //                 y: [
    //                     new Date('2019-03-05').getTime(),
    //                     new Date('2019-03-09').getTime()
    //                 ],
    //                 goals: [
    //                     {
    //                         name: 'Break',
    //                         value: new Date('2019-03-07').getTime(),
    //                         strokeColor: '#CD2F2A'
    //                     }
    //                 ]
    //             },
    //         ]
    //     }
    // ];







    return (
        <div id="chart" className={classes['chart-container']}>
            <ReactApexChart options={CHART_OPTIONS} series={series || []} type='rangeBar' height={500} width="100%" />
        </div>
    )
}

export default CardSummaryTimelineView
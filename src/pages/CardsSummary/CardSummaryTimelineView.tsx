import { ApexOptions } from 'apexcharts';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getFirebaseApp } from '../../configs';
import { ICard } from '../../models';
import classes from './CardSummaryTimelineView.module.css';
import { DateTime } from 'luxon';
import * as ynab from 'ynab';

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
    },
    legend: {
        show: false
    },
    tooltip: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        custom: ({ seriesIndex, w, y1, y2 }) => {
            const name = w.globals.initialSeries[seriesIndex].name;
            return `
                <div style="padding: 1rem; text-align: start; color: blue">
                    <b>${name as string}</b>
                    <br />
                    You've had this card for ${Math.round((y2 - y1) / (1000 * 60 * 60 * 24))} days
                    (~${Math.round((y2 - y1) / (1000 * 60 * 60 * 24 * 30))} months)
                    <br />
                    ${new Date(y1).toDateString()} - ${new Date(y2).toDateString()}
                </div>
            `
        }
    }
};

const getAnniversaryGoalsForCard = (cardName: string, openDate: string, closeDate?: string) => {
    let openDateObj = DateTime.fromISO(openDate);
    const closeDateObj = closeDate ? DateTime.fromISO(closeDate) : DateTime.now();

    const goals = [];
    while(closeDateObj.diff(openDateObj, 'years').years > -1) {
        goals.push({
            name: cardName,
            value: openDateObj.toMillis(),
            strokeColor: 'green',
            strokeWidth: 10,
            strokeHeight: 0,
            strokeLineCap: 'round',
        })
        openDateObj = openDateObj.plus({ years: 1 });
    }
    return goals;
}

function CardSummaryTimelineView({ allAccounts }:{allAccounts: ynab.Account[]}) {
    const [series, setSeries] = useState<ApexAxisChartSeries>();

    useEffect(() => {
        const app = getFirebaseApp();
        const db = getDatabase(app);
        const reference = ref(db, `cards/`);
        const unsub = onValue(reference, (snapshot) => {
            const cardsFromDB = Object.entries(snapshot.val() as {[id:string]: Partial<ICard>}).map(([key, value]) => ({
                id: key,
                ...value,
            }));

            const newSeries: ApexAxisChartSeries = [];
            cardsFromDB.filter((card) => !!allAccounts.find((account) => account.id === card.ynabCardId)).forEach((card) => {
                const tradeline = card.tradeline || [];
                newSeries.push(
                    {
                        name: card.name || '',
                        data: [
                            {
                                x: card.name,
                                y: [
                                    new Date(card.openDate || '').getTime(),
                                    card.closeDate ? new Date(card.closeDate).getTime() : new Date().getTime()
                                ],
                                goals: [
                                    ...getAnniversaryGoalsForCard(
                                        card?.name || '',
                                        card.openDate as string,
                                        (card.closeDate as string | undefined) || undefined
                                    )
                                ]
                            },
                        ],
                    },
                    ...tradeline.map((oldCard) => ({
                        name: oldCard.name,
                        data: [{
                            x: card.name,
                            y: [
                                new Date(oldCard.openDate || '').getTime(),
                                new Date(oldCard.closeDate || '').getTime()
                            ]
                        }]
                    }))
                )
            })

            setSeries(newSeries);
        })

        return () => unsub();
    }, [allAccounts])

    return (
        <div id="chart" className={classes['chart-container']}>
            <ReactApexChart options={CHART_OPTIONS} series={series || []} type='rangeBar' height={500} width="100%" />
        </div>
    )
}

export default CardSummaryTimelineView
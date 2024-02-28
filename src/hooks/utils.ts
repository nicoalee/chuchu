import { DateTime } from 'luxon';
import { TransactionDetail } from 'ynab';
import { IGoalOverviewMonth } from './useTransactionOverview';
import { IGoal, IRepeatedGoal, ISingleGoal } from '../models';

const numToMonth: { [key: string]: string } = {
    '01': 'January',
    '1': 'January',
    '02': 'February',
    '2': 'February',
    '03': 'March',
    '3': 'March',
    '04': 'April',
    '4': 'April',
    '05': 'May',
    '5': 'May',
    '06': 'June',
    '6': 'June',
    '07': 'July',
    '7': 'July',
    '08': 'August',
    '8': 'August',
    '09': 'September',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
}

export function getTransactionsSpendBetweenStartAndEnd(startDate: DateTime, endDate: DateTime, transactions: TransactionDetail[]) {
    if (startDate > endDate) {
        // invalid
        return 0;
    }
    let sum = 0;
    for(let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        const transactionDate = DateTime.fromISO(transaction.date);
        if (transactionDate > endDate) break;
        if (transactionDate < startDate) continue;
        if (transaction.amount > 0) continue; // we only want credit card purchases
        if (transactionDate >= startDate && transactionDate <= endDate) {
            sum = sum + (transaction.amount * -1);
        }
    }
    return sum / 1000;
}

export interface IMonthObject {
    monthName: string;
    yearName: string;
    monthNum: number;
    monthStartDate: DateTime;
    monthEndDate: DateTime;
}

export function getMonthObjectsFromDateToNowOrClose(date: DateTime, closeDate?: DateTime): IMonthObject[] {
    if (date > DateTime.now()) {
        console.error('Received a date that is after the current date!');
        // invalid
        return [];
    }
    const monthObjects: IMonthObject[] = [];

    let currentMonth = date;
    let diffMonthsBetweenCurrentAndEnd = (closeDate ? currentMonth.diff(closeDate, 'months').months : currentMonth.diffNow('months').months);
    while (diffMonthsBetweenCurrentAndEnd < (closeDate ? 1 : 0)) {
        monthObjects.push({
            monthName: numToMonth[currentMonth.month],
            yearName: currentMonth.year.toString(),
            monthNum: currentMonth.month,
            monthStartDate: DateTime.fromISO(`${currentMonth.year}-${currentMonth.month < 10 ? '0' : ''}${currentMonth.month}-01`),
            monthEndDate: DateTime.fromISO(`${currentMonth.year}-${currentMonth.month < 10 ? '0' : ''}${currentMonth.month}-${currentMonth.daysInMonth}`)
        })
        currentMonth = currentMonth.plus({ months: 1 })
        diffMonthsBetweenCurrentAndEnd = (closeDate ? currentMonth.diff(closeDate, 'months').months : currentMonth.diffNow('months').months);
    }
    if (monthObjects.length > 0) {
        monthObjects[0].monthStartDate = date;
        if (!closeDate) {
            // if the card is not closed, it is safe to assume that the last element in the array is the current month and that
            // that the time frame for that month is up to the current date
            monthObjects[monthObjects.length - 1].monthEndDate = DateTime.now();
        }
    }
    return monthObjects;
}

export function getSingleGoalOverview(goal: IGoal, monthObject: IMonthObject, data: TransactionDetail[]): IGoalOverviewMonth {
    const goalStartDate = DateTime.fromISO(goal.goalConfig.goalStartDate as string);
    const goalEndDate = DateTime.fromISO((goal.goalConfig as ISingleGoal).goalEndDate as string);

    // check to see if we are before the goal start
    if (monthObject.monthEndDate < goalStartDate) {
        return {
            goalStatusString: 'Goal not yet started',
            isGoalCurrentlyHappening: false,
            spendRequiredForMonth: 0,
            totalSpendSinceGoalStartBeforeThisMonth: 0,
            ...goal,
        } as IGoalOverviewMonth
    }
    // check to see if we are after the goal end
    if (monthObject.monthStartDate > goalEndDate) {
        return {
            goalStatusString: 'Goal has ended',
            isGoalCurrentlyHappening: false,
            spendRequiredForMonth: 0,
            totalSpendSinceGoalStartBeforeThisMonth: 0,
            ...goal,
        } as IGoalOverviewMonth
    }
    const requiredSpendForGoal = goal.spendRequired;
    const goalEndingThisMonth = goalEndDate.month === monthObject.monthEndDate.month && goalEndDate.year === monthObject.monthEndDate.year;
    const totalSpendSinceGoalStartBeforeThisMonth = getTransactionsSpendBetweenStartAndEnd(goalStartDate, monthObject.monthStartDate.minus({ days: 1 }), data);
    const hasReachedGoal = requiredSpendForGoal - totalSpendSinceGoalStartBeforeThisMonth <= 0;

    const numDaysRemaining = goalEndDate.diff(monthObject.monthStartDate, 'days').days;
    const remainingSpend = hasReachedGoal ? 0 : requiredSpendForGoal - totalSpendSinceGoalStartBeforeThisMonth;
    const remainingSpendPerDay = numDaysRemaining === 0 ? 0 : remainingSpend / numDaysRemaining;
    const numDaysInTheMonth = (goalEndingThisMonth ? goalEndDate : monthObject.monthEndDate).diff(monthObject.monthStartDate,'days').days;

    return {
        goalStatusString: '',
        isGoalCurrentlyHappening: true,
        spendRequiredForMonth: Math.round(remainingSpendPerDay * numDaysInTheMonth * 100) / 100,
        totalSpendSinceGoalStartBeforeThisMonth: totalSpendSinceGoalStartBeforeThisMonth,
        ...goal,
    } as IGoalOverviewMonth
}

function getCycleInfoForRepeatedGoalDate(goal: IGoal, date: DateTime, data: TransactionDetail[]) {
    const goalConfig = goal.goalConfig as IRepeatedGoal;
    const goalEnd = DateTime.fromISO(goalConfig.goalStartDate as string).plus({ months: goalConfig.numRepeats});

    let goalCycleStart = DateTime.fromISO(goal.goalConfig.goalStartDate as string);
    let goalCycleEnd = goalCycleStart.plus({ months: 1 });

    if ((date < goalCycleStart || date > goalEnd) && date.month !== goalEnd.month && date.year !== goalEnd.year) return undefined;

    const prevCycles = [];
    let currCycle = 0;
    for (let i = 0; i < goalConfig.numRepeats; i++) {
        if (date >= goalCycleStart && date <= goalCycleEnd) {
            break;
        }

        const cycleTotalSpend = getTransactionsSpendBetweenStartAndEnd(goalCycleStart, goalCycleEnd.minus({ days: 1 }), data);
        prevCycles.push({
            cycle: i,
            goalCycleStart: goalCycleStart,
            goalCycleEnd: goalCycleEnd,
            spendForCycle: cycleTotalSpend,
            cycleCompleted: cycleTotalSpend >= goal.spendRequired
        })
        currCycle+=1;
        goalCycleStart = goalCycleStart.plus({ months: 1 });
        goalCycleEnd = goalCycleEnd.plus({ months: 1 });
    }

    return {
        prevCycles: prevCycles,
        currentCyleStart: goalCycleStart,
        currentCycleEnd: goalCycleEnd,
        cycle: currCycle
    }
}

/**
 * Repeated goals work a bit differently because they do not perfectly align with months. Instead, they work as cycles.
 * While the terminology used is "months" for convenience and standardization, they are actually cycles.
 * As a result, some of the data displayed will still be the same even if the month has changed
 */
export function getRepeatedGoalOverview(goal: IGoal, monthObject: IMonthObject, data: TransactionDetail[]): IGoalOverviewMonth {
    const goalStartDate = DateTime.fromISO(goal.goalConfig.goalStartDate as string);
    const goalEndDate = goalStartDate.plus({ months: (goal.goalConfig as IRepeatedGoal).numRepeats });
    // check to see if we are before the goal start
    if (monthObject.monthEndDate < goalStartDate) {
        return {
            goalStatusString: 'Goal not yet started',
            isGoalCurrentlyHappening: false,
            spendRequiredForMonth: 0,
            ...goal,
        } as IGoalOverviewMonth
    }
    // check to see if we are after the goal end
    if (monthObject.monthStartDate > goalEndDate) {
        return {
            goalStatusString: 'Goal has ended',
            isGoalCurrentlyHappening: false,
            spendRequiredForMonth: 0,
            ...goal,
        } as IGoalOverviewMonth
    }

    const goalCyclesUpToThisMonth = getCycleInfoForRepeatedGoalDate(goal, monthObject.monthEndDate, data);
    if (!goalCyclesUpToThisMonth) {
        return {
            goalStatusString: 'Not valid',
            isGoalCurrentlyHappening: false,
            spendRequiredForMonth: 0,
            ...goal,
        }
    }

    return {
        goalStatusString: '',
        isGoalCurrentlyHappening: true,
        spendRequiredForMonth: goal.spendRequired,
        totalSpendThisCycle: getTransactionsSpendBetweenStartAndEnd(goalCyclesUpToThisMonth.currentCyleStart, goalCyclesUpToThisMonth.currentCycleEnd.minus({ days: 1 }), data),
        cycleInfo: goalCyclesUpToThisMonth,
        ...goal
    }
}


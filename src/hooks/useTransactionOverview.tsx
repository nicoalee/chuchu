import { DateTime } from "luxon";
import { useMemo } from "react";
import { IGoal } from "../models";
import useGetTransactionsByAccount from "./useGetTransactionsByAccount";
import { getMonthObjectsFromDateToNowOrClose, getRepeatedGoalOverview, getSingleGoalOverview, getTransactionsSpendBetweenStartAndEnd } from "./utils";

export type IGoalOverviewMonth = IGoal & {
    goalStatusString: string;
    isGoalCurrentlyHappening: boolean;
    spendRequiredForMonth: number;
    totalSpendSinceGoalStartBeforeThisMonth?: number;

    // for repeated goals
    cycleInfo?: {
        prevCycles: {
            cycle: number;
            goalCycleStart: DateTime<true> | DateTime<false>;
            goalCycleEnd: DateTime<true> | DateTime<false>;
            spendForCycle: number;
            cycleCompleted: boolean;
        }[];
        currentCyleStart: DateTime<true> | DateTime<false>;
        currentCycleEnd: DateTime<true> | DateTime<false>;
        cycle: number;
    };
    totalSpendThisCycle?: number;
}

export interface ITransactionOverviewMonth {
    monthName: string; // January
    monthNumber: number;
    yearName: string; // 2023
    totalSpendThisMonth: number;
    goals: IGoalOverviewMonth[];
}

function useTransactionOverview(
    budgetId: string | undefined,
    accountId: string | undefined,
    openDate: string | undefined,
    closeDate: string | undefined,
    goals: IGoal[] | undefined
) {
    const { data, isLoading, isError } = useGetTransactionsByAccount(budgetId || '', accountId || '');
    const transactionOverviewMonths = useMemo(() => {
        if (!data || !openDate || !goals) return [];

        const transactionOverviewMonths: ITransactionOverviewMonth[] = [];
        const numMonthsFromOpenDateToNow = getMonthObjectsFromDateToNowOrClose(
            DateTime.fromISO(openDate),
            closeDate ? DateTime.fromISO(closeDate) : undefined
        );
        numMonthsFromOpenDateToNow.forEach((monthObject) => {
            const totalSpendThisMonth = getTransactionsSpendBetweenStartAndEnd(monthObject.monthStartDate, monthObject.monthEndDate, data);

            const goalOverviews = goals.map((goal) => {
                if (goal.goalType === 'SINGLE') {
                    return getSingleGoalOverview(goal, monthObject, data);
                } else {
                    return getRepeatedGoalOverview(goal, monthObject, data);
                }
            })

            transactionOverviewMonths.push({
                monthName: monthObject.monthName,
                yearName: monthObject.yearName,
                totalSpendThisMonth: totalSpendThisMonth,
                monthNumber: monthObject.monthNum,
                goals: goalOverviews
            })
        });
        return transactionOverviewMonths.reverse()
    }, [closeDate, data, goals, openDate])
    return {
        transactionOverviewMonths, isLoading, isError
    }
}

export default useTransactionOverview;
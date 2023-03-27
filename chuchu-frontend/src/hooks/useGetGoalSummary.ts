import { IGoal, IRepeatedGoalConfig, ISingleGoalConfig, ITransaction, useGetCardTransactions, useGetGoal } from "CardStore";
import { DateTime } from "luxon";

export const getTotalSpendBetweenInclusive = (transactions: ITransaction[], dateFrom: DateTime, dateTo: DateTime) => {
    let totalAmount = 0;

    transactions.forEach((transaction) => {
        const diffDaysFrom = DateTime.fromISO(transaction.date).diff(dateFrom, 'days').days;
        const diffDaysTo = DateTime.fromISO(transaction.date).diff(dateTo, 'days').days;

        if (diffDaysFrom >= 0 && diffDaysTo <= 0) {
            totalAmount = totalAmount + transaction.amount;
        }
    })
    return Math.round(totalAmount * 100) / 100;
}

export const getTransactionsBetweenInclusive = (transactions: ITransaction[], dateFrom: DateTime, dateTo: DateTime): ITransaction[] => {
    const transactionsWithinDates: ITransaction[] = [];
    transactions.forEach((transaction) => {
        const diffDaysFrom = DateTime.fromISO(transaction.date).diff(dateFrom, 'days').days;
        const diffDaysTo = DateTime.fromISO(transaction.date).diff(dateTo, 'days').days;

        if (diffDaysFrom >= 0 && diffDaysTo <= 0) {
            transactionsWithinDates.push(transaction)
        }
    })
    return transactionsWithinDates;
}

const useGetGoalSummary = (cardId: string, goalId: string): {
    percentageComplete: number,
    deadlineHasPassed: boolean,
    completed: boolean,
    subGoals: {
        status: 'PAST' | 'IN-PROGRESS' | 'FUTURE',
        completed: boolean
    }[]
} => {
    const goal = useGetGoal(cardId || '', goalId || '');
    const transactions = useGetCardTransactions(cardId);

    if (goal?.metadata?.goalMode === 'single-goal') {
        const totalSpendBeforeDeadline = getTotalSpendBetweenInclusive(
            transactions,
            DateTime.fromISO((goal?.metadata?.configs as ISingleGoalConfig)?.goalStartDate || ''),
            DateTime.fromISO((goal?.metadata?.configs as ISingleGoalConfig)?.goalEndDate || '')
        );
        const daysFromGoalEnd = DateTime.fromISO((goal.metadata.configs as ISingleGoalConfig)?.goalEndDate || '').diffNow('days').days;
        const percentageComplete = Math.round((totalSpendBeforeDeadline / goal.spendRequired) * 100);

        return {
            percentageComplete: percentageComplete > 100 ? 100 : percentageComplete,
            deadlineHasPassed: daysFromGoalEnd < 0,
            completed: totalSpendBeforeDeadline >= goal.spendRequired,
            subGoals: [],
        }
    } else {
        const subGoals: {
            status: 'PAST' | 'IN-PROGRESS' | 'FUTURE',
            completed: boolean
        }[] = [];
        const numOccurrences = ((goal?.metadata?.configs as IRepeatedGoalConfig)?.numOccurrences || 0);
        let goalStartDate = DateTime.fromISO(goal?.metadata?.configs?.goalStartDate || '');
        let percentageCompleteActiveMonth= 0;
        let completedActiveMonth = false;

        for(let i = 0; i < numOccurrences; i++) {
            let status: 'PAST' | 'IN-PROGRESS' | 'FUTURE';
            let completed: boolean;
            const nextGoalDate = goalStartDate.plus({ months: 1 });

            if (nextGoalDate.diffNow('days').days < 0) {
                // we have gone past the next goal date meaning the deadline has passed
                status = 'PAST';
                completed = getTotalSpendBetweenInclusive(transactions, goalStartDate, nextGoalDate.minus({ days: 1 })) >= (goal?.spendRequired || 0)
            } else if (goalStartDate.diffNow('days').days > 0) {
                // this goal is still in the future
                status = 'FUTURE';
                completed = false;
            } else {
                // we are doing this goal now
                status = 'IN-PROGRESS';
                const totalSpend = getTotalSpendBetweenInclusive(transactions, goalStartDate, DateTime.now())
                completed = totalSpend >= (goal?.spendRequired || 0);
                percentageCompleteActiveMonth = Math.round(totalSpend / (goal?.spendRequired || 0) * 100);
                completedActiveMonth = completed;
            }
                
            subGoals.push({
                status: status,
                completed: completed
            })
            goalStartDate = nextGoalDate;
        }

        const finalSubGoalEnd = DateTime.fromISO(goal?.metadata?.configs?.goalStartDate || '').plus({ months: numOccurrences });
        const daysFromGoalEnd = finalSubGoalEnd.diffNow('days').days;

        return {
            percentageComplete: percentageCompleteActiveMonth > 100 ? 100 : percentageCompleteActiveMonth,
            deadlineHasPassed: daysFromGoalEnd < 0,
            completed: completedActiveMonth,
            subGoals: subGoals,
        }
    }
}

export default useGetGoalSummary;
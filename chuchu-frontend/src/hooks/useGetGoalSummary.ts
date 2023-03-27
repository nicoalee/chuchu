import { IRepeatedGoalConfig, ISingleGoalConfig, ITransaction, useGetCardTransactions, useGetGoal } from "CardStore";
import { DateTime } from "luxon";

const getTotalSpendUpTo = (transactions: ITransaction[], date: string) => {
    let totalAmount = 0;
    transactions.forEach((transaction) => {
        const diffDays = DateTime.fromISO(transaction.date).diff(DateTime.fromISO(date), 'days').days;
        if (diffDays <= 0) {
            totalAmount = totalAmount + transaction.amount;
        }
    })
    return totalAmount
}

const getTotalSpendBetween = (transactions: ITransaction[], dateFrom: string, dateTo: string) => {
    let totalAmount = 0;
    const from = DateTime.fromISO(dateFrom);
    const to = DateTime.fromISO(dateTo);

    transactions.forEach((transaction) => {
        const diffDaysFrom = DateTime.fromISO(transaction.date).diff(from, 'days').days;
        const diffDaysTo = DateTime.fromISO(transaction.date).diff(to, 'days').days;

        if (diffDaysFrom >= 0 && diffDaysTo <= 0) {
            totalAmount = totalAmount + transaction.amount;
        }
    })
    return totalAmount;
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
        const totalSpendBeforeDeadline = getTotalSpendUpTo(transactions, (goal?.metadata?.configs as ISingleGoalConfig)?.goalEndDate || '');
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
                completed = getTotalSpendBetween(transactions, goalStartDate.toISO(), nextGoalDate.toISO()) >= (goal?.spendRequired || 0)
            } else if (goalStartDate.diffNow('days').days > 0) {
                // this goal is still in the future
                status = 'FUTURE';
                completed = false;
            } else {
                // we are doing this goal now
                status = 'IN-PROGRESS';
                const totalSpend = getTotalSpendBetween(transactions, goalStartDate.toISO(), DateTime.now().toISO())
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
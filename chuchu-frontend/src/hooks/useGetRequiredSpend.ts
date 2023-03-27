import { IRepeatedGoalConfig, ISingleGoalConfig, useGetCardTransactions, useGetGoals } from "CardStore";
import { DateTime } from "luxon";
import { getTotalSpendBetweenInclusive } from "./useGetGoalSummary";
import useGetTotalSpend from "./useGetTotalSpend";

const useGetRequiredSpend = (cardId?: string) => {
    const goals = useGetGoals(cardId || '');
    const transactions = useGetCardTransactions(cardId || '')
    const totalSpend = useGetTotalSpend(cardId || '');

    let requiredSpend = 0;
    goals.forEach((goal) => {
        if (goal.metadata.goalMode === 'repeated-goal') {
            const startRepeatedGoalDate = DateTime.fromISO((goal.metadata.configs as IRepeatedGoalConfig).goalStartDate || '');
            const numOccurrences = (goal.metadata.configs as IRepeatedGoalConfig).numOccurrences || 1;
            const endOfEntireCompletedGoal = startRepeatedGoalDate.plus({ months: numOccurrences });
            
            // goal deadline has passed
            if (endOfEntireCompletedGoal.diffNow('days').days < 0) return;
            
            const monthsSinceGoalStart = Math.ceil(startRepeatedGoalDate.diffNow('months').months * -1);
            const endRepeatedGoalInstance = startRepeatedGoalDate.plus({ months: monthsSinceGoalStart });
            const expenditureForThisMonth = getTotalSpendBetweenInclusive(transactions, startRepeatedGoalDate, endRepeatedGoalInstance);
            const spendLeft = goal.spendRequired - expenditureForThisMonth;
            if (requiredSpend < spendLeft) {
                requiredSpend = spendLeft < 0 ? 0 : spendLeft
            }
        } else {
            const goalStartDate = DateTime.fromISO((goal.metadata.configs as ISingleGoalConfig)?.goalStartDate || '')
            const goalEndDate = DateTime.fromISO((goal.metadata.configs as ISingleGoalConfig)?.goalEndDate || '')
            const goalNumMonths = Math.ceil(goalEndDate.diff(goalStartDate, 'months').toObject().months || 1);

            // goal deadline has passed
            if (goalEndDate.diffNow('days').days < 0) return;

            const spendPerMonth = Math.round(goal.spendRequired / goalNumMonths * 100) / 100

            // turn into a positive number and get the ceiling
            const monthsSinceGoalStart = Math.ceil(goalStartDate.diffNow('months').months * -1);
            const requiredSpendUpToNow = monthsSinceGoalStart * spendPerMonth;
            const spendLeft = requiredSpendUpToNow - totalSpend;

            if (requiredSpend < spendLeft) {   
                requiredSpend = spendLeft < 0 ? 0 : spendLeft 
            }
        }
    })
    return Math.round(requiredSpend * 100) / 100;
}

export default useGetRequiredSpend;
import { useGetCard, useGetCardTransactions } from "CardStore";
import { DateTime } from "luxon";
import { getTotalSpendBetweenInclusive, getTransactionsBetweenInclusive } from "./useGetGoalSummary";

const useBreakDownExpenditureByCycle = (cardId: string | undefined, isPaymentMode: boolean): {
    cycle: string,
    cycleIndex: number,
    expenditure: number,
    rewardsEarned: number
}[] => {
    const card = useGetCard(cardId || '');
    const transactions = useGetCardTransactions(cardId || '');
    let cycleStartDate;
    if (isPaymentMode) {
        const startDate = DateTime.fromISO(card?.openDate || '');
        const month = ('0' + (startDate.month)).slice(-2);
        const date = ('0' + card?.cycleStartDay).slice(-2)
        const actualCycleStartISOStr = `${startDate.year}-${month}-${date}`;
        cycleStartDate = DateTime.fromISO(actualCycleStartISOStr);
    } else {
        cycleStartDate = DateTime.fromISO(card?.openDate || '');
    }

    const monthsSinceGoalStart = Math.ceil(cycleStartDate.diffNow('months').months * -1);

    // account for fact that the cycle starts with date A and ends with date A - 1
    let cycleEndDate = cycleStartDate.plus({ months: 1 }).minus({ days: 1 });
    const cycleArr = [];
    for(let i = 0; i < monthsSinceGoalStart; i++) {
        cycleArr.push({
            cycleIndex: i,
            cycle: `Cycle ${i + 1}: ${cycleStartDate.toISO().split('T')[0]} - ${cycleEndDate.toISO().split('T')[0]}`,
            expenditure: getTotalSpendBetweenInclusive(transactions, cycleStartDate, cycleEndDate),
            rewardsEarned: getTransactionsBetweenInclusive(transactions, cycleStartDate, cycleEndDate).reduce(
                (acc, curr) => acc + Math.round(curr.amount * curr.category.rewardRatio), 
                0
            )
        })
        cycleStartDate = cycleStartDate.plus({ 'months': 1 });
        cycleEndDate = cycleEndDate.plus({ 'months': 1 })
    }
    return cycleArr;
}

export default useBreakDownExpenditureByCycle;
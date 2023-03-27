import { Box, Typography } from "@mui/material";
import { IGoal, IRepeatedGoalConfig, ISingleGoalConfig, ITransaction, useGetCardTransactions, useGetGoals } from "CardStore";
import { getTotalSpendBetweenInclusive } from "hooks/useGetGoalSummary";
import useGetTotalRewards from "hooks/useGetTotalRewards";
import { DateTime } from "luxon";

export const getTotalBonusesFromGoals = (transactions: ITransaction[], goals: IGoal[]) => {
    let totalBonuses = 0;
    goals.forEach((goal) => {
        if (goal.metadata.goalMode === 'single-goal') {
            const totalSpend = getTotalSpendBetweenInclusive(
                transactions, 
                DateTime.fromISO(goal?.metadata?.configs?.goalStartDate || ''),
                DateTime.fromISO((goal?.metadata?.configs as ISingleGoalConfig)?.goalEndDate || ''),
            );
            if (totalSpend >= goal.spendRequired) {
                totalBonuses = totalBonuses + goal.reward
            }
        } else {
            
            const numOccurrences = ((goal?.metadata?.configs as IRepeatedGoalConfig)?.numOccurrences || 0);
            let goalStartDate = DateTime.fromISO(goal?.metadata?.configs?.goalStartDate || '');
    
            for(let i = 0; i < numOccurrences; i++) {
                const nextGoalDate = goalStartDate.plus({ months: 1 });
    
                if (nextGoalDate.diffNow('days').days < 0) {
                    // in the past
                    const completed = getTotalSpendBetweenInclusive(transactions, goalStartDate, nextGoalDate.minus({ days: 1 })) >= (goal?.spendRequired || 0)
                    if (completed) {
                        totalBonuses = totalBonuses + goal.reward;
                    }
                } else if (goalStartDate.diffNow('days').days > 0) {
                    // in the future
                    return;
                } else {
                    const totalSpend = getTotalSpendBetweenInclusive(transactions, goalStartDate, DateTime.now())
                    const completed = totalSpend >= (goal?.spendRequired || 0);
                    if (completed) {
                        totalBonuses = totalBonuses + goal.reward
                    }
                }
                goalStartDate = nextGoalDate;
            }
        }
    })
    return totalBonuses
}

const TotalRewards: React.FC<{ cardId?: string }> = (props) => {
    const totalRewards = useGetTotalRewards(props.cardId || '');
    const transactions = useGetCardTransactions(props.cardId || '');
    const goals = useGetGoals(props.cardId || '');
    const totalBonuses = getTotalBonusesFromGoals(transactions, goals)

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ color: 'green' }}>
                Total Rewards Earned:
            </Typography>
            <Box>
                <Typography variant="h4" sx={{ display: 'inline-block', color: 'success.light' }}>{totalRewards}</Typography>
                <Typography sx={{ display: 'inline-block', margin: '0 10px' }} variant="h4">+</Typography>
                <Typography variant="h4" sx={{ display: 'inline-block', color: 'success.dark' }}>{totalBonuses}</Typography>
                <Typography sx={{ display: 'inline-block', marginLeft: '10px' }} variant="h4">=</Typography>
                <Typography variant="h4" sx={{ color: 'lightgreen' }}>{totalBonuses + totalRewards}</Typography>
            </Box>
        </Box>
    )
}

export default TotalRewards;
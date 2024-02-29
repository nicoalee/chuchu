import { Box, Text } from "@mantine/core";
import { useMemo } from "react";
import { ITransactionOverviewMonth } from "../../hooks/useTransactionOverview";
import { IGoal } from "../../models";
import CardTransactionOverviewMonthRepeatedGoal from "./CardTransactionOverviewMonthRepeatedGoal";
import CardTransactionOverviewMonthSingleGoal from "./CardTransactionOverviewMonthSingleGoal";

function CardGoal({ goal, transactionOverviewMonths }: { goal: IGoal, transactionOverviewMonths: ITransactionOverviewMonth[] }) {
    const mostRecentGoalMonth = useMemo(() => {
        let monthWithGoalInfo;
        let monthOverview;
        for(const month of transactionOverviewMonths) {
            const foundGoal = month.goals.find((x) => x.id === goal.id);
            if (!foundGoal) continue;
            if (foundGoal.isGoalCurrentlyHappening) {
                monthWithGoalInfo = foundGoal
                monthOverview = month;
                break;
            }
        }
        return {
            monthWithGoalInfo,
            monthOverview
        }
    }, [goal.id, transactionOverviewMonths])

    if (!mostRecentGoalMonth || !mostRecentGoalMonth.monthOverview || !mostRecentGoalMonth.monthWithGoalInfo) {
        return (
            <Box>
                <Text c="orange">Could not find goal data</Text>
            </Box>
        )
    }

    return (
        <Box style={{
            backgroundColor: 'var(--mantine-color-dark-4)',
            borderRadius: '8px',
            width: '350px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} miw="350" mr="xs" mb="xs" p="md" key={goal.id}>
            {mostRecentGoalMonth.monthWithGoalInfo.goalType === 'SINGLE' ? (
                <CardTransactionOverviewMonthSingleGoal
                    showRewardWhenComplete={true}
                    totalSpendThisMonth={mostRecentGoalMonth.monthOverview.totalSpendThisMonth}
                    goal={mostRecentGoalMonth.monthWithGoalInfo}
                />
            ) : (
                <CardTransactionOverviewMonthRepeatedGoal
                    showRewardWhenComplete={true}
                    goal={mostRecentGoalMonth.monthWithGoalInfo}
                />
            )}
        </Box>
    )
}

export default CardGoal;
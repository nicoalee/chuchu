import { Box, RingProgress, Text, Title } from "@mantine/core";
import { IconCircleCheckFilled, IconRepeatOff } from "@tabler/icons-react";
import { useMemo } from "react";
import { IGoalOverviewMonth } from "../../hooks/useTransactionOverview";
import { ISingleGoal } from "../../models";
import { DateTime } from "luxon";

function CardTransactionOverviewMonthSingleGoal({ goal, totalSpendThisMonth}: { goal: IGoalOverviewMonth, totalSpendThisMonth: number}) {
    const percentage = useMemo(() => {
        if (totalSpendThisMonth > goal.spendRequiredForMonth) {
            return 100;
        } else {
            return Math.round((totalSpendThisMonth / goal.spendRequiredForMonth) * 100)
        }
    }, [goal.spendRequiredForMonth, totalSpendThisMonth])

    const remainingOverallSpendForGoal = useMemo(() => {
        if (goal.totalSpendSinceGoalStartBeforeThisMonth === undefined) return 0;
        const remainder = goal.spendRequired - goal.totalSpendSinceGoalStartBeforeThisMonth - totalSpendThisMonth;
        if (remainder < 0) return 0;
        return Math.round(remainder * 100) / 100
    }, [goal.spendRequired, goal.totalSpendSinceGoalStartBeforeThisMonth, totalSpendThisMonth])

    const remainingSpendRequiredForMonth = useMemo(() => {
        const remainingSpendPerMonth = goal.spendRequiredForMonth - totalSpendThisMonth;
        if (remainingSpendPerMonth <= 0) return 0;
        return Math.round(remainingSpendPerMonth * 100) / 100
    }, [goal.spendRequiredForMonth, totalSpendThisMonth])

    const goalIsCompleted = useMemo(() => {
        return goal.spendRequiredForMonth === 0
    }, [goal.spendRequiredForMonth]);

    const cycleDates = useMemo(() => {
        const goalConfig = goal.goalConfig as ISingleGoal;
        if (!goalConfig.goalStartDate && !goalConfig.goalEndDate) return '';

        const startDate = DateTime.fromISO(goalConfig.goalStartDate as string);
        const endDate = DateTime.fromISO(goalConfig.goalEndDate as string);

        return `${startDate.toLocaleString()} - ${endDate.toLocaleString()}`
    }, [goal.goalConfig])

    if (!goal.isGoalCurrentlyHappening) {
        return <Box style={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text>{goal.goalStatusString}</Text>
        </Box>
    }

    return (
        <Box style={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'column', flexGrow: 1 }} px="xl">
            <Title c={goalIsCompleted ? 'green' : 'gray'} style={{ display: 'flex', alignItems: 'center' }} order={6}>
                <IconRepeatOff style={{ marginRight: '4px' }} />
                {goal?.name}
            </Title>
            <Title order={6} c="darkgray">
                {cycleDates}
            </Title>
            {goalIsCompleted ? (
                <RingProgress label={
                    <Box c="green" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconCircleCheckFilled size={40} />
                    </Box>
                } sections={[{ value: 100, color: 'green' }]}  />
            ) : (
                <RingProgress label={<Text size="lg" fw="bold" ta="center">{percentage}%</Text>} sections={[{value: percentage, color: 'teal'}]} />
            )}

            {goalIsCompleted ? (
                <Box>
                    <Title order={6} c="green">Goal is complete</Title>
                    <br />
                </Box>
            ) : (
                <Box>
                    <Text size="sm" w="190" display="inline-block">Required spend: </Text>
                    <Text size="sm" display="inline" c="yellow">{goal.spendRequiredForMonth}</Text>
                    <br />
                    <Text size="sm" w="190" display="inline-block">Spend this month: </Text>
                    <Text size="sm" display="inline" c="teal">{totalSpendThisMonth || 0}</Text>
                    <br />
                    <Text size="sm" w="190" display="inline-block">Remaining spend required: </Text>
                    <Text size="sm" display="inline" c={remainingSpendRequiredForMonth === 0 ? 'green' : 'red'}>{remainingSpendRequiredForMonth}</Text>
                    <br />
                    <Text size="sm" w="190" display="inline-block">Remaining spend required for goal: </Text>
                    <Text size="sm" display="inline" c={ remainingOverallSpendForGoal === 0 ? 'green' : 'red' }>{remainingOverallSpendForGoal}</Text>
                </Box>
            )}
        </Box>
    )
}

export default CardTransactionOverviewMonthSingleGoal;
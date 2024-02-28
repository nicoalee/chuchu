import { Badge, Box, RingProgress, Text, Title } from "@mantine/core";
import { IconCheck, IconCircleCheckFilled, IconProgress, IconRepeat, IconX } from "@tabler/icons-react";
import { useMemo } from "react";
import { IGoalOverviewMonth } from "../../hooks/useTransactionOverview";
import { IRepeatedGoal } from "../../models";

function CardTransactionOverviewMonthRepeatedGoal({ goal }: { goal: IGoalOverviewMonth}) {
    const percentage = useMemo(() => {
        if (!goal.totalSpendThisCycle) return 0;
        if (goal.totalSpendThisCycle >= goal.spendRequiredForMonth) {
            return 100;
        } else {
            return Math.round((goal.totalSpendThisCycle / goal.spendRequiredForMonth) * 100)
        }
    }, [goal.spendRequiredForMonth, goal.totalSpendThisCycle])

    const goalIsCompletedForCycle = useMemo(() => {
        if (!goal.totalSpendThisCycle) return false;
        return goal.totalSpendThisCycle >= goal.spendRequiredForMonth
    }, [goal.spendRequiredForMonth, goal.totalSpendThisCycle])

    const cycle = useMemo(() => {
        if (goal.cycleInfo?.cycle === undefined) return '';
        const currCycle = goal.cycleInfo.cycle + 1;
        const numRepeats = (goal.goalConfig as IRepeatedGoal).numRepeats;

        if (currCycle > numRepeats) {
            return numRepeats;
        }
        return `${goal.cycleInfo.cycle + 1}`
    }, [goal.cycleInfo?.cycle, goal.goalConfig]);

    const cycleDates = useMemo(() => {
        if (goal.cycleInfo?.currentCyleStart === undefined || goal.cycleInfo?.currentCycleEnd === undefined) return '';
        if (goal.cycleInfo?.cycle === undefined) return '';

        const currCycle = goal.cycleInfo.cycle + 1;
        const numRepeats = (goal.goalConfig as IRepeatedGoal).numRepeats;
        if (currCycle > numRepeats) {
            return `${goal.cycleInfo.currentCyleStart.minus({ months: 1 }).toLocaleString()} - ${goal.cycleInfo.currentCycleEnd.minus({ months: 1, days: 1 }).toLocaleString()}`
        }

        return `${goal.cycleInfo.currentCyleStart.toLocaleString()} - ${goal.cycleInfo.currentCycleEnd.minus({ days: 1 }).toLocaleString()}`
    }, [goal.cycleInfo?.currentCycleEnd, goal.cycleInfo?.currentCyleStart, goal.cycleInfo?.cycle, goal.goalConfig])

    const remainingSpendRequiredForCycle = useMemo(() => {
        if (goal.totalSpendThisCycle === undefined) return '';
        if (goal.totalSpendThisCycle >= goal.spendRequiredForMonth) return 0;
        return Math.round((goal.spendRequiredForMonth - goal.totalSpendThisCycle) * 100) / 100;
    }, [goal.spendRequiredForMonth, goal.totalSpendThisCycle])

    const allCyclesComplete = useMemo(() => {
        return (goal.goalConfig as IRepeatedGoal).numRepeats === goal.cycleInfo?.prevCycles.length;
    }, [goal.cycleInfo?.prevCycles.length, goal.goalConfig])

    if (!goal.isGoalCurrentlyHappening) {
        return <Box style={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text>{goal.goalStatusString}</Text>
        </Box>
    }

    return (
        <Box style={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'column', flexGrow: 1 }} px="xl">
            <Title c={goalIsCompletedForCycle ? 'green' : 'gray'} style={{ display: 'flex', alignItems: 'center' }} order={6}>
                <IconRepeat style={{ marginRight: '4px' }} />
                {goal?.name}
            </Title>
            <Title order={6} c="darkgray">
                {!allCyclesComplete && (
                    <Badge color="yellow" mr="xs" rightSection={<IconProgress size="16" />}>
                        {cycle}
                    </Badge>
                )}
                {cycleDates}
            </Title>
            {goalIsCompletedForCycle ? (
                <RingProgress label={
                    <Box c="green" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconCircleCheckFilled size={40} />
                    </Box>
                } sections={[{ value: 100, color: 'green' }]}  />
            ) : (
                <RingProgress label={<Text size="lg" fw="bold" ta="center">{percentage}%</Text>} sections={[{value: percentage, color: 'teal'}]} />
            )}
            <Box>
                <Box>
                    {(goal.cycleInfo?.prevCycles || []).map((prevCycle) => (
                        <Badge key={prevCycle.cycle} style={{ margin: '2px' }} rightSection={prevCycle.cycleCompleted ? <IconCheck size="16" /> : <IconX size="16" />} color={prevCycle.cycleCompleted ? 'green' : 'red'}>
                            {prevCycle.cycle + 1}
                        </Badge>
                    ))}
                </Box>
                {allCyclesComplete ? (
                    <Title mb="xs" order={6} ta="center" mt="xs" c="green">Goal is complete</Title>
                ) : (
                    <>
                        <Text size="sm" w="180" display="inline-block">Required spend: </Text>
                        <Text size="sm" display="inline" c="yellow">{goal.spendRequiredForMonth}</Text>
                        <br />
                        <Text size="sm" w="180" display="inline-block">Spend this cycle ({cycle}): </Text>
                        <Text size="sm" display="inline" c="teal">{goal.totalSpendThisCycle || 0}</Text>
                        <br />
                        <Text size="sm" w="180" display="inline-block">Remaining spend required: </Text>
                        <Text size="sm" display="inline" c={remainingSpendRequiredForCycle === 0 ? 'green' : 'red'}>{remainingSpendRequiredForCycle}</Text>
                    </>
                )}
            </Box>
        </Box>
    )
}

export default CardTransactionOverviewMonthRepeatedGoal;
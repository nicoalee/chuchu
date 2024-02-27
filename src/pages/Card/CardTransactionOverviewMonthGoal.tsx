import { Box, RingProgress, Text, Title } from "@mantine/core";
import { IGoal } from "../../models";
import { IconRepeat, IconRepeatOff } from "@tabler/icons-react";
import useGetGoalInfo from "../../hooks/useGetGoalInfo";
import { ITransactionOverviewMonth } from "../../hooks/useTransactionOverview";

function CardTransactionOverviewMonthGoal({ goal , transactionOverviewMonth}: { goal: IGoal, transactionOverviewMonth: ITransactionOverviewMonth}) {
    const goalInfo = useGetGoalInfo(goal, transactionOverviewMonth?.key.slice(4, 6), transactionOverviewMonth?.key.slice(0, 4));
    console.log({goalInfo})

    return (
        <Box style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', flexGrow: 1 }} px="xl">
            <Title style={{ display: 'flex', alignItems: 'center' }} order={6}>
                {goal.goalType === 'SINGLE' ? (
                    <IconRepeatOff style={{ marginRight: '4px' }} />
                ) : (
                    <IconRepeat style={{ marginRight: '4px' }} />
                )}
                {goal?.name}
            </Title>
            <RingProgress label={<Text size="lg" fw="bold" ta="center">10%</Text>} sections={[{value: 10, color: 'teal'}]} />

            <Box>
                <Title w="200" display="inline-block" order={6}>Required Spend this month: </Title>
                <Title display="inline" order={6} c="blue">{goal.spendRequired}</Title>
                <br />
                <Title w="200" display="inline-block" order={6}>Current Spend this month: </Title>
                <Title display="inline" order={6} c="teal">{transactionOverviewMonth?.totalSpend || 0}</Title>
                <br />
                <Title w="200" display="inline-block" order={6}>Remaining Spend this month: </Title>
                <Title display="inline" order={6} c="red">{Math.round((goal.spendRequired - transactionOverviewMonth?.totalSpend || 0) * 100) / 100}</Title>

            </Box>

        </Box>
    )
}

export default CardTransactionOverviewMonthGoal;
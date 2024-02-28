import { Box, Card, Title, Text, NumberFormatter } from "@mantine/core"
import CardTransactionOverviewMonthSingleGoal from "./CardTransactionOverviewMonthSingleGoal"
import { ITransactionOverviewMonth } from "../../hooks/useTransactionOverview"
import { IconCash } from "@tabler/icons-react"
import CardTransactionOverviewMonthRepeatedGoal from "./CardTransactionOverviewMonthRepeatedGoal"

function CardTransactionOverviewMonth({ transactionOverviewMonth }: { transactionOverviewMonth: ITransactionOverviewMonth }) {
    return (
        <Card mb="xs">
            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <IconCash /> 
                <Title ml="xs" fw="bold" order={5} ta="left">
                    Total spend this month:{' '}
                    <NumberFormatter prefix="$ " value={transactionOverviewMonth.totalSpendThisMonth} thousandSeparator />
                </Title>
            </Box>
            <Title mb="lg"  ta="left" order={2}>
                {transactionOverviewMonth?.monthName || ''} {transactionOverviewMonth?.yearName || ''}
            </Title>
            <Box style={{ display: 'flex' }}>
                {transactionOverviewMonth.goals.length === 0 && (
                    <Box><Text c="yellow">No goals</Text></Box>
                )}
                {transactionOverviewMonth.goals.map((goal) => (
                    goal.goalType === 'SINGLE' ? (
                        <CardTransactionOverviewMonthSingleGoal key={goal.id} goal={goal} totalSpendThisMonth={transactionOverviewMonth.totalSpendThisMonth}/>
                    ) : (
                        // cannot use spend per month as repeated goals use spend per cycle
                        <CardTransactionOverviewMonthRepeatedGoal key={goal.id} goal={goal}/>
                    )
                ))}
            </Box>
        </Card>
    )
}

export default CardTransactionOverviewMonth
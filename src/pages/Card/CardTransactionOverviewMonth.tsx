import { Box, Card, Title } from "@mantine/core"
import { IGoal } from "../../models"
import CardTransactionOverviewMonthGoal from "./CardTransactionOverviewMonthGoal"
import { ITransactionOverviewMonth } from "../../hooks/useTransactionOverview"

function CardTransactionOverviewMonth({ goals, transactionOverviewMonth }: { goals: IGoal[], transactionOverviewMonth: ITransactionOverviewMonth }) {
    return (
        <Card mb="xs">
            <Title mb="sm" ta="center" order={2}>{transactionOverviewMonth?.monthName || ''} {transactionOverviewMonth?.yearName || ''}</Title>
            <Box style={{ display: 'flex' }}>
                {goals.map((goal) => (
                    <CardTransactionOverviewMonthGoal goal={goal} transactionOverviewMonth={transactionOverviewMonth} key={goal.id} />
                ))}
            </Box>
        </Card>
    )
}

export default CardTransactionOverviewMonth
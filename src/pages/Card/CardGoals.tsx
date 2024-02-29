import { Box, Card, Skeleton, Title } from "@mantine/core";
import useTransactionOverview from "../../hooks/useTransactionOverview";
import { ICard } from "../../models";
import CardGoal from "./CardGoal";
import { budgetId } from "../../configs";

function CardGoals({ card }: { card: Partial<ICard> | undefined }) {
    const { isLoading, transactionOverviewMonths } = useTransactionOverview(
        budgetId,
        card?.ynabCardId,
        card?.openDate as string | undefined,
        card?.closeDate as string | undefined,
        card?.goals || []
    );

    if (isLoading) {
        return (
            <Box mb="md">
                <Card w="350px" h="300px">
                    <Skeleton height={20} mb="sm" />
                    <Skeleton height={20} mb="sm" />
                    <Skeleton style={{ margin: '0 auto' }} mb="sm" circle height={150} width={150} />
                    <Skeleton height={20} mb="sm" />
                    <Skeleton height={20} mb="sm" />
                </Card>
            </Box>
        )
    }

    return (
        <>
            <Title order={3}>Goals</Title>
            <Box my="lg" style={{ display: 'flex', overflowX: 'auto' }}>
                {(card?.goals || []).map((goal) => (
                    <CardGoal key={goal.id} goal={goal} transactionOverviewMonths={transactionOverviewMonths} />
                ))}
            </Box>
        </>
    )
}

export default CardGoals;
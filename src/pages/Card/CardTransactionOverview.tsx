import { Box, Text} from "@mantine/core";
import useTransactionOverview from "../../hooks/useTransactionOverview";
import { ICard } from "../../models";
import CardTransactionOverviewMonth from "./CardTransactionOverviewMonth";
import CardTransactionOverviewSkeleton from "./CardTransactionOverviewSkeleton";

function CardTransactionOverview({accountId, budgetId, card}: { accountId: string | undefined, budgetId: string | undefined, card: Partial<ICard> | undefined }) {
    const { isLoading, transactionOverviewMonths } = useTransactionOverview(
        budgetId,
        accountId,
        card?.openDate as string | undefined,
        card?.closeDate as string | undefined,
        card?.goals || []
    );

    if (isLoading) return (
        <CardTransactionOverviewSkeleton />
    )

    if (transactionOverviewMonths.length === 0) {
        return (
            <Box>
                <Text c="yellow">No transaction history for this card</Text>
            </Box>
        )
    }
    return (
        <Box>
            {transactionOverviewMonths.map((month) => (
                <CardTransactionOverviewMonth key={month.yearName + month.monthName} transactionOverviewMonth={month} />
            ))}
        </Box>
    )
}

export default CardTransactionOverview;
import { Box } from "@mantine/core";
import useTransactionOverview from "../../hooks/useTransactionOverview";
import { ICard } from "../../models";
import CardTransactionOverviewMonth from "./CardTransactionOverviewMonth";
import CardTransactionOverviewSkeleton from "./CardTransactionOverviewSkeleton";

function CardTransactionOverview({accountId, budgetId, card}: { accountId: string | undefined, budgetId: string | undefined, card: Partial<ICard> | undefined }) {
    const { isLoading, transactionOverviewMonths } = useTransactionOverview(budgetId, accountId, card?.openDate as string | undefined);

    if (isLoading) return (
        <CardTransactionOverviewSkeleton />
    )
    return (
        <Box>
            {transactionOverviewMonths.map((month) => (
                <CardTransactionOverviewMonth key={month.key} transactionOverviewMonths={month} goals={card?.goals || []} />
            ))}
        </Box>
    )
}

export default CardTransactionOverview;
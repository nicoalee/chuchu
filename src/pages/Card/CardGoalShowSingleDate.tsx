import { Box, Text } from "@mantine/core";
import { ISingleGoal } from "../../models";
import { useMemo } from "react";
import { IGoalOverviewMonth } from "../../hooks/useTransactionOverview";

function CardGoalShowSingleDate({ goalOverviewMonth }:{goalOverviewMonth: IGoalOverviewMonth}) {


    return (
        <Box>
            <Text size="xs">a -b</Text>
        </Box>
    )
}

export default CardGoalShowSingleDate;
import { Box, Text } from "@mantine/core";
import { ISingleGoal } from "../../models";
import { useMemo } from "react";

function CardGoalShowSingleDate({ goalConfig }:{goalConfig: ISingleGoal}) {
    const startDate = useMemo(() => {
        if (!goalConfig?.goalStartDate) {
            return 'no date';
        } else if (typeof goalConfig.goalStartDate === 'string') {
            const startDateObj = new Date(goalConfig.goalStartDate);
            return startDateObj.toLocaleDateString('en-us') ;
        } else if (typeof goalConfig.goalStartDate === 'object') {
            return (goalConfig.goalStartDate as Date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        } else {
            return 'no date';
        }
    }, [goalConfig?.goalStartDate]);

    const endDate = useMemo(() => {
        if (!goalConfig?.goalEndDate) {
            return 'no date';
        } else if (typeof goalConfig.goalEndDate === 'string') {
            const goalEndDate = new Date(goalConfig.goalEndDate);
            return goalEndDate.toLocaleDateString('en-us') ;
        } else if (typeof goalConfig.goalEndDate === 'object') {
            return (goalConfig.goalEndDate as Date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
        } else {
            return 'no date';
        }
    }, [goalConfig?.goalEndDate])

    return (
        <Box>
            <Text size="xs">{startDate} - {endDate}</Text>
        </Box>
    )
}

export default CardGoalShowSingleDate;
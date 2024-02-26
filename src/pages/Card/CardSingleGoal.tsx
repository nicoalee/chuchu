import { Box, Text } from "@mantine/core";
import { ISingleGoal } from "../../models";
import { useMemo } from "react";

function CardSingleGoal({ goalConfig }:{goalConfig: ISingleGoal}) {
    const startDate = useMemo(() => {
        if (!goalConfig?.goalStartDate) {
            return 'caanot get date';
        } else if (typeof goalConfig.goalStartDate === 'string') {
            const endDate = new Date(goalConfig.goalStartDate);
            return endDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) ;
        } else if (typeof goalConfig.goalStartDate === 'object) {

        } else {

        }
        }
    }, []);

    const endDate = useMemo(() => {
        if (typeof goalConfig.goalEndDate === 'string') {
            const endDate = new Date(goalConfig.goalEndDate);
            return endDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric" });
        } else if (typeof goalConfig.goalEndDate === 'object') {

        }
    }, [])

    return (
        <Box>
            <Text>{goalConfig?.goalStartDate || ''}</Text> - <Text>{goalConfig?.goalEndDate || ''}</Text>
        </Box>
    )
}

export default CardSingleGoal;
import { Box, Text } from "@mantine/core";
import { IRepeatedGoal } from "../../models";
import { useMemo } from "react";
import { DateTime } from "luxon";

function CardGoalShowRepeatedDate({ goalConfig }:{goalConfig: IRepeatedGoal}) {
    const startDate = useMemo(() => {
        if (!goalConfig?.goalStartDate) {
            return 'no date';
        } else if (typeof goalConfig.goalStartDate === 'string') {
            const startDateObj = new Date(goalConfig.goalStartDate);
            return startDateObj.toLocaleDateString('en-us') ;
        } else if (typeof goalConfig.goalStartDate === 'object') {
            return (goalConfig.goalStartDate as Date).toLocaleDateString('en-us')
        } else {
            return 'no date';
        }
    }, [goalConfig?.goalStartDate]);

    const nextMilestone = useMemo(() => {
        if (!goalConfig?.goalStartDate) return 'No date';
        // start from the goal start date
        let milestoneDate = typeof goalConfig.goalStartDate === 'string' ? DateTime.fromISO(goalConfig.goalStartDate) : DateTime.fromJSDate(goalConfig.goalStartDate as Date);
        for(let i = 0; i < goalConfig.numRepeats; i++) {
            milestoneDate = milestoneDate.plus({ months: 1 }); // in the future, repeatType might change. For now, just assume it's monthly
            const duration = milestoneDate.diffNow('days')
            // diffNow calculates based on GIVEN_DATE - NOW. If positive, GIVEN_DATE is later. If negative, GIVEN_DATE is earlier
            if (duration.days > 0) {
                return `${milestoneDate.month}/${milestoneDate.day}/${milestoneDate.year}`;
            }
        }
    }, [goalConfig.goalStartDate, goalConfig.numRepeats])

    return (
        <Box>
            <Text size="xs">Started: {startDate}</Text>
            <Text size="xs">Next milestone: {nextMilestone}</Text>
        </Box>
    )
}

export default CardGoalShowRepeatedDate;

// Jan 01 2023 - Feb 01 2023 0
// Feb 01 2023 - Mar 01 2023 1
// Mar 01 2023 - Apr 01 2023 2
// Apr 01 2023 - May 01 2023 3
// May 01 2023 - Jun 01 2023 4
// Jun 01 2023 - Jul 01 2023 5
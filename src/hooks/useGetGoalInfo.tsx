import { useMemo } from "react"
import { IGoal, ISingleGoal } from "../models"
import { DateTime } from "luxon";

function useGetGoalInfo(goal: IGoal | undefined, month: string, year: string) {
    const goalInfo = useMemo(() => {
        if (!goal) return;

        const requiredSpendThisMonth = goal.spendRequired;

        if (goal.goalType === 'SINGLE') {
            const goalConfig = goal.goalConfig as ISingleGoal;
            const luxonGoalStartDate = DateTime.fromISO(goalConfig.goalStartDate as string);
            const luxonGoalEndDate = DateTime.fromISO(goalConfig.goalEndDate as string);
            const diffDays = Math.round(luxonGoalEndDate.diff(luxonGoalStartDate, 'days').days); // it is validated when creating a date that endDate will always be after startDate
            console.log({diffDays})
            // get num days between start date and end date for goal
            // divide requiredSpendThisMonth by num days
            // multiply by num days in the given month
            //      exception occurs if month is the first month or the current month - then need to calculate based on remaining days
        } else {
            // get goal start date
            // see if this month falls within the range of the goal
            // if not, then nothing. If so, then divide requiredSpend by num days in the given month
            // again, exception occurs if month is the first month or the current month - then need to calculate based on remaining days
        }

        // return {
        //     requiredSpendThisMonth: 
        // }
    }, [goal])

    return goalInfo
}

export default useGetGoalInfo
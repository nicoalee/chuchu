import { IGoal, useGetGoals } from "CardStore";

const getMinSpendFromGoals = (goals: IGoal[]) => {

}

const useGetRequiredSpend = (cardId?: string) => {
    const goals = useGetGoals(cardId || '');

    return getMinSpendFromGoals(goals)
}

export default useGetRequiredSpend;
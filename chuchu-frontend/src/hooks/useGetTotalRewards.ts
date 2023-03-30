import { useGetCardTransactions } from "CardStore";
import { useEffect, useState } from "react";

const useGetTotalRewards = (cardId: string) => {
    const [ totalRewards, setTotalRewards ] = useState(0);
    const transactions = useGetCardTransactions(cardId)

    useEffect(() => {
        const total = transactions.reduce((acc, curr) => {
            return acc + (curr.hardCodedReward ? curr.hardCodedReward : Math.round(curr.amount * curr.category.rewardRatio))
        }, 0)
        setTotalRewards(total)
    }, [transactions])
    
    return totalRewards;
}

export default useGetTotalRewards;
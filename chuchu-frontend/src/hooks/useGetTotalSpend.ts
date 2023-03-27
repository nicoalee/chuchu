import { useGetCardTransactions } from "CardStore";
import { useEffect, useState } from "react";

const useGetTotalSpend = (cardId: string) => {
    const [ totalRewards, setTotalRewards ] = useState(0);
    const transactions = useGetCardTransactions(cardId)

    useEffect(() => {
        const total = transactions.reduce((acc, curr) => {
            return acc + (curr.amount)
        }, 0)
        setTotalRewards(Math.round(total * 100) / 100);
    }, [transactions])
    
    return totalRewards;
}

export default useGetTotalSpend;
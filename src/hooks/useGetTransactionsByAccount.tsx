import { useQuery } from "react-query";
import * as ynab from 'ynab';

function useGetTransactionsByAccount(budgetId: string, accountId: string, sinceDate?: string) {
    return useQuery(
        ['transactions', budgetId, accountId, sinceDate],
        () => {
            const ynabAPI = new ynab.API(import.meta.env.VITE_YNAB_ACCESS_TOKEN);
            return ynabAPI.transactions.getTransactionsByAccount(budgetId, accountId, sinceDate)
        },
        {
            enabled: !!budgetId && !!accountId
        }
    );
}

export default useGetTransactionsByAccount;
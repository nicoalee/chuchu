import { useQuery } from "react-query";
import * as ynab from 'ynab';

function useGetAccountById(budgetId: string, accountId: string) {
    return useQuery(
        [budgetId, accountId],
        () => {
            const ynabAPI = new ynab.API(import.meta.env.VITE_YNAB_ACCESS_TOKEN);
            return ynabAPI.accounts.getAccountById(budgetId, accountId);
        },
        {
            enabled: !!budgetId && !!accountId,
            select: res => res.data.account
        }
    )
}

export default useGetAccountById;
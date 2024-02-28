import { useQuery } from "react-query";
import * as ynab from 'ynab';

function useGetAccountsByBudgetId(budgetId: string) {
    return useQuery(
        ['accounts', budgetId],
        () => {
            const ynabAPI = new ynab.API(import.meta.env.VITE_YNAB_ACCESS_TOKEN);
            return ynabAPI.accounts.getAccounts(budgetId)
        },
        {
            select: (res) => {
                return res.data.accounts.sort((a, b) => a.name.localeCompare(b.name))
            },
            enabled: !!budgetId
        }
    );
}

export default useGetAccountsByBudgetId;
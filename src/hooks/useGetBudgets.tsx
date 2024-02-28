import { useQuery } from "react-query";
import * as ynab from 'ynab';

function useGetBudgets() {
    return useQuery(
        ['budgets'],
        () => {
            const ynabAPI = new ynab.API(import.meta.env.VITE_YNAB_ACCESS_TOKEN);
            return ynabAPI.budgets.getBudgets();
        },
        {
            select: (res) => {
                return res.data.budgets.sort((a, b) => {
                    const dateB = new Date(b.last_modified_on || '');
                    const dateA = new Date(a.last_modified_on || '')
    
                    return dateB.valueOf() - dateA.valueOf(); // typescript complains if we dont give valueOf()
                })
            }
        }
    );
}

export default useGetBudgets;
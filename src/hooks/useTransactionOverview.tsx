import { DateTime } from "luxon";
import { useMemo } from "react";
import useGetTransactionsByAccount from "./useGetTransactionsByAccount";

export interface ITransactionOverviewMonth {
    monthName: string; // January
    yearName: string; // 2023
    totalSpend: number;
    key: string;
}

const numToMonth: { [key: string]: string } = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
}

const createMappingFromMonths = (ccOpenDate: string) => {
    const mapping = new Map<string, number>();
    let luxonCCOpenDate = DateTime.fromISO(ccOpenDate);
    while(luxonCCOpenDate.diffNow('days').days < 0) {
        mapping.set(`${luxonCCOpenDate.year}${luxonCCOpenDate.month < 10 ? '0' : ''}${luxonCCOpenDate.month}`, 0);
        luxonCCOpenDate = luxonCCOpenDate.plus({ months: 1 })
    }
    return mapping;
}

const getMappingKey = (date: DateTime) => {
    return `${date.year}${date.month < 10 ? '0' : ''}${date.month}`
}

function useTransactionOverview(budgetId: string | undefined, accountId: string | undefined, openDate: string | undefined) {
    const { data, isLoading, isError } = useGetTransactionsByAccount(budgetId || '', accountId || '');
    const transactionOverviewMonths = useMemo(() => {
        if (!data || !openDate) return [];

        const mapping = createMappingFromMonths(openDate);
        data.forEach((transaction) => {
            // we only want recorded payments
            if (transaction.amount >= 0) return;
            const luxonTransactionDate = DateTime.fromISO(transaction.date);
            const key = getMappingKey(luxonTransactionDate);
            if (mapping.has(key)) {
                mapping.set(key, (mapping.get(key) as number) + ((transaction.amount * -1)));
            }
        })

        return Array.from(mapping.entries()).map(([key, value]) => ({
            key,
            totalSpend: value / 1000,
            monthName: numToMonth[key.slice(4, key.length)],
            yearName: key.slice(0, 4)
        })).sort((a, b) => {
            return b.key.localeCompare(a.key);
        }) as ITransactionOverviewMonth[]
    }, [data, openDate])
    return {
        transactionOverviewMonths, isLoading, isError
    }
}

export default useTransactionOverview;
import { Container, Group, SegmentedControl, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import CardSummaryListView from "./CardSummaryListView";
import * as ynab from 'ynab'
import CardSummaryTimelineView from "./CardSummaryTimelineView";

function CardSummary() {
    const [ viewMode, setViewMode ] = useState<'LIST VIEW' | 'TIMELINE VIEW'>('LIST VIEW')
    const [allAccounts, setAllAccounts] = useState<ynab.Account[]>([]);

    useEffect(() => {
        if (allAccounts.length > 0) return;

        const ynabAPI = new ynab.API(import.meta.env.VITE_YNAB_ACCESS_TOKEN);
        ynabAPI.budgets.getBudgets().then((response) => {
            return response.data.budgets[1].id
        }).then((budgetId) => {
            return ynabAPI.accounts.getAccounts(budgetId)
        }).then((response) => {
            const accounts = response.data.accounts.filter((account) => account.type === 'creditCard')
            setAllAccounts(accounts);
        })
    }, [allAccounts.length])

    return (
        <Container m="xs" w="100%" maw="100%">
            <Group justify="space-between">
                <Title mb="lg" style={{ textAlign: 'start' }}>Cards Summary</Title>
                <SegmentedControl value={viewMode} onChange={(val) => setViewMode(val as 'LIST VIEW' | 'TIMELINE VIEW')} data={['LIST VIEW', 'TIMELINE VIEW']} size="md" />
            </Group>

            {
                viewMode === 'LIST VIEW' && (
                    <CardSummaryListView allAccounts={allAccounts} />
                )
            }
            {
                viewMode === 'TIMELINE VIEW' && (
                    <CardSummaryTimelineView allAcounts={allAccounts} />
                )
            }



        </Container>
    )
}

export default CardSummary
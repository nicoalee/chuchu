import { Container, Group, LoadingOverlay, SegmentedControl, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import CardSummaryListView from "./CardSummaryListView";
import * as ynab from 'ynab'
import CardSummaryTimelineView from "./CardSummaryTimelineView";
import useGetAccountsByBudgetId from "../../hooks/useGetAccountsByBudgetId";
import { budgetId } from "../../configs";

function CardSummary() {
    const [ viewMode, setViewMode ] = useState<'LIST VIEW' | 'TIMELINE VIEW'>('LIST VIEW')
    const { data, isLoading } = useGetAccountsByBudgetId(budgetId || '');

    return (
        <Container m="xs" w="100%" maw="100%">
            <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Group justify="space-between">
                <Title mb="lg" style={{ textAlign: 'start' }}>Cards Summary</Title>
                <SegmentedControl value={viewMode} onChange={(val) => setViewMode(val as 'LIST VIEW' | 'TIMELINE VIEW')} data={['LIST VIEW', 'TIMELINE VIEW']} size="md" />
            </Group>

            {
                viewMode === 'LIST VIEW' && (
                    <CardSummaryListView allAccounts={data || []} />
                )
            }
            {
                viewMode === 'TIMELINE VIEW' && (
                    <CardSummaryTimelineView /> //allAcounts={allAccounts} 
                )
            }



        </Container>
    )
}

export default CardSummary
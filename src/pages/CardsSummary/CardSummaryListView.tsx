import { Box, Accordion } from "@mantine/core"
import CardSummaryCard from "./CardSummaryCard"
import * as ynab from 'ynab';
import { useEffect, useState } from "react";

function CardSummaryListView({  allAccounts }:{allAccounts: ynab.Account[]}) {
    const [accounts, setAccounts] = useState<ynab.Account[]>([]);
    const [closedAccounts, setClosedAccounts] = useState<ynab.Account[]>([])

    useEffect(() => {
        const accounts = allAccounts.filter((account) => account.type === 'creditCard' && account.closed === false)
        setAccounts(accounts);
        const closedAccounts = allAccounts.filter((account) => account.type === 'creditCard' && account.closed === true)
        setClosedAccounts(closedAccounts)
    }, [allAccounts])
    
    return (
        <Box>
            <Accordion variant="filled" defaultValue="openCards">
                <Accordion.Item value="openCards">
                    <Accordion.Control>Active Cards</Accordion.Control>
                    <Accordion.Panel>
                        <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {
                                accounts.map((account) => (
                                    <CardSummaryCard key={account.id} {...account} />
                                ))
                            }
                        </Box>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="closedCards">
                    <Accordion.Control>Closed cards</Accordion.Control>
                    <Accordion.Panel>
                        <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {
                                closedAccounts.map((account) => (
                                    <CardSummaryCard key={account.id} {...account} />
                                ))
                            }
                        </Box>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Box>
    )
}

export default CardSummaryListView
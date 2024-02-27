import { Anchor, Box, Breadcrumbs, Button, Container, SegmentedControl } from "@mantine/core";
import { IconEdit, IconHistory } from "@tabler/icons-react";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { budgetId, getFirebaseApp } from "../../configs";
import { ICard } from "../../models";
import CardBenefits from "./CardBenefits";
import CardEarnRates from "./CardEarnRates";
import CardGoals from "./CardGoals";
import CardHeading from "./CardHeading";
import CardTransactionOverview from "./CardTransactionOverview";

function Card() {
    const [card, setCard] = useState<Partial<ICard>>();
    const { cardId } = useParams<{ cardId: string }>();
    const [ view, setView ] = useState<'SUMMARY' | 'TRANSACTION_OVERVIEW'>('SUMMARY')
    // const { data, isLoading } = useGetTransactionsByAccount(budgetId || '', cardId || '', undefined);

    useEffect(() => {
        if (!cardId) return;

        const app = getFirebaseApp();
        const db = getDatabase(app);
        const reference = ref(db, `cards/${cardId}`)
        const unsub = onValue(reference, (snapshot) => {
            setCard(snapshot.val());
        })

        return () => unsub();
    }, [cardId])

    const handleOpenHistoryModal = () => {
        console.log('open history modal')
    }

    return (
        <Container m="xs" w="100%" maw="100%">
            <Box mb="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Breadcrumbs>
                    <Anchor component={NavLink} to="/cards-summary">Cards Summary</Anchor>
                    <Anchor>{card?.name}</Anchor>
                </Breadcrumbs>
                <Box>
                    <Button onClick={handleOpenHistoryModal} color="grape" w="150" mr="xs" rightSection={<IconHistory />}>Card History</Button>
                    <Button component={NavLink} to={`/cards/${cardId}/edit`} w="150" rightSection={<IconEdit />}>Edit details</Button>
                </Box>
            </Box>

            <Box ta="left">
                <CardHeading card={card} />

                <SegmentedControl onChange={(val) => setView(val as 'SUMMARY' | 'TRANSACTION_OVERVIEW')} my="lg" data={[ { value: 'SUMMARY', label: 'Summary' }, { value: 'TRANSACTION_OVERVIEW', label: 'Transaction Overview' } ]} fullWidth size="md" />

                {view === 'SUMMARY' ? (
                    <>
                        <CardGoals goals={card?.goals || []} />
                        <CardEarnRates earnRates={card?.earnRates || []} />
                        <CardBenefits benefits={card?.benefits || []} />
                    </>
                ) : (
                    <CardTransactionOverview accountId={cardId} budgetId={budgetId} card={card} />
                )}
            </Box>
        </Container>
    )
}

export default Card;
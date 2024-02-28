import { Anchor, Box, Breadcrumbs, Container, SegmentedControl } from "@mantine/core";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { budgetId, getFirebaseApp } from "../../configs";
import { ICard } from "../../models";
import CardBenefits from "../Card/CardBenefits";
import CardEarnRates from "../Card/CardEarnRates";
import CardGoals from "../Card/CardGoals";
import CardHeading from "../Card/CardHeading";
import CardTransactionOverview from "../Card/CardTransactionOverview";

function OldCard() {
    const [oldCard, setOldCard] = useState<Partial<ICard>>();
    const [cardName, setCardName] = useState();
    const { cardId, oldCardIndex } = useParams<{ cardId: string, oldCardIndex: string }>();
    const [ view, setView ] = useState<'SUMMARY' | 'TRANSACTION_OVERVIEW'>('SUMMARY')

    useEffect(() => {
        if (!cardId) return;

        const app = getFirebaseApp();
        const db = getDatabase(app);
        const reference = ref(db, `cards/${cardId}`)
        const unsub = onValue(reference, (snapshot) => {
            if (oldCardIndex === undefined) return;
            const index = parseInt(oldCardIndex);
            if (snapshot.val().tradeline?.[index]) {
                setCardName(snapshot.val().name)
                setOldCard(snapshot.val().tradeline?.[index])
            }
        })

        return () => unsub();
    }, [cardId, oldCardIndex])

    return (
        <Container m="xs" w="100%" maw="100%">
            <Box mb="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Breadcrumbs>
                    <Anchor component={NavLink} to="/cards-summary">Cards Summary</Anchor>
                    <Anchor component={NavLink} to={`/cards/${cardId}`}>{cardName}</Anchor>
                    <Anchor>[OLD] {oldCard?.name}</Anchor>
                </Breadcrumbs>
            </Box>
            <Box my="xl">
                <CardHeading card={oldCard} />

                <SegmentedControl
                    onChange={(val) => setView(val as 'SUMMARY' | 'TRANSACTION_OVERVIEW')}
                    my="lg"
                    data={[
                        { value: 'SUMMARY', label: 'Summary' },
                        { value: 'TRANSACTION_OVERVIEW', label: 'Transaction Overview' },
                    ]}
                    fullWidth
                    size="md"
                />

                {view === 'SUMMARY' && (
                    <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        <CardGoals card={oldCard} />
                        <CardEarnRates earnRates={oldCard?.earnRates || []} />
                        <CardBenefits benefits={oldCard?.benefits || []} />
                    </Box>
                )}
                {view === 'TRANSACTION_OVERVIEW' && (
                    <CardTransactionOverview accountId={cardId} budgetId={budgetId} card={oldCard} />
                )}
            </Box>
        </Container>
    )
}

export default OldCard;